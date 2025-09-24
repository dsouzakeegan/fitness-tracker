import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../auth/AxiosInstance';

// Static plans data (since you don't have a plans endpoint)
const STATIC_PLANS = [
  {
    id: 'basic',
    name: 'Basic Monthly',
    priceId: 'price_1OxxxxxxxxxxxxxK', // Replace with actual Stripe Basic price ID
    price: 9.99,
    period: 'month',
    features: [
      'Track unlimited workouts',
      'Basic progress analytics',
      'Mobile app access',
      'Email support',
      '5 custom workout plans'
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium Monthly',
    priceId: 'price_1OyyyyyyyyyyyyyK', // Replace with actual Stripe Premium price ID
    price: 19.99,
    period: 'month',
    features: [
      'Everything in Basic',
      'Advanced analytics & insights',
      'Personalized workout recommendations',
      'Nutrition tracking',
      'Priority support',
      'Unlimited custom plans',
      'Progress photos & measurements',
      'Export data & reports'
    ],
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite Monthly',
    priceId: 'price_1OzzzzzzzzzzzzzK', // Replace with actual Stripe Elite price ID
    price: 39.99,
    period: 'month',
    features: [
      'Everything in Premium',
      'Personal trainer consultation',
      '1-on-1 video coaching sessions',
      'Custom meal planning',
      'Live workout classes',
      'Priority gym booking',
      'Supplement recommendations',
      'Health integration (Apple Health, etc.)'
    ],
    popular: false,
  }
];

// Async thunks - Updated to match your backend API endpoints
export const fetchBillingPlans = createAsyncThunk(
  'billing/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      // Since you don't have a plans endpoint, return static data
      return STATIC_PLANS;
    } catch (error) {
      return rejectWithValue('Failed to fetch billing plans');
    }
  }
);

export const fetchSubscriptionStatus = createAsyncThunk(
  'billing/fetchSubscriptionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('subscriptions/current');
      return response.data.subscription;
    } catch (error) {
      // Return null for 404 (no subscription found) instead of treating as error
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(
        error.response?.data?.error || 
        'Failed to fetch subscription status'
      );
    }
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  'billing/fetchPaymentHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('payments/history');
      return response.data.payments || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 
        'Failed to fetch payment history'
      );
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  'billing/createPaymentIntent',
  async ({ amount, currency = 'usd', paymentType = 'subscription', planId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('payments/create-intent', {
        amount,
        currency,
        paymentType,
        planId
      });
      return {
        clientSecret: response.clientSecret,
        paymentIntentId: response.paymentIntentId
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create payment intent');
    }
  }
);

export const createSubscription = createAsyncThunk(
  'billing/createSubscription',
  async ({ priceId, paymentMethodId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('subscriptions/create', {
        priceId,
        paymentMethodId
      });
      return {
        subscriptionId: response.subscriptionId,
        clientSecret: response.clientSecret,
        status: response.status
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create subscription');
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'billing/updateSubscription',
  async ({ subscriptionId, action }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`subscriptions/${subscriptionId}`, {
        action
      });
      return response.data.subscription;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update subscription');
    }
  }
);

// Initial state
const initialState = {
  plans: STATIC_PLANS,
  currentSubscription: null,
  paymentHistory: [],
  loading: false,
  error: null,
  selectedPlan: null,
  paymentIntent: null,
  subscriptionLoading: false,
  paymentLoading: false,
  historyLoading: false
};

// Slice
const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Plans (static data)
      .addCase(fetchBillingPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchBillingPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Subscription Status
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.subscriptionLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.error = action.payload;
      })

      // Fetch Payment History
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.historyLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.paymentHistory = action.payload;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.error = action.payload;
      })

      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload;
      })

      // Create Subscription
      .addCase(createSubscription.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.paymentLoading = false;
        // Will refresh subscription status separately
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload;
      })

      // Update Subscription
      .addCase(updateSubscription.pending, (state) => {
        state.subscriptionLoading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
        // Update current subscription with new data
        if (state.currentSubscription) {
          state.currentSubscription = { ...state.currentSubscription, ...action.payload };
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectBillingPlans = (state) => state.billing.plans;
export const selectCurrentSubscription = (state) => state.billing.currentSubscription;
export const selectPaymentHistory = (state) => state.billing.paymentHistory;
export const selectBillingLoading = (state) => state.billing.loading;
export const selectSubscriptionLoading = (state) => state.billing.subscriptionLoading;
export const selectPaymentLoading = (state) => state.billing.paymentLoading;
export const selectHistoryLoading = (state) => state.billing.historyLoading;
export const selectBillingError = (state) => state.billing.error;
export const selectSelectedPlan = (state) => state.billing.selectedPlan;
export const selectPaymentIntent = (state) => state.billing.paymentIntent;

// Actions
export const { clearError, setSelectedPlan, clearSelectedPlan, clearPaymentIntent } = billingSlice.actions;

export default billingSlice.reducer;