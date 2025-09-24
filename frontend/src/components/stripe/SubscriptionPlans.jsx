import { Card, Button, Badge, Row, Col, Divider, Space } from 'antd';
import { CheckOutlined, CrownOutlined, FireOutlined, ThunderboltOutlined } from '@ant-design/icons';

const SubscriptionPlans = ({ currentSubscription, onPlanSelect }) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      priceId: 'price_basic_monthly',
      price: 9.99,
      period: 'month',
      icon: <CheckOutlined />,
      color: '#52c41a',
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
      name: 'Premium',
      priceId: 'price_premium_monthly',
      price: 19.99,
      period: 'month',
      icon: <CrownOutlined />,
      color: '#ff6b35',
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
      name: 'Elite',
      priceId: 'price_elite_monthly',
      price: 39.99,
      period: 'month',
      icon: <FireOutlined />,
      color: '#722ed1',
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

  const isCurrentPlan = (planId) => {
    return currentSubscription?.planId === planId;
  };

  const getPlanButton = (plan) => {
    if (isCurrentPlan(plan.id)) {
      return (
        <Button
          size="large"
          disabled
          style={{
            width: '100%',
            height: '48px',
            fontSize: '16px',
            fontWeight: 'bold',
            background: '#f0f0f0',
            border: 'none',
          }}
        >
          Current Plan
        </Button>
      );
    }

    return (
      <Button
        type="primary"
        size="large"
        onClick={() => onPlanSelect(plan)}
        style={{
          width: '100%',
          height: '48px',
          fontSize: '16px',
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}CC 100%)`,
          border: 'none',
          boxShadow: `0 4px 12px ${plan.color}40`,
        }}
      >
        {currentSubscription ? 'Switch to This Plan' : 'Get Started'}
      </Button>
    );
  };

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#262626' }}>
          Choose Your Perfect Plan
        </h2>
        <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
          Unlock your fitness potential with our premium features
        </p>
      </div>

      {/* Plans Grid */}
      <Row gutter={[24, 24]} justify="center">
        {plans.map((plan) => (
          <Col xs={24} sm={24} md={8} key={plan.id}>
            <Card
              style={{
                height: '100%',
                borderRadius: '16px',
                border: plan.popular ? `2px solid ${plan.color}` : '1px solid #f0f0f0',
                boxShadow: plan.popular 
                  ? `0 8px 24px ${plan.color}30` 
                  : '0 4px 12px rgba(0,0,0,0.08)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              bodyStyle={{ padding: '32px 24px' }}
              hoverable
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}CC 100%)`,
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `${plan.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '24px',
                    color: plan.color,
                  }}
                >
                  {plan.icon}
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#262626' }}>
                  {plan.name}
                </h3>
                <div style={{ marginTop: '12px' }}>
                  <span
                    style={{
                      fontSize: '36px',
                      fontWeight: 'bold',
                      color: plan.color,
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span style={{ fontSize: '16px', color: '#666' }}>
                    /{plan.period}
                  </span>
                </div>
              </div>

              <Divider style={{ margin: '24px 0' }} />

              {/* Features List */}
              <div style={{ marginBottom: '32px' }}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  {plan.features.map((feature, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <CheckOutlined
                        style={{
                          color: plan.color,
                          fontSize: '16px',
                          marginTop: '2px',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </Space>
              </div>

              {/* Action Button */}
              {getPlanButton(plan)}

              {/* Current Plan Indicator */}
              {isCurrentPlan(plan.id) && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${plan.color} 0%, ${plan.color}CC 100%)`,
                  }}
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* FAQ Section */}
      <div style={{ marginTop: '60px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#262626' }}>
          Questions about our plans?
        </h3>
        <Space size={24} wrap>
          <div style={{ color: '#666' }}>
            <ThunderboltOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
            Cancel anytime
          </div>
          <div style={{ color: '#666' }}>
            <ThunderboltOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
            30-day money back guarantee
          </div>
          <div style={{ color: '#666' }}>
            <ThunderboltOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
            24/7 support
          </div>
        </Space>
      </div>
    </div>
  );
};

export default SubscriptionPlans;