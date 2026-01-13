import payload from 'payload';
import { getPayload } from 'payload';

async function createAdminUser() {
  try {
    // Initialize Payload
    const payloadInstance = await getPayload({
      config: (await import('../src/payload.config.js')).default,
    });

    // Create admin user
    const adminUser = await payloadInstance.create({
      collection: 'users',
      data: {
        email: 'admin@milassist.com',
        password: 'admin123!',
        name: 'Admin User',
        role: 'admin',
      },
    });

    console.log('Admin user created successfully:', adminUser);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
