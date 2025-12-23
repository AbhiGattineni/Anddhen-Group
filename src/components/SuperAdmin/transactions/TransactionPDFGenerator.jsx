import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#3f51b5',
    padding: 20,
    marginBottom: 20,
    marginLeft: -30,
    marginRight: -30,
    marginTop: -30,
  },
  headerTitle: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginBottom: 8,
    borderBottom: '2 solid #3f51b5',
    paddingBottom: 4,
  },
  filterInfo: {
    fontSize: 9,
    color: '#666',
    marginBottom: 5,
  },
  statsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 9,
    color: '#666',
  },
  statValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statValuePositive: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statValueNegative: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#c62828',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    minHeight: 25,
    alignItems: 'center',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    minHeight: 25,
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
    color: 'white',
    fontWeight: 'bold',
    minHeight: 30,
    alignItems: 'center',
  },
  tableCol: {
    padding: 5,
    fontSize: 8,
  },
  tableColHeader: {
    padding: 5,
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
  },
  // Payment breakdown columns
  col1: { width: '40%' },
  col2: { width: '20%' },
  col3: { width: '25%' },
  col4: { width: '15%' },
  // Monthly stats columns
  colMonth: { width: '25%' },
  colCount: { width: '15%' },
  colCredit: { width: '20%' },
  colDebit: { width: '20%' },
  colNet: { width: '20%' },
  // Transaction columns
  colSerial: { width: '5%' },
  colDate: { width: '12%' },
  colSender: { width: '15%' },
  colReceiver: { width: '15%' },
  colPayment: { width: '12%' },
  colCreditAmt: { width: '12%', textAlign: 'right', color: '#2e7d32' },
  colDebitAmt: { width: '12%', textAlign: 'right', color: '#c62828' },
  colDesc: { width: '17%' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTop: '1 solid #ddd',
    paddingTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightBox: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderLeft: '3 solid #3f51b5',
  },
  highlightText: {
    fontSize: 9,
    color: '#1565c0',
    marginBottom: 3,
  },
});

// Calculate overall statistics
const calculateOverallStatistics = transactions => {
  let totalCredits = 0;
  let totalDebits = 0;
  let creditCount = 0;
  let debitCount = 0;

  transactions.forEach(tx => {
    if (tx.transaction_type === 'credit') {
      totalCredits += parseFloat(tx.credited_amount || 0);
      creditCount++;
    } else if (tx.transaction_type === 'debit') {
      totalDebits += parseFloat(tx.debited_amount || 0);
      debitCount++;
    }
  });

  return {
    totalCount: transactions.length,
    creditCount,
    debitCount,
    totalCredits,
    totalDebits,
    netBalance: totalCredits - totalDebits,
    averageCredit: creditCount > 0 ? totalCredits / creditCount : 0,
    averageDebit: debitCount > 0 ? totalDebits / debitCount : 0,
  };
};

// Calculate monthly statistics
const calculateMonthlyStatistics = transactions => {
  const monthlyData = {};

  transactions.forEach(tx => {
    const date = new Date(tx.transaction_datetime);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthName,
        monthKey,
        totalTransactions: 0,
        creditCount: 0,
        debitCount: 0,
        totalCredits: 0,
        totalDebits: 0,
      };
    }

    monthlyData[monthKey].totalTransactions++;

    if (tx.transaction_type === 'credit') {
      monthlyData[monthKey].creditCount++;
      monthlyData[monthKey].totalCredits += parseFloat(tx.credited_amount || 0);
    } else if (tx.transaction_type === 'debit') {
      monthlyData[monthKey].debitCount++;
      monthlyData[monthKey].totalDebits += parseFloat(tx.debited_amount || 0);
    }
  });

  // Sort by month (newest first)
  return Object.values(monthlyData)
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
    .map(month => ({
      ...month,
      netBalance: month.totalCredits - month.totalDebits,
    }));
};

