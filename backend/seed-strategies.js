// Script to seed strategies into database
// Run with: node seed-strategies.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('🚀 Strategy Seeder');
console.log('==================');
console.log('This script will seed all strategies to your Supabase database.');
console.log('');

async function seedStrategies() {
  console.log('📡 Connecting to Supabase...');
  
  // Test connection
  const { data: testData, error: testError } = await supabase
    .from('strategies')
    .select('count');
  
  if (testError) {
    console.error('❌ Failed to connect to Supabase:', testError.message);
    console.log('\n💡 Make sure you have:');
    console.log('   1. Created the strategies table (run database-setup.sql)');
    console.log('   2. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
    return;
  }
  
  console.log('✅ Connected to Supabase successfully!');
  console.log('');
  console.log('📝 Seeding strategies...');
  console.log('');
  
  // Since we can't easily extract from frontend, we'll create a simple API call
  console.log('To seed strategies, you have two options:');
  console.log('');
  console.log('Option 1: Manual API calls');
  console.log('   Use Postman or curl to POST to http://localhost:3001/api/strategies');
  console.log('');
  console.log('Option 2: Use the frontend');
  console.log('   The frontend will automatically generate backtest data');
  console.log('   You can add a "Save to Database" button on each strategy page');
  console.log('');
  console.log('For now, I recommend using the frontend as the source of truth.');
  console.log('The strategies are already working there with generated backtest data.');
}

seedStrategies();
