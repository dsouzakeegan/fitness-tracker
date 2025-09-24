import { useState, useEffect } from 'react';
import { Table, Card, Badge, Button, Space, Input, DatePicker, Select, Empty, Spin, Tag } from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  FilterOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchText, statusFilter, dateRange]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(payment => 
        payment.description.toLowerCase().includes(searchText.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Date range filter
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.created);
        return paymentDate >= startDate.toDate() && paymentDate <= endDate.toDate();
      });
    }

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      succeeded: { status: 'success', text: 'Succeeded' },
      pending: { status: 'processing', text: 'Pending' },
      failed: { status: 'error', text: 'Failed' },
      canceled: { status: 'default', text: 'Canceled' },
      refunded: { status: 'warning', text: 'Refunded' },
    };

    const config = statusConfig[status] || { status: 'default', text: status };
    return <Badge status={config.status} text={config.text} />;
  };

  const getPaymentMethodIcon = (type) => {
    switch (type) {
      case 'card':
        return <CreditCardOutlined style={{ color: '#1890ff' }} />;
      default:
        return <CreditCardOutlined style={{ color: '#666' }} />;
    }
  };

  const formatAmount = (amount, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadInvoice = (paymentId) => {
    // This would typically make an API call to generate/download the invoice
    window.open(`/api/payments/${paymentId}/invoice`, '_blank');
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'created',
      key: 'created',
      render: (date) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined style={{ color: '#666' }} />
          <span>{formatDate(date)}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.created) - new Date(b.created),
      width: 180,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description, record) => (
        <div>
          <div style={{ fontWeight: '500', color: '#262626', marginBottom: '4px' }}>
            {description}
          </div>
          <div style={{ fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>
            ID: {record.id}
          </div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#262626' }}>
            {formatAmount(amount, record.currency)}
          </div>
          {record.fee && (
            <div style={{ fontSize: '12px', color: '#999' }}>
              Fee: {formatAmount(record.fee, record.currency)}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => a.amount - b.amount,
      width: 120,
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getPaymentMethodIcon(method?.type)}
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>
              {method?.brand?.toUpperCase() || 'Card'}
            </div>
            {method?.last4 && (
              <div style={{ fontSize: '12px', color: '#999' }}>
                •••• {method.last4}
              </div>
            )}
          </div>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusBadge(status),
      filters: [
        { text: 'Succeeded', value: 'succeeded' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' },
        { text: 'Refunded', value: 'refunded' },
      ],
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'succeeded' && (
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => downloadInvoice(record.id)}
              style={{ borderRadius: '6px' }}
            >
              Invoice
            </Button>
          )}
        </Space>
      ),
      width: 100,
    },
  ];

  const getSummaryStats = () => {
    const stats = filteredPayments.reduce(
      (acc, payment) => {
        if (payment.status === 'succeeded') {
          acc.totalAmount += payment.amount;
          acc.successfulPayments += 1;
        }
        acc.totalPayments += 1;
        return acc;
      },
      { totalAmount: 0, successfulPayments: 0, totalPayments: 0 }
    );

    return stats;
  };

  const stats = getSummaryStats();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <Card size="small" style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              background: '#ff6b35', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <DollarOutlined style={{ color: 'white', fontSize: '20px' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Total Spent</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#262626' }}>
                {formatAmount(stats.totalAmount)}
              </div>
            </div>
          </div>
        </Card>

        <Card size="small" style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              background: '#52c41a', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <CreditCardOutlined style={{ color: 'white', fontSize: '20px' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Successful</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#262626' }}>
                {stats.successfulPayments}
              </div>
            </div>
          </div>
        </Card>

        <Card size="small" style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '8px', 
              background: '#722ed1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <CalendarOutlined style={{ color: 'white', fontSize: '20px' }} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Total Transactions</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#262626' }}>
                {stats.totalPayments}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card 
        style={{ marginBottom: '24px', borderRadius: '12px', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FilterOutlined style={{ color: '#666' }} />
            <span style={{ fontWeight: '500', color: '#262626' }}>Filters:</span>
          </div>

          <Input
            placeholder="Search transactions..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250, borderRadius: '6px' }}
            allowClear
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            placeholder="All Status"
          >
            <Option value="all">All Status</Option>
            <Option value="succeeded">Succeeded</Option>
            <Option value="pending">Pending</Option>
            <Option value="failed">Failed</Option>
            <Option value="refunded">Refunded</Option>
          </Select>

          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ borderRadius: '6px' }}
            placeholder={['Start Date', 'End Date']}
          />

          {(searchText || statusFilter !== 'all' || dateRange) && (
            <Button
              onClick={() => {
                setSearchText('');
                setStatusFilter('all');
                setDateRange(null);
              }}
              style={{ borderRadius: '6px' }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Payment History Table */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Payment History</span>
            <Tag color="#ff6b35" style={{ borderRadius: '6px', padding: '4px 8px' }}>
              {filteredPayments.length} transactions
            </Tag>
          </div>
        }
        style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: 0 }}
      >
        {filteredPayments.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Empty
              description={
                <div>
                  <p style={{ fontSize: '16px', color: '#666', margin: '16px 0 8px 0' }}>
                    {payments.length === 0 ? 'No payment history yet' : 'No transactions match your filters'}
                  </p>
                  {payments.length === 0 && (
                    <p style={{ fontSize: '14px', color: '#999' }}>
                      Your payment history will appear here after you make your first purchase.
                    </p>
                  )}
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredPayments}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} transactions`,
              style: { padding: '16px 24px' },
            }}
            scroll={{ x: 800 }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? '' : 'ant-table-row-alternate'
            }
            style={{
              '.ant-table-row-alternate': {
                backgroundColor: '#fafafa',
              },
            }}
          />
        )}
      </Card>

      {/* Export Section */}
      {filteredPayments.length > 0 && (
        <Card
          style={{
            marginTop: '24px',
            borderRadius: '12px',
            border: '1px solid #f0f0f0',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          }}
          bodyStyle={{ padding: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#262626' }}>
                Export Payment Data
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                Download your payment history for accounting or tax purposes
              </p>
            </div>
            <Space>
              <Button
                icon={<DownloadOutlined />}
                style={{ borderRadius: '6px', fontWeight: '500' }}
                onClick={() => {
                  // Implement CSV export
                  const csvContent = "data:text/csv;charset=utf-8," + 
                    "Date,Description,Amount,Status,Payment Method\n" +
                    filteredPayments.map(payment => 
                      `${formatDate(payment.created)},"${payment.description}",${formatAmount(payment.amount)},${payment.status},${payment.paymentMethod?.brand || 'Card'}`
                    ).join('\n');
                  
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "payment_history.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Export as CSV
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  border: 'none',
                }}
                onClick={() => {
                  // Implement PDF export
                  window.open('/api/payments/export/pdf', '_blank');
                }}
              >
                Export as PDF
              </Button>
            </Space>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PaymentHistory;