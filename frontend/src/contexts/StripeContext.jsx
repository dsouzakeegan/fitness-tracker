import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

if ( import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === undefined ) {
    throw new Error('VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const StripeWrapper = ({ children }) => (
  <Elements stripe={stripePromise}>
    {children}
  </Elements>
);
