import { NextRequest, NextResponse } from 'next/server'

const MICROSOFT_AUTH_URL = 'https://login.microsoftonline.com'
const MICROSOFT_TOKEN_URL = 'https://login.microsoftonline.com'
const MICROSOFT_USERINFO_URL = 'https://graph.microsoft.com/v1.0/me'

// Initiate Microsoft OAuth flow
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'callback') {
    return handleCallback(request)
  }

  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common'

  // Redirect to Microsoft OAuth
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID || '',
    redirect_uri: process.env.MICROSOFT_REDIRECT_URI || '',
    response_type: 'code',
    scope: 'openid email profile User.Read',
    response_mode: 'query',
  })

  return NextResponse.redirect(
    `${MICROSOFT_AUTH_URL}/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`
  )
}

// Handle OAuth callback
async function handleCallback(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/login?error=${error}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/login?error=no_code`
    )
  }

  try {
    const tenantId = process.env.MICROSOFT_TENANT_ID || 'common'

    // Exchange code for tokens
    const tokenResponse = await fetch(
      `${MICROSOFT_TOKEN_URL}/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.MICROSOFT_CLIENT_ID || '',
          client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
          redirect_uri: process.env.MICROSOFT_REDIRECT_URI || '',
          grant_type: 'authorization_code',
        }),
      }
    )

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      throw new Error('No access token received')
    }

    // Get user info
    const userInfoResponse = await fetch(MICROSOFT_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const userInfo = await userInfoResponse.json()

    // Import payload to create/update user
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config: await import('@/payload.config') })

    // Check if user exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            ssoProvider: {
              equals: 'microsoft',
            },
          },
          {
            ssoId: {
              equals: userInfo.id,
            },
          },
        ],
      },
    })

    let user

    if (existingUsers.docs.length > 0) {
      // Update existing user
      user = existingUsers.docs[0]
      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          lastLogin: new Date().toISOString(),
        },
      })
    } else {
      // Create new user
      user = await payload.create({
        collection: 'users',
        data: {
          email: userInfo.mail || userInfo.userPrincipalName,
          name: userInfo.displayName || userInfo.mail || userInfo.userPrincipalName,
          ssoProvider: 'microsoft',
          ssoId: userInfo.id,
          role: 'client', // Default role
          isActive: true,
          profileData: {
            jobTitle: userInfo.jobTitle,
            officeLocation: userInfo.officeLocation,
            mobilePhone: userInfo.mobilePhone,
          },
        },
      })
    }

    // Generate JWT token
    const token = await payload.login({
      collection: 'users',
      data: {
        email: user.email,
      },
      req: request as any,
    })

    // Redirect to admin with token
    const response = NextResponse.redirect(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin`
    )
    
    response.cookies.set('payload-token', token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200, // 2 hours
    })

    return response
  } catch (error) {
    console.error('Microsoft OAuth error:', error)
    return NextResponse.redirect(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/login?error=oauth_failed`
    )
  }
}
