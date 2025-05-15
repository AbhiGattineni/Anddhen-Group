import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Table,
  Badge,
  Spinner,
  Alert,
} from 'react-bootstrap';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
];

const FinanceAnalytics = ({ transactions }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categorySummary, setCategorySummary] = useState({});

  useEffect(() => {
    if (!transactions || !Array.isArray(transactions)) {
      console.log('No valid transactions data:', transactions);
      setLoading(false);
      return;
    }

    try {
      console.log('Processing transactions:', transactions);
      // Process transactions for category pie chart
      const categoryTotals = transactions.reduce((acc, txn) => {
        console.log('Processing transaction:', txn);
        const category = txn.category || 'OTHER';
        const amount = parseFloat(txn.amount) || 0;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});

      console.log('Category totals:', categoryTotals);
      const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }));
      console.log('Pie chart data:', pieData);

      // Process transactions for monthly bar chart
      const monthlyTotals = transactions.reduce((acc, txn) => {
        // Ensure date is in YYYY-MM format
        const date = new Date(txn.date);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', txn.date);
          return acc;
        }
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const amount = parseFloat(txn.amount) || 0;
        acc[month] = (acc[month] || 0) + amount;
        return acc;
      }, {});

      console.log('Monthly totals:', monthlyTotals);
      const barData = Object.entries(monthlyTotals)
        .map(([month, total]) => ({
          month,
          total: parseFloat(total.toFixed(2)),
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
      console.log('Bar chart data:', barData);

      // Calculate category summary
      const summary = transactions.reduce((acc, txn) => {
        const category = txn.category || 'OTHER';
        const amount = parseFloat(txn.amount) || 0;
        if (!acc[category]) {
          acc[category] = {
            count: 0,
            total: 0,
            avg: 0,
          };
        }
        acc[category].count++;
        acc[category].total += amount;
        acc[category].avg = acc[category].total / acc[category].count;
        return acc;
      }, {});

      console.log('Category summary:', summary);
      setCategoryData(pieData);
      setMonthlyData(barData);
      setCategorySummary(summary);
      setLoading(false);
    } catch (err) {
      console.error('Error processing transactions:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [transactions]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error loading analytics: {error}</Alert>;
  }

  return (
    <div className="finance-analytics">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Spending by Category</h5>
            </CardHeader>
            <CardBody>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${parseFloat(value).toFixed(2)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardHeader>
              <h5 className="mb-0">Monthly Spending</h5>
            </CardHeader>
            <CardBody>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(month) =>
                        new Date(month).toLocaleDateString('en-US', {
                          month: 'short',
                          year: '2-digit',
                        })
                      }
                    />
                    <YAxis
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => `$${parseFloat(value).toFixed(2)}`}
                    />
                    <Bar dataKey="total" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <CardHeader>
          <h5 className="mb-0">Category Summary</h5>
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Category</th>
                <th>Transactions</th>
                <th>Total Spent</th>
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categorySummary).map(([category, data]) => (
                <tr key={category}>
                  <td>
                    <Badge bg="primary">{category}</Badge>
                  </td>
                  <td>{data.count}</td>
                  <td>${data.total.toFixed(2)}</td>
                  <td>${data.avg.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h5 className="mb-0">Recent Transactions</h5>
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>{txn.merchant}</td>
                  <td>
                    <Badge bg="primary">{txn.category}</Badge>
                  </td>
                  <td>${txn.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default FinanceAnalytics;
