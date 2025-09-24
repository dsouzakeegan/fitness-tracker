import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button, Form, Input, Alert, Divider, Space, Card } from 'antd';
import { CreditCardOutlined, LockOutlined, CloseOutlined } from '@ant-design/icons';

const PaymentForm = ({ selectedPlan, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      postal_code: '',
      country: 'US',
    },
  });

  useEffect(() => {
    createPaymentIntent();
  }, [selectedPlan]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: Math.round(selectedPlan.price * 100), // Convert to cents
          currency: 'usd',
          paymentType: 'subscription',
          planId: selectedPlan.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm payment
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails,
          },
        }
      );

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Create subscription
        const subscriptionResponse = await fetch('/api/subscriptions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            priceId: selectedPlan.priceId,
            paymentMethodId: paymentIntent.payment_method,
          }),
        });

        if (!subscriptionResponse.ok) {
          throw new Error('Failed to create subscription');
        }

        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Complete Your Purchase
        </h2>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onCancel}
          style={{ padding: '8px' }}
        />
      </div>

      {/* Plan Summary */}
      <Card
        size="small"
        style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          border: 'none',
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              {selectedPlan.name} Plan
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '14px' }}>
              Monthly subscription
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              ${selectedPlan.price}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
              per month
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Alert
          message="Payment Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit}>
        {/* Billing Details */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
            Billing Information
          </h4>
          
          <Form.Item label="Full Name" required>
            <Input
              size="large"
              placeholder="Enter your full name"
              value={billingDetails.name}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item label="Email Address" required>
            <Input
              size="large"
              type="email"
              placeholder="Enter your email address"
              value={billingDetails.email}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, email: e.target.value }))}
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item label="Address" required>
            <Input
              size="large"
              placeholder="Street address"
              value={billingDetails.address.line1}
              onChange={(e) => setBillingDetails(prev => ({
                ...prev,
                address: { ...prev.address, line1: e.target.value }
              }))}
              style={{ borderRadius: '8px', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <Input
                size="large"
                placeholder="City"
                value={billingDetails.address.city}
                onChange={(e) => setBillingDetails(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                style={{ borderRadius: '8px' }}
              />
              <Input
                size="large"
                placeholder="ZIP Code"
                value={billingDetails.address.postal_code}
                onChange={(e) => setBillingDetails(prev => ({
                  ...prev,
                  address: { ...prev.address, postal_code: e.target.value }
                }))}
                style={{ borderRadius: '8px' }}
              />
            </div>
          </Form.Item>
        </div>

        <Divider />

        {/* Card Details */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>
            <CreditCardOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
            Payment Method
          </h4>
          
          <div
            style={{
              padding: '16px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              background: '#fafafa',
            }}
          >
            <CardElement options={cardElementOptions} />
          </div>
          
          <p style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <LockOutlined style={{ color: '#52c41a' }} />
            Your payment information is encrypted and secure
          </p>
        </div>

        {/* Terms */}
        <div style={{ 
          padding: '16px', 
          background: '#f9f9f9', 
          borderRadius: '8px', 
          marginBottom: '24px',
          fontSize: '13px',
          color: '#666',
          lineHeight: '1.5'
        }}>
          By completing your purchase, you agree to our Terms of Service and Privacy Policy. 
          Your subscription will automatically renew monthly at ${selectedPlan.price} unless canceled. 
          You can cancel anytime from your account settings.
        </div>

        {/* Action Buttons */}
        <Space size={12} style={{ width: '100%' }}>
          <Button
            onClick={onCancel}
            size="large"
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '8px',
              fontWeight: '500',
            }}
          >
            Cancel
          </Button>
          
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!stripe || !clientSecret}
            size="large"
            style={{
              flex: 2,
              height: '48px',
              borderRadius: '8px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
            }}
          >
            {loading ? 'Processing...' : `Pay ${selectedPlan.price}/month`}
          </Button>
        </Space>

        {/* Security Notice */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '16px',
          fontSize: '12px',
          color: '#999'
        }}>
          <LockOutlined style={{ marginRight: '4px' }} />
          256-bit SSL encryption • PCI DSS compliant
        </div>
      </Form>
    </div>
  );
};

export default PaymentForm;