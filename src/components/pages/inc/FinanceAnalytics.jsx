import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  Pagination,
  Form,
  ListGroup,
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
  ResponsiveContainer,
  Legend,
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

const CardSuggestions = ({ cardSuggestions }) => {
  if (!cardSuggestions) return null;

  return (
    <Card className="mb-4">
      <CardHeader>
        <h5 className="mb-0">Card Recommendations</h5>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md={6}>
            <Card className="mb-3">
              <CardHeader>
                <h6 className="mb-0">Recommended Cards</h6>
              </CardHeader>
              <CardBody>
                <ListGroup>
                  {cardSuggestions.recommended_cards.map((card, index) => (
                    <ListGroup.Item key={index}>
                      <h6 className="mb-2">{card.card_name}</h6>
                      <p className="mb-1">
                        <strong>Issuer:</strong> {card.issuer}
                      </p>
                      <p className="mb-1">
                        <strong>Annual Fee:</strong> ${card.annual_fee}
                      </p>
                      <p className="mb-1">
                        <strong>Sign-up Bonus:</strong> {card.signup_bonus}
                      </p>
                      <p className="mb-1">
                        <strong>Estimated Monthly Savings:</strong> $
                        {card.estimated_monthly_savings}
                      </p>
                      <div className="mb-2">
                        <strong>Rewards Structure:</strong>
                        <Table size="sm" className="mt-2">
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Rate</th>
                              <th>Cap</th>
                            </tr>
                          </thead>
                          <tbody>
                            {card.rewards_structure.map((reward, idx) => (
                              <tr key={idx}>
                                <td>{reward.category}</td>
                                <td>{reward.rate}</td>
                                <td>{reward.cap}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                      <p className="mb-1">
                        <strong>Best For:</strong>{' '}
                        {card.best_for_categories.map(cat => (
                          <Badge bg="success" className="me-1" key={cat}>
                            {cat}
                          </Badge>
                        ))}
                      </p>
                      <p className="mb-0 text-muted small">{card.justification}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-3">
              <CardHeader>
                <h6 className="mb-0">Cards to Avoid</h6>
              </CardHeader>
              <CardBody>
                <ListGroup>
                  {cardSuggestions.cards_to_avoid.map((card, index) => (
                    <ListGroup.Item key={index} className="text-danger">
                      <h6 className="mb-1">{card.card_name}</h6>
                      <p className="mb-0 small">{card.reason}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h6 className="mb-0">Spending Analysis</h6>
              </CardHeader>
              <CardBody>
                <p className="mb-1">
                  <strong>Highest Spending Category:</strong>{' '}
                  <Badge bg="primary">
                    {cardSuggestions.spending_analysis.highest_spending_category}
                  </Badge>
                </p>
                <p className="mb-1">
                  <strong>Potential Annual Savings:</strong> $
                  {cardSuggestions.spending_analysis.potential_savings}
                </p>
                <p className="mb-0 text-muted small">
                  {cardSuggestions.spending_analysis.recommendation_summary}
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

CardSuggestions.propTypes = {
  cardSuggestions: PropTypes.shape({
    recommended_cards: PropTypes.arrayOf(
      PropTypes.shape({
        card_name: PropTypes.string.isRequired,
        issuer: PropTypes.string.isRequired,
        annual_fee: PropTypes.number.isRequired,
        signup_bonus: PropTypes.string.isRequired,
        rewards_structure: PropTypes.arrayOf(
          PropTypes.shape({
            category: PropTypes.string.isRequired,
            rate: PropTypes.string.isRequired,
            cap: PropTypes.string.isRequired,
          })
        ).isRequired,
        estimated_monthly_savings: PropTypes.number.isRequired,
        justification: PropTypes.string.isRequired,
        best_for_categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    cards_to_avoid: PropTypes.arrayOf(
      PropTypes.shape({
        card_name: PropTypes.string.isRequired,
        reason: PropTypes.string.isRequired,
      })
    ).isRequired,
    spending_analysis: PropTypes.shape({
      highest_spending_category: PropTypes.string.isRequired,
      potential_savings: PropTypes.number.isRequired,
      recommendation_summary: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

const FinanceAnalytics = ({ transactions, cardSuggestions }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [merchantData, setMerchantData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [merchantSummary, setMerchantSummary] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [merchantPage, setMerchantPage] = useState(1);
  const [merchantRecordsPerPage, setMerchantRecordsPerPage] = useState(10);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [merchantSearch, setMerchantSearch] = useState('');

  useEffect(() => {
    if (!transactions || !Array.isArray(transactions)) {
      console.log('No valid transactions data:', transactions);
      setLoading(false);
      return;
    }

    try {
      console.log('Processing transactions:', transactions);
      // Process transactions for merchant pie chart
      const merchantTotals = transactions.reduce((acc, txn) => {
        console.log('Processing transaction:', txn);
        const merchant = txn.merchant || 'UNKNOWN';
        const amount = parseFloat(txn.amount) || 0;
        acc[merchant] = (acc[merchant] || 0) + amount;
        return acc;
      }, {});

      console.log('Merchant totals:', merchantTotals);
      const pieData = Object.entries(merchantTotals)
        .map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value); // Sort by amount in descending order
      console.log('Pie chart data:', pieData);

      // Process transactions for monthly bar chart
      const monthlyTotals = transactions.reduce((acc, txn) => {
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

      const barData = Object.entries(monthlyTotals)
        .map(([month, total]) => ({
          month,
          total: parseFloat(total.toFixed(2)),
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
      console.log('Bar chart data:', barData);

      // Calculate merchant summary
      const summary = transactions.reduce((acc, txn) => {
        const merchant = txn.merchant || 'UNKNOWN';
        const amount = parseFloat(txn.amount) || 0;
        if (!acc[merchant]) {
          acc[merchant] = {
            count: 0,
            total: 0,
            avg: 0,
            category: txn.category || 'OTHER', // Keep category for reference
          };
        }
        acc[merchant].count++;
        acc[merchant].total += amount;
        acc[merchant].avg = acc[merchant].total / acc[merchant].count;
        return acc;
      }, {});

      console.log('Merchant summary:', summary);
      setMerchantData(pieData);
      setMonthlyData(barData);
      setMerchantSummary(summary);
      setLoading(false);
    } catch (err) {
      console.error('Error processing transactions:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [transactions]);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(txn => {
    const searchLower = transactionSearch.toLowerCase();
    return (
      txn.merchant.toLowerCase().includes(searchLower) ||
      txn.category.toLowerCase().includes(searchLower) ||
      txn.amount.toString().includes(searchLower) ||
      new Date(txn.date).toLocaleDateString().includes(searchLower)
    );
  });

  // Filter merchants based on search
  const filteredMerchants = Object.entries(merchantSummary)
    .filter(([merchant, data]) => {
      const searchLower = merchantSearch.toLowerCase();
      return (
        merchant.toLowerCase().includes(searchLower) ||
        data.category.toLowerCase().includes(searchLower) ||
        data.total.toString().includes(searchLower)
      );
    })
    .sort((a, b) => b[1].total - a[1].total);

  // Update pagination calculations for filtered data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTransactions.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredTransactions.length / recordsPerPage);

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
  };

  const handleRecordsPerPageChange = event => {
    setRecordsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  // Update merchant pagination calculations for filtered data
  const indexOfLastMerchant = merchantPage * merchantRecordsPerPage;
  const indexOfFirstMerchant = indexOfLastMerchant - merchantRecordsPerPage;
  const currentMerchants = filteredMerchants.slice(indexOfFirstMerchant, indexOfLastMerchant);
  const totalMerchantPages = Math.ceil(filteredMerchants.length / merchantRecordsPerPage);

  const handleMerchantPageChange = pageNumber => {
    setMerchantPage(pageNumber);
  };

  const handleMerchantRecordsPerPageChange = event => {
    setMerchantRecordsPerPage(Number(event.target.value));
    setMerchantPage(1); // Reset to first page when changing records per page
  };

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
              <h5 className="mb-0">Spending by Merchant</h5>
            </CardHeader>
            <CardBody>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={merchantData}
                      dataKey="value"
                      nameKey="name"
                      cx="40%"
                      cy="50%"
                      outerRadius={100}
                      label={false}
                    >
                      {merchantData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={value => `$${parseFloat(value).toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '8px',
                      }}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      content={({ payload }) => (
                        <div
                          style={{
                            marginLeft: '20px',
                            maxHeight: '350px',
                            overflowY: 'auto',
                            paddingRight: '10px',
                          }}
                        >
                          {payload.map((entry, index) => (
                            <div
                              key={`legend-${index}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '8px',
                                fontSize: '13px',
                              }}
                            >
                              <div
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  backgroundColor: entry.color,
                                  marginRight: '8px',
                                  flexShrink: 0,
                                }}
                              />
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  minWidth: 0, // Enable text truncation
                                }}
                              >
                                <span
                                  style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '150px',
                                  }}
                                >
                                  {entry.value}
                                </span>
                                <span
                                  style={{
                                    color: '#666',
                                    fontSize: '12px',
                                  }}
                                >
                                  ${parseFloat(merchantData[index].value).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                      tickFormatter={month =>
                        new Date(month).toLocaleDateString('en-US', {
                          month: 'short',
                          year: '2-digit',
                        })
                      }
                    />
                    <YAxis tickFormatter={value => `$${value.toLocaleString()}`} />
                    <Tooltip formatter={value => `$${parseFloat(value).toFixed(2)}`} />
                    <Bar dataKey="total" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {cardSuggestions && <CardSuggestions cardSuggestions={cardSuggestions} />}

      <Card className="mb-4">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Merchant Summary</h5>
          <div className="d-flex align-items-center gap-3">
            <Form.Control
              type="search"
              placeholder="Search merchants..."
              value={merchantSearch}
              onChange={e => {
                setMerchantSearch(e.target.value);
                setMerchantPage(1); // Reset to first page on search
              }}
              style={{ width: '200px' }}
            />
            <Form.Select
              style={{ width: 'auto' }}
              value={merchantRecordsPerPage}
              onChange={handleMerchantRecordsPerPageChange}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </Form.Select>
          </div>
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Category</th>
                <th>Transactions</th>
                <th>Total Spent</th>
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              {currentMerchants.map(([merchant, data]) => (
                <tr key={merchant}>
                  <td>
                    <Badge bg="primary">{merchant}</Badge>
                  </td>
                  <td>
                    <Badge bg="secondary">{data.category}</Badge>
                  </td>
                  <td>{data.count}</td>
                  <td>${data.total.toFixed(2)}</td>
                  <td>${data.avg.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {indexOfFirstMerchant + 1} to{' '}
              {Math.min(indexOfLastMerchant, filteredMerchants.length)} of{' '}
              {filteredMerchants.length} merchants
            </div>
            <Pagination>
              <Pagination.First
                onClick={() => handleMerchantPageChange(1)}
                disabled={merchantPage === 1}
              />
              <Pagination.Prev
                onClick={() => handleMerchantPageChange(merchantPage - 1)}
                disabled={merchantPage === 1}
              />
              {[...Array(totalMerchantPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === merchantPage}
                  onClick={() => handleMerchantPageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handleMerchantPageChange(merchantPage + 1)}
                disabled={merchantPage === totalMerchantPages}
              />
              <Pagination.Last
                onClick={() => handleMerchantPageChange(totalMerchantPages)}
                disabled={merchantPage === totalMerchantPages}
              />
            </Pagination>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Transactions</h5>
          <div className="d-flex align-items-center gap-3">
            <Form.Control
              type="search"
              placeholder="Search transactions..."
              value={transactionSearch}
              onChange={e => {
                setTransactionSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              style={{ width: '200px' }}
            />
            <Form.Select
              style={{ width: 'auto' }}
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </Form.Select>
          </div>
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
              {currentRecords.map((txn, index) => (
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
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {indexOfFirstRecord + 1} to{' '}
              {Math.min(indexOfLastRecord, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} entries
            </div>
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

FinanceAnalytics.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      merchant: PropTypes.string.isRequired,
      category: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  cardSuggestions: PropTypes.shape({
    recommended_cards: PropTypes.arrayOf(
      PropTypes.shape({
        card_name: PropTypes.string.isRequired,
        issuer: PropTypes.string.isRequired,
        annual_fee: PropTypes.number.isRequired,
        signup_bonus: PropTypes.string.isRequired,
        rewards_structure: PropTypes.arrayOf(
          PropTypes.shape({
            category: PropTypes.string.isRequired,
            rate: PropTypes.string.isRequired,
            cap: PropTypes.string.isRequired,
          })
        ).isRequired,
        estimated_monthly_savings: PropTypes.number.isRequired,
        justification: PropTypes.string.isRequired,
        best_for_categories: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    cards_to_avoid: PropTypes.arrayOf(
      PropTypes.shape({
        card_name: PropTypes.string.isRequired,
        reason: PropTypes.string.isRequired,
      })
    ).isRequired,
    spending_analysis: PropTypes.shape({
      highest_spending_category: PropTypes.string.isRequired,
      potential_savings: PropTypes.number.isRequired,
      recommendation_summary: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

export default FinanceAnalytics;
