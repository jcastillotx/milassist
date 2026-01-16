import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function testAdminLogin() {
  try {
    const payload = await getPayload({ config })

    // Try to login as admin
    const result = await payload.login({
      collection: 'users',
      data: {
        email: 'admin@milassist.com',
        password: 'admin123!'
      }
    })

    console.log('Login successful:', result.user)
    console.log('Token:', result.token)
  } catch (error) {
    console.error('Login failed:', error.message)
  } finally {
    process.exit(0)
  }
}

testAdminLogin()
