require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Verify Stripe key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY is not set in your environment variables');
  process.exit(1);
}

async function setupStripeProducts() {
  try {
    // Basic Plan
    const basicProduct = await stripe.products.create({
      name: 'Basic Monthly',
      description: 'Essential features for your fitness journey',
      metadata: { 
        planId: 'basic',
        features: JSON.stringify([
          'Basic workout tracking',
          'Progress monitoring',
          'Standard support'
        ])
      }
    });
    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 999, // $9.99
      currency: 'usd',
      recurring: { interval: 'month' }
    });

    // Premium Plan  
    const premiumProduct = await stripe.products.create({
      name: 'Premium Monthly',
      metadata: { planId: 'premium' }
    });
    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 1999, // $19.99
      currency: 'usd',
      recurring: { interval: 'month' }
    });

    // Elite Plan
    const eliteProduct = await stripe.products.create({
      name: 'Elite Monthly', 
      metadata: { planId: 'elite' }
    });
    const elitePrice = await stripe.prices.create({
      product: eliteProduct.id,
      unit_amount: 3999, // $39.99
      currency: 'usd',
      recurring: { interval: 'month' }
    });

    console.log('Stripe products created!');
    console.log('Basic Price ID:', basicPrice.id);
    console.log('Premium Price ID:', premiumPrice.id);
    console.log('Elite Price ID:', elitePrice.id);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupStripeProducts();