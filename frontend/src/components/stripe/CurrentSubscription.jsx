import { useState } from 'react';
import { Card, Button, Badge, Space, Divider, Alert, Modal, Progress } from 'antd';
import { 
  CrownOutlined, 
  CalendarOutlined, 
  CreditCardOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

const CurrentSubscription = ({ subscription, onSubscriptionUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  if (!subscription) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '32px',
            color: '#999',
          }}
        >
          <CrownOutlined />
        </div>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#262626', marginBottom: '8px' }}>
          No Active Subscription
        </h3>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '32px' }}>
          You don't have an active subscription yet. Choose a plan to get started with premium features.
        </p>
        <Button
          type="primary"
          size="large"
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            height: '48px',
            padding: '0 32px',
          }}
          onClick={() => window.location.reload()}
        >
          View Plans
        </Button>
      </div>
    );
  }

  const handleCancelSubscription = () => {
    confirm({
      title: 'Cancel Subscription',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to cancel your subscription?</p>
          <ul style={{ marginTop: '16px', paddingLeft: '16px' }}>
            <li>Your subscription will remain active until {formatDate(subscription.currentPeriodEnd)}</li>
            <li>You'll lose access to premium features after this date</li>
            <li>You can reactivate anytime before the end date</li>
          </ul>
        </div>
      ),
      okText: 'Cancel Subscription',
      okType: 'danger',
      cancelText: 'Keep Subscription',
      onOk: async () => {
        setCancelLoading(true);
        try {
          const response = await fetch(`/api/subscriptions/${subscription.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ action: 'cancel' }),
          });

          if (!response.ok) {
            throw new Error('Failed to cancel subscription');
          }

          onSubscriptionUpdate();
        } catch (error) {
          console.error('Cancel subscription error:', error);
        } finally {
          setCancelLoading(false);
        }
      },
    });
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action: 'reactivate' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      onSubscriptionUpdate();
    } catch (error) {
      console.error('Reactivate subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status, cancelAtPeriodEnd) => {
    if (cancelAtPeriodEnd) {
      return <Badge status="warning" text="Canceling" />;
    }
    
    switch (status) {
      case 'active':
        return <Badge status="success" text="Active" />;
      case 'canceled':
        return <Badge status="default" text="Canceled" />;
      case 'past_due':
        return <Badge status="error" text="Past Due" />;
      default:
        return <Badge status="processing" text={status} />;
    }
  };

  const getDaysRemaining = () => {
    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getProgressPercentage = () => {
    const startDate = new Date(subscription.currentPeriodStart || Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const daysRemaining = getDaysRemaining();
  const progressPercentage = getProgressPercentage();

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Subscription Status Alert */}
      {subscription.cancelAtPeriodEnd && (
        <Alert
          message="Subscription Ending Soon"
          description={`Your subscription will end on ${formatDate(subscription.currentPeriodEnd)}. Reactivate now to continue enjoying premium features.`}
          type="warning"
          showIcon
          style={{ marginBottom: '24px', borderRadius: '8px' }}
          action={
            <Button
              size="small"
              type="primary"
              onClick={handleReactivateSubscription}
              loading={loading}
              style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                border: 'none',
              }}
            >
              Reactivate
            </Button>
          }
        />
      )}

      {/* Main Subscription Card */}
      <Card
        style={{
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          marginBottom: '24px',
        }}
        bodyStyle={{ padding: '32px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
              }}
            >
              <CrownOutlined />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#262626' }}>
                {subscription.planName}
              </h2>
              <div style={{ marginTop: '8px' }}>
                {getStatusBadge(subscription.status, subscription.cancelAtPeriodEnd)}
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff6b35' }}>
              ${(subscription.amount / 100).toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>per month</div>
          </div>
        </div>

        <Divider />

        {/* Billing Cycle Progress */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#262626' }}>
              Current Billing Cycle
            </h4>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>
              {daysRemaining} days remaining
            </span>
          </div>
          
          <Progress
            percent={progressPercentage}
            strokeColor={{
              '0%': '#ff6b35',
              '100%': '#f7931e',
            }}
            trailColor="#f0f0f0"
            strokeWidth={8}
            showInfo={false}
            style={{ marginBottom: '8px' }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999' }}>
            <span>Started: {formatDate(subscription.currentPeriodStart || Date.now())}</span>
            <span>Renews: {formatDate(subscription.currentPeriodEnd)}</span>
          </div>
        </div>

        {/* Subscription Details */}
        <div style={{ marginBottom: '32px' }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CalendarOutlined style={{ color: '#ff6b35', fontSize: '16px' }} />
              <div>
                <div style={{ fontWeight: '500', color: '#262626' }}>Next Billing Date</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {formatDate(subscription.currentPeriodEnd)}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CreditCardOutlined style={{ color: '#ff6b35', fontSize: '16px' }} />
              <div>
                <div style={{ fontWeight: '500', color: '#262626' }}>Payment Method</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  •••• •••• •••• {subscription.lastFour || '4242'}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
              <div>
                <div style={{ fontWeight: '500', color: '#262626' }}>Subscription ID</div>
                <div style={{ fontSize: '14px', color: '#666', fontFamily: 'monospace' }}>
                  {subscription.id}
                </div>
              </div>
            </div>
          </Space>
        </div>

        <Divider />

        {/* Actions */}
        <Space size={12} wrap>
          {!subscription.cancelAtPeriodEnd ? (
            <Button
              danger
              loading={cancelLoading}
              onClick={handleCancelSubscription}
              style={{
                borderRadius: '8px',
                fontWeight: '500',
                height: '40px',
              }}
            >
              Cancel Subscription
            </Button>
          ) : (
            <Button
              type="primary"
              loading={loading}
              onClick={handleReactivateSubscription}
              style={{
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                height: '40px',
              }}
            >
              Reactivate Subscription
            </Button>
          )}
          
          <Button
            style={{
              borderRadius: '8px',
              fontWeight: '500',
              height: '40px',
            }}
          >
            Update Payment Method
          </Button>
          
          <Button
            style={{
              borderRadius: '8px',
              fontWeight: '500',
              height: '40px',
            }}
          >
            Download Invoice
          </Button>
        </Space>
      </Card>

      {/* Features Included */}
      <Card
        title="What's Included in Your Plan"
        style={{
          borderRadius: '16px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            'Unlimited workout tracking',
            'Advanced analytics & insights',
            'Personalized recommendations',
            'Progress photo storage',
            'Priority customer support',
            'Export & backup data'
          ].map((feature, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: '#666' }}>{feature}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CurrentSubscription;