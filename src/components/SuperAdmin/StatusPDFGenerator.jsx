import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Professional Modern Styles
const styles = StyleSheet.create({
  page: {
    padding: 0,
    paddingTop: 0,
    paddingBottom: 60,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  // Header Section
  header: {
    backgroundColor: '#1e293b',
    padding: 30,
    marginBottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 5,
  },
  headerDate: {
    fontSize: 9,
    color: '#94a3b8',
    textAlign: 'right',
  },
  headerDivider: {
    height: 3,
    backgroundColor: '#3b82f6',
    marginTop: 10,
  },
  // Employee Info Card
  employeeCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 25,
    marginBottom: 25,
    padding: 20,
    borderRadius: 8,
    border: '1 solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottom: '2 solid #f1f5f9',
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  employeeId: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
  },
  employeeBadge: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '6 12',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
  },
  // Filter Section
  filterSection: {
    backgroundColor: '#f8fafc',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 6,
    border: '1 solid #e2e8f0',
  },
  filterTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterText: {
    fontSize: 9,
    color: '#64748b',
  },
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 0,
    marginBottom: 25,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 8,
    border: '1 solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  statCardPrimary: {
    backgroundColor: '#eff6ff',
    border: '1 solid #bfdbfe',
  },
  statCardSuccess: {
    backgroundColor: '#f0fdf4',
    border: '1 solid #bbf7d0',
  },
  statCardWarning: {
    backgroundColor: '#fffbeb',
    border: '1 solid #fde68a',
  },
  statCardInfo: {
    backgroundColor: '#f0f9ff',
    border: '1 solid #bae6fd',
  },
  statLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statValuePrimary: {
    color: '#2563eb',
  },
  statValueSuccess: {
    color: '#16a34a',
  },
  statValueWarning: {
    color: '#ca8a04',
  },
  statValueInfo: {
    color: '#0284c7',
  },
  statSubtext: {
    fontSize: 8,
    color: '#94a3b8',
  },
  // Section Title
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    marginTop: 0,
    paddingBottom: 8,
    borderBottom: '3 solid #3b82f6',
  },
  sectionTitleContainer: {
    margin: 20,
    marginTop: 25,
    marginBottom: 15,
    paddingTop: 10,
  },
  // Table Styles
  table: {
    margin: 20,
    marginTop: 15,
    marginBottom: 25,
    border: '1 solid #e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingVertical: 12,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    minHeight: 32,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    minHeight: 32,
  },
  tableCell: {
    fontSize: 8,
    color: '#334155',
  },
  // Column widths
  colDate: { width: '15%', paddingHorizontal: 8 },
  colLeave: { width: '10%', alignItems: 'center', paddingHorizontal: 8 },
  colStatus: { width: '30%', paddingHorizontal: 8 },
  colDetails: { width: '45%', paddingHorizontal: 8 },
  // Badge Styles
  badge: {
    padding: '4 10',
    borderRadius: 12,
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  badgeLeave: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  badgeWorking: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    padding: 12,
    borderTop: '3 solid #3b82f6',
    height: 50,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#cbd5e1',
  },
  footerPage: {
    fontSize: 8,
    color: '#94a3b8',
  },
  // Info Box
  infoBox: {
    backgroundColor: '#f0f9ff',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 6,
    borderLeft: '4 solid #3b82f6',
  },
  infoText: {
    fontSize: 8,
    color: '#1e40af',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  // Empty State
  emptyState: {
    padding: 40,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 10,
    color: '#94a3b8',
  },
});

// Calculate statistics
const calculateStatistics = statuses => {
  let totalStatuses = statuses.length;
  let leaveCount = 0;
  let workingCount = 0;

  statuses.forEach(status => {
    const leave = status.userStatus?.leave;
    if (leave === true || leave === 'true' || leave === 1 || leave === '1') {
      leaveCount++;
    } else {
      workingCount++;
    }
  });

  const leavePercentage = totalStatuses > 0 ? ((leaveCount / totalStatuses) * 100).toFixed(1) : 0;
  const workingPercentage =
    totalStatuses > 0 ? ((workingCount / totalStatuses) * 100).toFixed(1) : 0;

  return {
    totalStatuses,
    leaveCount,
    workingCount,
    leavePercentage,
    workingPercentage,
  };
};

// Format date
const formatDate = dateString => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

// Format date with time
const formatDateTime = dateString => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
};

