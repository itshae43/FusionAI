// test-research.ts - Test the research API
import { config } from 'dotenv';

// Load .env file
config();

async function testResearch() {
  try {
    console.log('\n🧪 Testing Research API...\n');
    
    const query = 'German AI market size 2024';
    console.log(`📤 Sending query: "${query}"`);
    
    const response = await fetch('http://localhost:3000/api/research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        numResults: 5,
        type: 'auto'
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`\n✅ Success! Found ${data.resultsCount} results:\n`);
      
      data.results.forEach((result: any, index: number) => {
        console.log(`${index + 1}. ${result.title}`);
        console.log(`   URL: ${result.url}`);
        console.log(`   Snippet: ${result.snippet.substring(0, 100)}...`);
        if (result.publishedDate) {
          console.log(`   Published: ${result.publishedDate}`);
        }
        console.log('');
      });
      
      console.log('✅ Feature 2 test completed successfully!\n');
    } else {
      console.error('\n❌ API returned error:', data.error);
      console.log('\n💡 Make sure:');
      console.log('   1. Your dev server is running (npm run dev)');
      console.log('   2. Your .env file has valid EXA_API_KEY');
      console.log('   3. Your E2B_API_KEY is valid\n');
    }
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Hint: Is your dev server running on port 3000?\n');
    process.exit(1);
  }
}

testResearch();
