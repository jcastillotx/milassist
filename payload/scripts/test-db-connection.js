#!/usr/bin/env node

/**
 * Test Database Connection Script
 * 
 * This script tests the connection to your Supabase PostgreSQL database.
 * 
 * Usage:
 *   node scripts/test-db-connection.js
 * 
 * Requirements:
 *   - .env file with DATABASE_URI configured
 *   - pg package installed (npm install pg)
 */

require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('🔍 Testing Supabase Database Connection...\n');

  const databaseUri = process.env.DATABASE_URI;

  if (!databaseUri) {
    console.error('❌ ERROR: DATABASE_URI not found in environment variables');
    console.error('   Please create a .env file with DATABASE_URI set');
    console.error('   Example: DATABASE_URI=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres?sslmode=require\n');
    process.exit(1);
  }

  // Mask password in output
  const maskedUri = databaseUri.replace(/:([^:@]+)@/, ':****@');
  console.log('📍 Connection String:', maskedUri);
  console.log('');

  const client = new Client({
    connectionString: databaseUri,
  });

  try {
    console.log('⏳ Connecting to database...');
    await client.connect();
    console.log('✅ Successfully connected to database!\n');

    // Test query
    console.log('⏳ Running test query...');
    const result = await client.query('SELECT version(), current_database(), current_user');
    console.log('✅ Query successful!\n');

    console.log('📊 Database Information:');
    console.log('   PostgreSQL Version:', result.rows[0].version.split(' ')[0], result.rows[0].version.split(' ')[1]);
    console.log('   Database Name:', result.rows[0].current_database);
    console.log('   Connected User:', result.rows[0].current_user);
    console.log('');

    // Check for existing Payload tables
    console.log('⏳ Checking for Payload CMS tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 0) {
      console.log('ℹ️  No tables found - this is expected for a new database');
      console.log('   Tables will be created automatically when you run the application\n');
    } else {
      console.log(`✅ Found ${tablesResult.rows.length} table(s):\n`);
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
      console.log('');
    }

    console.log('🎉 Database connection test completed successfully!');
    console.log('   You can now run: npm run dev\n');

  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error Details:');
    console.error('   Message:', error.message);
    console.error('   Code:', error.code || 'N/A');
    console.error('');

    // Provide helpful troubleshooting tips
    console.error('💡 Troubleshooting Tips:');
    
    if (error.message.includes('password authentication failed')) {
      console.error('   • Check your database password is correct');
      console.error('   • Reset password in Supabase Dashboard → Settings → Database');
    } else if (error.message.includes('Connection refused') || error.message.includes('ECONNREFUSED')) {
      console.error('   • Check your Supabase project is active (not paused)');
      console.error('   • Verify the connection string is correct');
      console.error('   • Ensure you have internet connectivity');
    } else if (error.message.includes('SSL') || error.message.includes('certificate')) {
      console.error('   • Ensure connection string ends with ?sslmode=require');
      console.error('   • Example: postgresql://...postgres?sslmode=require');
    } else if (error.message.includes('does not exist')) {
      console.error('   • Check database name in connection string (should be "postgres")');
      console.error('   • Verify project reference is correct');
    } else {
      console.error('   • Double-check your DATABASE_URI in .env file');
      console.error('   • Verify Supabase project is running');
      console.error('   • Check Supabase Dashboard for any issues');
    }
    
    console.error('');
    console.error('📚 For more help, see: SUPABASE_SETUP.md\n');
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the test
testConnection();
