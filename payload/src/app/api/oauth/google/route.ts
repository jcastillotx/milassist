import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

// Initiate Google OAuth flow
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'callback') {
    return handleCallback(request)
  }

  // Redirect to Google OAuth
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })

  return NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`)
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
    // Exchange code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      throw new Error('No access token received')
    }

    // Get user info
    const userInfoResponse = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const userInfo = await userInfoResponse.json()

    // Import payload to create/update user
    const { getPayload } = await import('payload')
    const configModule = await import('@/payload.config')
    const payload = await getPayload({ config: configModule.default })

    // Check if user exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        and: [
          {
            ssoProvider: {
              equals: 'google',
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
          email: userInfo.email,
          name: userInfo.name || userInfo.email,
          ssoProvider: 'google',
          ssoId: userInfo.id,
          role: 'client', // Default role
          isActive: true,
          profileData: {
            picture: userInfo.picture,
            verified_email: userInfo.verified_email,
          },
        },
      })
    }

    // Generate JWT token for OAuth user
    const payloadCMS = (await import('payload')).default
    const token = payloadCMS.generateToken({
      id: user.id,
      email: user.email,
      collection: 'users',
    })

    // Set JWT cookie and redirect to admin
    const response = NextResponse.redirect(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin`
    )
    
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/admin/login?error=oauth_failed`
    )
  }
}
