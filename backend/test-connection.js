// Test database connection and table existence
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Test 1: Connection
  console.log('1. Testing connection...');
  try {
    const { data, error } = await supabase.from('users').select('count');
    if (error) {
      console.log('   ⚠️  Users table:', error.message);
    } else {
      console.log('   ✅ Connected to Supabase!');
    }
  } catch (err) {
    console.log('   ❌ Connection failed:', err.message);
  }
  
  // Test 2: Strategies table
  console.log('\n2. Checking strategies table...');
  try {
    const { data, error } = await supabase.from('strategies').select('count');
    if (error) {
      console.log('   ❌ Strategies table does not exist!');
      console.log('   Error:', error.message);
      console.log('\n   📝 Action needed:');
      console.log('   1. Go to Supabase Dashboard → SQL Editor');
      console.log('   2. Copy content from backend/database-setup.sql');
      console.log('   3. Run the SQL to create the table');
    } else {
      console.log('   ✅ Strategies table exists!');
      console.log('   Current count:', data);
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  
  // Test 3: Try to insert a test strategy
  console.log('\n3. Testing insert permission...');
  try {
    const testStrategy = {
      id: 999,
      name: 'Test Strategy',
      market: 'Test',
      timeframe: 'Test',
      win_rate: 50,
      profit_factor: 1.0,
      max_drawdown: 10,
      avg_return: 5,
      description: 'Test',
      rules: ['test'],
      pros: ['test'],
      cons: ['test'],
      equity: [{ month: 'Jan', value: 10000 }],
      monthly_returns: [{ month: 'Jan', return: 5 }],
      trades: [{ type: 'Win', count: 50 }]
    };
    
    const { data, error } = await supabase
      .from('strategies')
      .insert([testStrategy])
      .select();
    
    if (error) {
      console.log('   ❌ Insert failed:', error.message);
      console.log('   Details:', error.details);
      console.log('   Hint:', error.hint);
    } else {
      console.log('   ✅ Insert successful!');
      // Clean up test data
      await supabase.from('strategies').delete().eq('id', 999);
      console.log('   ✅ Test data cleaned up');
    }
  } catch (err) {
    console.log('   ❌ Error:', err.message);
  }
  
  console.log('\n✨ Test complete!\n');
}

testConnection();
