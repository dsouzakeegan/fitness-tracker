import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Tabs, Card, Spin, Alert, Button, message } from 'antd';
import { CreditCardOutlined, HistoryOutlined, CrownOutlined, SettingOutlined } from '@ant-design/icons';
import {
  fetchBillingPlans,
  fetchSubscriptionStatus,
  fetchPaymentHistory,
  createPaymentIntent,
  createSubscription,
  updateSubscription,
  selectBillingPlans,
  selectCurrentSubscription,
  selectPaymentHistory,
  selectBillingLoading,
  selectSubscriptionLoading,
  selectPaymentLoading,
  selectHistoryLoading,
  selectBillingError,
  selectSelectedPlan,
  selectPaymentIntent,
  clearError,
  setSelectedPlan,
  clearSelectedPlan,
  clearPaymentIntent
} from '../../store/slices/billingSlice';
import SubscriptionPlans from './SubscriptionPlans';
import PaymentForm from './PaymentForm';
import CurrentSubscription from './CurrentSubscription';
import PaymentHistory from './PaymentHistory';
import './billing.module.css';

const { Content } = Layout;

const BillingAndPlans = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('plans');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Redux selectors
  const plans = useSelector(selectBillingPlans);
  const currentSubscription = useSelector(selectCurrentSubscription);
  const paymentHistory = useSelector(selectPaymentHistory);
  const loading = useSelector(selectBillingLoading);
  const subscriptionLoading = useSelector(selectSubscriptionLoading);
  const paymentLoading = useSelector(selectPaymentLoading);
  const historyLoading = useSelector(selectHistoryLoading);
  const error = useSelector(selectBillingError);
  const selectedPlan = useSelector(selectSelectedPlan);
  const paymentIntent = useSelector(selectPaymentIntent);

  // Check if any loading state is active
  const isLoading = loading || subscriptionLoading || paymentLoading;

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchBillingPlans());
    dispatch(fetchSubscriptionStatus());
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  const handlePlanSelect = async (plan) => {
    dispatch(setSelectedPlan(plan));
    
    // Create payment intent for the selected plan
    const amount = Math.round(plan.price * 100); // Convert to cents
    try {
      const result = await dispatch(createPaymentIntent({
        amount,
        currency: 'usd',
        paymentType: 'subscription',
        planId: plan.id
      })).unwrap();

      // Only show payment form if payment intent is successfully created
      if (result.clientSecret) {
        setShowPaymentForm(true);
      }
    } catch (error) {
      // Handle payment intent creation error
      dispatch(clearSelectedPlan());
      // Show error notification
      message.error(error || 'Failed to create payment intent');
    }
  };

  const handlePaymentSuccess = async (paymentMethodId) => {
    if (selectedPlan) {
      try {
        // Create subscription with the payment method
        const result = await dispatch(createSubscription({
          priceId: selectedPlan.priceId,
          paymentMethodId
        })).unwrap();

        // Success - refresh data and close form
        await dispatch(fetchSubscriptionStatus());
        await dispatch(fetchPaymentHistory());
        
        // Show success message
        message.success('Subscription created successfully');
        
        handlePaymentCancel();
        setActiveTab('subscription');
      } catch (error) {
        // Show error notification
        message.error(error || 'Failed to create subscription');
      }
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    dispatch(clearSelectedPlan());
    dispatch(clearPaymentIntent());
  };

  const handleSubscriptionUpdate = async (subscriptionId, action) => {
    try {
      const result = await dispatch(updateSubscription({ 
        subscriptionId, 
        action 
      })).unwrap();

      // Refresh subscription data
      await dispatch(fetchSubscriptionStatus());

      // Show success message
      message.success(
        action === 'cancel' 
          ? 'Subscription will end at the current period' 
          : 'Subscription reactivated successfully'
      );
    } catch (error) {
      // Show error notification
      message.error(
        error || `Failed to ${action} subscription`
      );
    }
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchBillingPlans());
    dispatch(fetchSubscriptionStatus());
    dispatch(fetchPaymentHistory());
  };

  if (error) {
    return (
      <Content 
        style={{
          padding: window.innerWidth < 768 ? 16 : 24,
          background: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        <Alert
          message="Error Loading Billing Information"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        />
      </Content>
    );
  }

  const tabItems = [
    {
      key: 'plans',
      label: (
        <span>
          <CrownOutlined />
          Plans & Pricing
        </span>
      ),
      children: (
        <SubscriptionPlans
          plans={plans}
          currentSubscription={currentSubscription}
          onPlanSelect={handlePlanSelect}
          loading={loading}
        />
      ),
    },
    {
      key: 'subscription',
      label: (
        <span>
          <SettingOutlined />
          Current Plan
        </span>
      ),
      children: (
        <CurrentSubscription
          subscription={currentSubscription}
          onSubscriptionUpdate={handleSubscriptionUpdate}
          loading={subscriptionLoading}
        />
      ),
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined />
          Payment History
        </span>
      ),
      children: (
        <PaymentHistory 
          payments={paymentHistory}
          loading={historyLoading}
        />
      ),
    },
  ];

  return (
    <Content
      style={{
        padding: window.innerWidth < 768 ? 16 : 24,
        background: '#f5f5f5',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            borderRadius: '12px'
          }}
        >
          <Spin size="large" />
        </div>
      )}

      <Card
        style={{
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: 'none',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            padding: '24px',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <CreditCardOutlined
              style={{
                fontSize: '32px',
                color: 'white',
                background: 'rgba(255,255,255,0.2)',
                padding: '12px',
                borderRadius: '12px',
              }}
            />
            <div>
              <h1 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                Billing & Plans
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '16px' }}>
                Manage your subscription and view payment history
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
            style={{
              '.ant-tabs-tab': {
                fontSize: '16px',
                fontWeight: '500',
              },
            }}
          />
        </div>
      </Card>

      {/* Payment Form Modal/Overlay */}
      {showPaymentForm && selectedPlan && paymentIntent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <PaymentForm
              selectedPlan={selectedPlan}
              clientSecret={paymentIntent.clientSecret}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
              loading={paymentLoading}
            />
          </div>
        </div>
      )}
    </Content>
  );
};

export default BillingAndPlans;