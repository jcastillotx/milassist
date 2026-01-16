import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../../payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { email, password } = await request.json()

    const result = await payload.login({
      collection: 'users',
      data: { email, password }
    })

    return NextResponse.json({
      success: true,
      user: result.user,
      token: result.token
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Login failed'
    }, { status: 401 })
  }
}