// Calculate payment type breakdown
const calculatePaymentTypeBreakdown = transactions => {
  const breakdown = {};
  let totalAmount = 0;

  transactions.forEach(tx => {
    const type = tx.payment_type || 'Unknown';
    const amount =
      tx.transaction_type === 'credit'
        ? parseFloat(tx.credited_amount || 0)
        : parseFloat(tx.debited_amount || 0);

    if (!breakdown[type]) {
      breakdown[type] = { count: 0, amount: 0 };
    }

    breakdown[type].count++;
    breakdown[type].amount += amount;
    totalAmount += amount;
  });

  return Object.entries(breakdown)
    .map(([type, data]) => ({
      type,
      count: data.count,
      amount: data.amount,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

// Calculate subsidiary breakdown
const calculateSubsidiaryBreakdown = transactions => {
  const breakdown = {};

  transactions.forEach(tx => {
    const subsidiary = tx.subsidiary || 'Unknown';

    if (!breakdown[subsidiary]) {
      breakdown[subsidiary] = {
        count: 0,
        credits: 0,
        debits: 0,
      };
    }

    breakdown[subsidiary].count++;

    if (tx.transaction_type === 'credit') {
      breakdown[subsidiary].credits += parseFloat(tx.credited_amount || 0);
    } else if (tx.transaction_type === 'debit') {
      breakdown[subsidiary].debits += parseFloat(tx.debited_amount || 0);
    }
  });

  return Object.entries(breakdown)
    .map(([subsidiary, data]) => ({
      subsidiary,
      count: data.count,
      credits: data.credits,
      debits: data.debits,
      net: data.credits - data.debits,
    }))
    .sort((a, b) => b.net - a.net);
};

// Format currency
const formatCurrency = amount => {
  return `₹ ${parseFloat(amount).toFixed(2)}`;
};

// Format date
const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// PDF Document Component
const TransactionPDFDocument = ({ transactions, filters }) => {
  const overallStats = calculateOverallStatistics(transactions);
  const monthlyStats = calculateMonthlyStatistics(transactions);
  const paymentBreakdown = calculatePaymentTypeBreakdown(transactions);
  const subsidiaryBreakdown = calculateSubsidiaryBreakdown(transactions);

  const reportDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Build filter text
  const filterTexts = [];
  if (filters.startDate) filterTexts.push(`Start: ${formatDate(filters.startDate)}`);
  if (filters.endDate) filterTexts.push(`End: ${formatDate(filters.endDate)}`);
  if (filters.selectedName) filterTexts.push(`Name: ${filters.selectedName}`);
  if (filters.selectedPaymentType) filterTexts.push(`Payment: ${filters.selectedPaymentType}`);
  if (filters.selectedSubsidiary) filterTexts.push(`Subsidiary: ${filters.selectedSubsidiary}`);
  if (filters.selectedCurrency) filterTexts.push(`Currency: ${filters.selectedCurrency}`);

  return (
    <Document>
      {/* Page 1: Summary & Statistics */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ANDDHEN TRANSACTION REPORT</Text>
          <Text style={styles.headerSubtitle}>Generated on: {reportDate}</Text>
        </View>

        {/* Filter Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter Criteria</Text>
          <Text style={styles.filterInfo}>
            {filterTexts.length > 0
              ? filterTexts.join(' | ')
              : 'No filters applied - Showing all transactions'}
          </Text>
        </View>

        {/* Overall Statistical Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Summary</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Transactions:</Text>
                <Text style={styles.statValue}>{overallStats.totalCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Credit Transactions:</Text>
                <Text style={styles.statValue}>{overallStats.creditCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Debit Transactions:</Text>
                <Text style={styles.statValue}>{overallStats.debitCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Credits:</Text>
                <Text style={styles.statValuePositive}>
                  {formatCurrency(overallStats.totalCredits)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Debits:</Text>
                <Text style={styles.statValueNegative}>
                  {formatCurrency(overallStats.totalDebits)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Net Balance:</Text>
                <Text
                  style={
                    overallStats.netBalance >= 0
                      ? styles.statValuePositive
                      : styles.statValueNegative
                  }
                >
                  {formatCurrency(overallStats.netBalance)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average Credit Amount:</Text>
                <Text style={styles.statValue}>{formatCurrency(overallStats.averageCredit)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Average Debit Amount:</Text>
                <Text style={styles.statValue}>{formatCurrency(overallStats.averageDebit)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightText}>
              This section shows credit/debit trends per month
            </Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableColHeader, styles.colMonth]}>Month</Text>
              <Text style={[styles.tableColHeader, styles.colCount]}>Count</Text>
              <Text style={[styles.tableColHeader, styles.colCredit]}>Credits</Text>
              <Text style={[styles.tableColHeader, styles.colDebit]}>Debits</Text>
              <Text style={[styles.tableColHeader, styles.colNet]}>Net Balance</Text>
            </View>
            {monthlyStats.map((month, index) => (
              <View
                key={month.monthKey}
                style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
              >
                <Text style={[styles.tableCol, styles.colMonth]}>{month.month}</Text>
                <Text style={[styles.tableCol, styles.colCount]}>
                  {month.totalTransactions} ({month.creditCount}C / {month.debitCount}D)
                </Text>
                <Text style={[styles.tableCol, styles.colCredit, { color: '#2e7d32' }]}>
                  {formatCurrency(month.totalCredits)}
                </Text>
                <Text style={[styles.tableCol, styles.colDebit, { color: '#c62828' }]}>
                  {formatCurrency(month.totalDebits)}
                </Text>
                <Text
                  style={[
                    styles.tableCol,
                    styles.colNet,
                    { color: month.netBalance >= 0 ? '#2e7d32' : '#c62828' },
                  ]}
                >
                  {formatCurrency(month.netBalance)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerRow}>
            <Text>Anddhen Transaction Management</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            <Text>Balance: {formatCurrency(overallStats.netBalance)}</Text>
          </View>
        </View>
      </Page>

      {/* Page 2: Payment Type & Subsidiary Breakdown */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Payment Type Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Type Analysis</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableColHeader, styles.col1]}>Payment Type</Text>
              <Text style={[styles.tableColHeader, styles.col2]}>Count</Text>
              <Text style={[styles.tableColHeader, styles.col3]}>Total Amount</Text>
              <Text style={[styles.tableColHeader, styles.col4]}>Percentage</Text>
            </View>
            {paymentBreakdown.map((item, index) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCol, styles.col1]}>{item.type}</Text>
                <Text style={[styles.tableCol, styles.col2]}>{item.count}</Text>
                <Text style={[styles.tableCol, styles.col3]}>{formatCurrency(item.amount)}</Text>
                <Text style={[styles.tableCol, styles.col4]}>{item.percentage.toFixed(1)}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subsidiary Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subsidiary Analysis</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableColHeader, styles.col1]}>Subsidiary</Text>
              <Text style={[styles.tableColHeader, styles.col2]}>Count</Text>
              <Text style={[styles.tableColHeader, styles.col3]}>Credits</Text>
              <Text style={[styles.tableColHeader, styles.col3]}>Debits</Text>
              <Text style={[styles.tableColHeader, styles.col4]}>Net</Text>
            </View>
            {subsidiaryBreakdown.map((item, index) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCol, styles.col1]}>{item.subsidiary}</Text>
                <Text style={[styles.tableCol, styles.col2]}>{item.count}</Text>
                <Text style={[styles.tableCol, styles.col3, { color: '#2e7d32' }]}>
                  {formatCurrency(item.credits)}
                </Text>
                <Text style={[styles.tableCol, styles.col3, { color: '#c62828' }]}>
                  {formatCurrency(item.debits)}
                </Text>
                <Text
                  style={[
                    styles.tableCol,
                    styles.col4,
                    { color: item.net >= 0 ? '#2e7d32' : '#c62828' },
                  ]}
                >
                  {formatCurrency(item.net)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerRow}>
            <Text>Transaction Management System</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            <Text>Balance: {formatCurrency(overallStats.netBalance)}</Text>
          </View>
        </View>
      </Page>

      {/* Page 3: Transaction Details */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableColHeader, styles.colSerial]}>#</Text>
              <Text style={[styles.tableColHeader, styles.colDate]}>Date</Text>
              <Text style={[styles.tableColHeader, styles.colSender]}>Sender</Text>
              <Text style={[styles.tableColHeader, styles.colReceiver]}>Receiver</Text>
              <Text style={[styles.tableColHeader, styles.colPayment]}>Payment Type</Text>
              <Text style={[styles.tableColHeader, styles.colCreditAmt]}>Credit</Text>
              <Text style={[styles.tableColHeader, styles.colDebitAmt]}>Debit</Text>
              <Text style={[styles.tableColHeader, styles.colDesc]}>Description</Text>
            </View>
            {transactions.map((tx, index) => {
              const amount =
                tx.transaction_type === 'credit' ? tx.credited_amount : tx.debited_amount;

              return (
                <View
                  key={tx.id || index}
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={[styles.tableCol, styles.colSerial]}>{index + 1}</Text>
                  <Text style={[styles.tableCol, styles.colDate]}>
                    {formatDate(tx.transaction_datetime)}
                  </Text>
                  <Text style={[styles.tableCol, styles.colSender]}>{tx.sender_name || '-'}</Text>
                  <Text style={[styles.tableCol, styles.colReceiver]}>
                    {tx.receiver_name || '-'}
                  </Text>
                  <Text style={[styles.tableCol, styles.colPayment]}>{tx.payment_type || '-'}</Text>
                  <Text style={[styles.tableCol, styles.colCreditAmt]}>
                    {tx.transaction_type === 'credit' ? formatCurrency(amount) : '-'}
                  </Text>
                  <Text style={[styles.tableCol, styles.colDebitAmt]}>
                    {tx.transaction_type === 'debit' ? formatCurrency(amount) : '-'}
                  </Text>
                  <Text style={[styles.tableCol, styles.colDesc]}>{tx.description || '-'}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerRow}>
            <Text>Transaction Management System</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            <Text>Balance: {formatCurrency(overallStats.netBalance)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// PropTypes validation
TransactionPDFDocument.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      transaction_type: PropTypes.string,
      transaction_datetime: PropTypes.string,
      sender_name: PropTypes.string,
      receiver_name: PropTypes.string,
      accountant_name: PropTypes.string,
      payment_type: PropTypes.string,
      subsidiary: PropTypes.string,
      currency: PropTypes.string,
      credited_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      debited_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
    })
  ).isRequired,
  filters: PropTypes.shape({
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    selectedName: PropTypes.string,
    selectedColumn: PropTypes.string,
    selectedPaymentType: PropTypes.string,
    selectedSubsidiary: PropTypes.string,
    selectedCurrency: PropTypes.string,
  }),
};

// Default props
TransactionPDFDocument.defaultProps = {
  filters: {},
};

// Export function to generate and download PDF
export const generateTransactionPDF = async (transactions, filters = {}) => {
  try {
    const blob = await pdf(
      <TransactionPDFDocument transactions={transactions} filters={filters} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Transaction_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return { success: false, error };
  }
};

export default TransactionPDFDocument;
