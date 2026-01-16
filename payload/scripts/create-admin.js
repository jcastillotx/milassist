import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function createAdmin() {
  try {
    const payload = await getPayload({ config })

    // Check if admin user already exists
    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@milassist.com'
        }
      }
    })

    if (existingAdmin.docs.length > 0) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin User',
        email: 'admin@milassist.com',
        password: 'admin',
        role: 'admin'
      }
    })

    console.log('Admin user created successfully:', adminUser.id)
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    process.exit(0)
  }
}

createAdmin()
