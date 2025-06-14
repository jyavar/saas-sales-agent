#!/usr/bin/env node

/**
 * Test script for Stripe checkout endpoint
 * Usage: node test-stripe-checkout.js [iterations] [token]
 */

import { testRateLimit, createMockToken, testData, validateApiResponse } from './src/utils/testing.js';
import logger from './src/utils/logger.js';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const CHECKOUT_ENDPOINT = `${BASE_URL}/api/billing/checkout`;

async function main() {
  const iterations = parseInt(process.argv[2]) || 10;
  const token = process.argv[3] || createMockToken();

  logger.info('Starting Stripe checkout test', {
    endpoint: CHECKOUT_ENDPOINT,
    iterations,
    hasToken: !!token
  });

  // Test data for checkout
  const checkoutData = {
    planId: 'pro',
    billingCycle: 'monthly',
    // URLs are optional - the endpoint will use defaults for testing
    successUrl: 'https://test.com/success',
    cancelUrl: 'https://test.com/cancel'
  };

  try {
    // Run rate limit test
    const results = await testRateLimit(
      CHECKOUT_ENDPOINT,
      iterations,
      checkoutData,
      token
    );

    // Analyze specific responses
    console.log('\n📊 Detailed Results:');
    console.log('===================');
    
    results.responses.forEach((response, index) => {
      const status = response.status === 200 ? '✅' : 
                    response.status === 429 ? '⏰' : 
                    response.status === 401 ? '🔒' : '❌';
      
      console.log(`${status} Request ${response.attempt}: ${response.status} ${response.success ? 'SUCCESS' : 'FAILED'}`);
      
      if (response.error) {
        console.log(`   Error: ${response.error}`);
      }
    });

    // Summary
    console.log('\n📈 Summary:');
    console.log('===========');
    console.log(`Total Requests: ${results.summary.totalRequests}`);
    console.log(`Successful: ${results.summary.successful} (${results.summary.successRate.toFixed(1)}%)`);
    console.log(`Rate Limited: ${results.summary.rateLimited}`);
    console.log(`Errors: ${results.summary.errors}`);

    // Recommendations
    console.log('\n💡 Recommendations:');
    console.log('===================');
    
    if (results.summary.rateLimited > 0) {
      console.log('✅ Rate limiting is working correctly');
      console.log('   - Prevents abuse of checkout endpoint');
      console.log('   - Protects against accidental multiple subscriptions');
    }
    
    if (results.summary.successful > 5) {
      console.log('⚠️  Consider lowering rate limit for checkout endpoint');
      console.log('   - Current limit allows too many checkout sessions');
      console.log('   - Recommended: 3-5 checkouts per hour per user');
    }

    if (results.summary.errors > 0) {
      console.log('❌ Some requests failed with errors');
      console.log('   - Check authentication token validity');
      console.log('   - Verify Stripe configuration');
      console.log('   - Check database connectivity');
    }

  } catch (error) {
    logger.error('Test script failed', error);
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}