// Format status value
const formatStatusValue = (key, value) => {
  if (value === null || value === undefined || value === '') return '-';

  if (key === 'leave') {
    return value === true || value === 'true' || value === 1 || value === '1' ? 'Yes' : 'No';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (key === 'ticket_link' || key === 'github_link') {
    return value.toString().substring(0, 40) + (value.toString().length > 40 ? '...' : '');
  }

  return value.toString();
};

// PDF Document Component
const StatusPDFDocument = ({ statuses, employeeName, employeeId, filters }) => {
  const stats = calculateStatistics(statuses);

  const reportDate = formatDateTime(new Date().toISOString());

  // Build filter text
  const filterTexts = [];
  if (filters.startDate) filterTexts.push(`From: ${formatDate(filters.startDate)}`);
  if (filters.endDate) filterTexts.push(`To: ${formatDate(filters.endDate)}`);
  if (filters.leaveFilter && filters.leaveFilter !== 'all') {
    filterTexts.push(
      `Leave Status: ${filters.leaveFilter === 'with_leave' ? 'With Leave' : 'Without Leave'}`
    );
  }

  // Render a single status row with break prevention
  const renderStatusRow = (status, index) => {
    const leave = status.userStatus?.leave;
    const isLeave = leave === true || leave === 'true' || leave === 1 || leave === '1';

    // Get all status fields except excluded ones
    const allFields = Object.entries(status.userStatus || {}).filter(([key, value]) => {
      if (
        key === 'id' ||
        key === 'user_id' ||
        key === 'user_name' ||
        key === 'date' ||
        value === '' ||
        value === '0.00' ||
        value === 0 ||
        value === '0' ||
        value === null
      ) {
        return false;
      }
      return true;
    });

    const statusFields = allFields.slice(0, 4);
    const remainingFields = allFields.slice(4);

    return (
      <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
        <View style={styles.colDate}>
          <Text style={styles.tableCell}>{formatDate(status.date)}</Text>
        </View>
        <View style={styles.colLeave}>
          <View style={[styles.badge, isLeave ? styles.badgeLeave : styles.badgeWorking]}>
            <Text style={{ fontSize: 7, fontWeight: 'bold' }}>{isLeave ? 'LEAVE' : 'WORK'}</Text>
          </View>
        </View>
        <View style={styles.colStatus}>
          <Text style={styles.tableCell}>
            {statusFields.length > 0
              ? statusFields
                  .map(
                    ([key, value]) =>
                      `${key.replace(/_/g, ' ').toUpperCase()}: ${formatStatusValue(key, value)}`
                  )
                  .join('\n')
              : 'No data'}
          </Text>
        </View>
        <View style={styles.colDetails}>
          <Text style={styles.tableCell}>
            {remainingFields.length > 0
              ? remainingFields
                  .map(
                    ([key, value]) =>
                      `${key.replace(/_/g, ' ').toUpperCase()}: ${formatStatusValue(key, value)}`
                  )
                  .join('\n')
              : statusFields.length === 0
                ? 'No additional information'
                : ''}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      {/* Page 1: Cover & Summary */}
      <Page size="A4" style={styles.page}>
        {/* Professional Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>EMPLOYEE STATUS REPORT</Text>
              <Text style={styles.headerSubtitle}>Comprehensive Status Analysis</Text>
            </View>
            <View>
              <Text style={styles.headerDate}>{reportDate}</Text>
            </View>
          </View>
          <View style={styles.headerDivider} />
        </View>

        {/* Employee Information Card */}
        <View style={styles.employeeCard}>
          <View style={styles.employeeHeader}>
            <View>
              <Text style={styles.employeeName}>{employeeName || 'N/A'}</Text>
              {employeeId && <Text style={styles.employeeId}>ID: {employeeId}</Text>}
            </View>
            <View style={styles.employeeBadge}>
              <Text>ACTIVE EMPLOYEE</Text>
            </View>
          </View>
        </View>

        {/* Filter Information */}
        {filterTexts.length > 0 && (
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Applied Filters</Text>
            <Text style={styles.filterText}>{filterTexts.join(' • ')}</Text>
          </View>
        )}

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statLabel}>Total Records</Text>
            <Text style={[styles.statValue, styles.statValuePrimary]}>{stats.totalStatuses}</Text>
            <Text style={styles.statSubtext}>Status entries</Text>
          </View>
          <View style={[styles.statCard, styles.statCardSuccess]}>
            <Text style={styles.statLabel}>Working Days</Text>
            <Text style={[styles.statValue, styles.statValueSuccess]}>{stats.workingCount}</Text>
            <Text style={styles.statSubtext}>{stats.workingPercentage}% of total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardWarning]}>
            <Text style={styles.statLabel}>Leave Days</Text>
            <Text style={[styles.statValue, styles.statValueWarning]}>{stats.leaveCount}</Text>
            <Text style={styles.statSubtext}>{stats.leavePercentage}% of total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardInfo]}>
            <Text style={styles.statLabel}>Report Period</Text>
            <Text style={[styles.statValue, styles.statValueInfo]} numberOfLines={1}>
              {statuses.length > 0 ? `${formatDate(statuses[statuses.length - 1]?.date)}` : 'N/A'}
            </Text>
            <Text style={styles.statSubtext}>
              {statuses.length > 0 ? `to ${formatDate(statuses[0]?.date)}` : ''}
            </Text>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📊 This report contains comprehensive status updates for the selected employee
          </Text>
          <Text style={styles.infoText}>
            📅 Status records are sorted chronologically (newest first)
          </Text>
          <Text style={styles.infoText}>
            📋 Detailed status information is available on the following pages
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>Anddhen Group - Status Management System</Text>
            <Text
              style={styles.footerPage}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
            <Text style={styles.footerText}>Confidential Document</Text>
          </View>
        </View>
      </Page>

      {/* Page 2+: Status Details - Multiple Pages with Proper Breaks */}
      {(() => {
        const rowsPerPage = 14; // Conservative row count to ensure no breaks and proper spacing
        const pages = [];

        for (let i = 0; i < statuses.length; i += rowsPerPage) {
          const pageStatuses = statuses.slice(i, i + rowsPerPage);
          const startRecord = i + 1;
          const endRecord = Math.min(i + rowsPerPage, statuses.length);

          pages.push(
            <Page key={`detail-page-${i}`} size="A4" style={styles.page}>
              {/* Header for detail pages */}
              <View style={styles.header}>
                <View style={styles.headerTop}>
                  <View>
                    <Text style={styles.headerTitle}>STATUS DETAILS</Text>
                    <Text style={styles.headerSubtitle}>
                      {employeeName || 'Employee'} - Records {startRecord} to {endRecord} of{' '}
                      {statuses.length}
                    </Text>
                  </View>
                </View>
                <View style={styles.headerDivider} />
              </View>

              {/* Status Table */}
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={styles.colDate}>
                    <Text style={styles.tableHeaderText}>Date</Text>
                  </View>
                  <View style={styles.colLeave}>
                    <Text style={styles.tableHeaderText}>Leave</Text>
                  </View>
                  <View style={styles.colStatus}>
                    <Text style={styles.tableHeaderText}>Key Information</Text>
                  </View>
                  <View style={styles.colDetails}>
                    <Text style={styles.tableHeaderText}>Additional Details</Text>
                  </View>
                </View>
                {pageStatuses.map((status, rowIndex) => renderStatusRow(status, rowIndex))}
              </View>

              {/* Footer */}
              <View style={styles.footer} fixed>
                <View style={styles.footerContent}>
                  <Text style={styles.footerText}>Anddhen Group - Status Management System</Text>
                  <Text
                    style={styles.footerPage}
                    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                  />
                  <Text style={styles.footerText}>Total Records: {stats.totalStatuses}</Text>
                </View>
              </View>
            </Page>
          );
        }

        return pages;
      })()}
    </Document>
  );
};

// PropTypes validation
StatusPDFDocument.propTypes = {
  statuses: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      userStatus: PropTypes.object,
    })
  ).isRequired,
  employeeName: PropTypes.string,
  employeeId: PropTypes.string,
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    leaveFilter: PropTypes.string,
  }),
};

// Default props
StatusPDFDocument.defaultProps = {
  employeeName: 'N/A',
  employeeId: '',
  filters: {},
};

// Export function to generate and download PDF
export const generateStatusPDF = async (statuses, employeeName, employeeId, filters = {}) => {
  try {
    if (!statuses || statuses.length === 0) {
      throw new Error('No status data available to generate PDF');
    }

    const blob = await pdf(
      <StatusPDFDocument
        statuses={statuses}
        employeeName={employeeName}
        employeeId={employeeId}
        filters={filters}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `Status_Report_${employeeName || 'Employee'}_${new Date().toISOString().split('T')[0]}.pdf`;
    link.download = fileName.replace(/[^a-z0-9]/gi, '_');
    link.click();
    URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return { success: false, error: error.message };
  }
};

export default StatusPDFDocument;
