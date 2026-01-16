// Create Admin User Script
// Usage: node scripts/create-admin.js
// Uses environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME

const payload = require('../src/payload.config.js')

async function createAdmin() {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'default-secret-change-me',
      local: true,
    })

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@milassist.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminName = process.env.ADMIN_NAME || 'Admin User'

    console.log('Creating admin user...')
    console.log(`Email: ${adminEmail}`)
    console.log('Password: [HIDDEN]')

    // Check if admin already exists
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: adminEmail,
        },
      },
    })

    if (existing.docs.length > 0) {
      console.log('Admin user already exists. Updating...')
      
      await payload.update({
        collection: 'users',
        id: existing.docs[0].id,
        data: {
          name: adminName,
          password: adminPassword,
          role: 'admin',
          active: true,
        },
      })
      
      console.log('Admin user updated successfully!')
    } else {
      console.log('Creating new admin user...')
      
      await payload.create({
        collection: 'users',
        data: {
          email: adminEmail,
          name: adminName,
          password: adminPassword,
          role: 'admin',
          active: true,
        },
      })
      
      console.log('Admin user created successfully!')
    }

    process.exit(0)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createAdmin()

