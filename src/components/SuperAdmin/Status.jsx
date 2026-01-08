import React, { useState, useEffect } from 'react';
import { StatusCalendar } from '../templates/StatusCalender';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';
import { useStatusCalendar } from 'src/react-query/useStatusCalender';
import useAuthStore from 'src/services/store/globalStore';
import PropTypes from 'prop-types';
import { generateStatusPDF } from './StatusPDFGenerator';

import { useMemo } from 'react';

// Add spinner animation and responsive styles
if (typeof document !== 'undefined' && !document.getElementById('status-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'status-spinner-style';
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 1024px) {
      .calendar-stats-row,
      .status-views-row {
        grid-template-columns: 1fr !important;
      }
    }
    @media (max-width: 768px) {
      .calendar-stats-row,
      .status-views-row {
        gap: 16px !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// Subsidiary Management Component
const SubsidiaryManagement = () => {
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubsidiary, setEditingSubsidiary] = useState(null);
  const [formData, setFormData] = useState({
    subsidiaryName: '',
    subName: '',
    parttimer_multi_status: false,
    active: true,
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchSubsidiaries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/subsidiaries/`);
      if (!response.ok) {
        throw new Error('Failed to fetch subsidiaries');
      }
      const data = await response.json();
      setSubsidiaries(data);
    } catch (error) {
      console.error('Error fetching subsidiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubsidiaries();
  }, []);

  const handleSubmit = async () => {
    try {
      const url = editingSubsidiary
        ? `${API_BASE_URL}/subsidiaries/update/${editingSubsidiary.id}/`
        : `${API_BASE_URL}/subsidiaries/add/`;

      const method = editingSubsidiary ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save subsidiary');
      }

      setOpenDialog(false);
      setEditingSubsidiary(null);
      setFormData({
        subsidiaryName: '',
        subName: '',
        parttimer_multi_status: false,
        active: true,
      });
      fetchSubsidiaries();
    } catch (error) {
      console.error('Error saving subsidiary:', error);
    }
  };

  const handleDelete = async id => {
    try {
      const response = await fetch(`${API_BASE_URL}/subsidiaries/delete/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete subsidiary');
      }
      fetchSubsidiaries();
    } catch (error) {
      console.error('Error deleting subsidiary:', error);
    }
  };

  const handleEdit = subsidiary => {
    setEditingSubsidiary(subsidiary);
    setFormData({
      subsidiaryName: subsidiary.subsidiaryName,
      subName: subsidiary.subName,
      parttimer_multi_status: subsidiary.parttimer_multi_status,
      active: subsidiary.active,
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingSubsidiary(null);
    setFormData({
      subsidiaryName: '',
      subName: '',
      parttimer_multi_status: false,
      active: true,
    });
    setOpenDialog(true);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0,
              letterSpacing: '-0.5px',
            }}
          >
            Subsidiary Management
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
            Manage and configure subsidiary settings
          </p>
        </div>
        <button
          onClick={handleAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.35)';
            e.currentTarget.style.background = '#2563eb';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.25)';
            e.currentTarget.style.background = '#3b82f6';
          }}
        >
          <i className="bi bi-plus-circle"></i>
          <span className="d-none d-sm-inline">Add Subsidiary</span>
          <span className="d-sm-none">Add</span>
        </button>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 16px',
              border: '4px solid #e2e8f0',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          ></div>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Loading subsidiaries...</p>
        </div>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
              }}
            >
              <thead
                style={{
                  background: '#f8fafc',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '3px solid #e2e8f0',
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '3px solid #e2e8f0',
                    }}
                  >
                    Subsidiary Name
                  </th>
                  <th
                    className="d-none d-md-table-cell"
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '3px solid #e2e8f0',
                    }}
                  >
                    Sub Name
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '3px solid #e2e8f0',
                    }}
                  >
                    Multi Status
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'left',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '3px solid #e2e8f0',
                    }}
                  >
                    Active
                  </th>
                  <th
                    style={{
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderBottom: '3px solid #e2e8f0',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subsidiaries.map((subsidiary, index) => (
                  <tr
                    key={subsidiary.id}
                    style={{
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '';
                    }}
                  >
                    <td
                      style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: '#1e293b',
                      }}
                    >
                      {subsidiary.id}
                    </td>
                    <td
                      style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: '#1e293b',
                      }}
                    >
                      {subsidiary.subsidiaryName}
                    </td>
                    <td
                      className="d-none d-md-table-cell"
                      style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: '#1e293b',
                      }}
                    >
                      {subsidiary.subName}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: subsidiary.parttimer_multi_status ? '#d1fae5' : '#f1f5f9',
                          color: subsidiary.parttimer_multi_status ? '#065f46' : '#475569',
                          border: `1px solid ${subsidiary.parttimer_multi_status ? '#6ee7b7' : '#e2e8f0'}`,
                        }}
                      >
                        {subsidiary.parttimer_multi_status ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: subsidiary.active ? '#d1fae5' : '#fee2e2',
                          color: subsidiary.active ? '#065f46' : '#991b1b',
                          border: `1px solid ${subsidiary.active ? '#6ee7b7' : '#fca5a5'}`,
                        }}
                      >
                        {subsidiary.active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          justifyContent: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          onClick={() => handleEdit(subsidiary)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            border: '1px solid #93c5fd',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#bfdbfe';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#dbeafe';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                          <span className="d-none d-sm-inline">Edit</span>
                          <span className="d-sm-none">E</span>
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: subsidiary.id })}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fca5a5',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#fecaca';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#fee2e2';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <i className="bi bi-trash"></i>
                          <span className="d-none d-sm-inline">Delete</span>
                          <span className="d-sm-none">D</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {openDialog && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1040,
            }}
          ></div>
          <div
            className="modal fade show"
            style={{
              display: 'block',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
            }}
            tabIndex="-1"
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ margin: 'auto', maxWidth: '500px', width: '90%' }}
            >
              <div
                className="modal-content border-0 shadow-lg"
                style={{ borderRadius: '16px', overflow: 'hidden', background: 'white' }}
              >
                <div
                  className="modal-header border-0"
                  style={{
                    background: '#f8fafc',
                    padding: '24px 28px',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  <h5
                    className="modal-title fw-bold mb-0"
                    style={{ fontSize: '20px', color: '#1e293b' }}
                  >
                    <i
                      className={`bi ${editingSubsidiary ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}
                      style={{ color: '#3b82f6' }}
                    ></i>
                    {editingSubsidiary ? 'Edit Subsidiary' : 'Add New Subsidiary'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setOpenDialog(false)}
                    style={{ opacity: 0.5 }}
                  ></button>
                </div>
                <div className="modal-body" style={{ padding: '24px 28px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      className="form-label fw-semibold mb-2"
                      style={{
                        fontSize: '13px',
                        color: '#475569',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Subsidiary Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.subsidiaryName}
                      onChange={e => setFormData({ ...formData, subsidiaryName: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#1e293b',
                        transition: 'all 0.2s ease',
                        background: 'white',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      className="form-label fw-semibold mb-2"
                      style={{
                        fontSize: '13px',
                        color: '#475569',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Sub Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.subName}
                      onChange={e => setFormData({ ...formData, subName: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#1e293b',
                        transition: 'all 0.2s ease',
                        background: 'white',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={formData.parttimer_multi_status}
                        onChange={e =>
                          setFormData({ ...formData, parttimer_multi_status: e.target.checked })
                        }
                        style={{ width: '3rem', height: '1.5rem', cursor: 'pointer' }}
                      />
                      <label
                        className="form-check-label fw-semibold ms-2"
                        style={{ fontSize: '0.875rem', color: '#495057' }}
                      >
                        Part Timer Multi Status
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={formData.active}
                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                        style={{ width: '3rem', height: '1.5rem', cursor: 'pointer' }}
                      />
                      <label
                        className="form-check-label fw-semibold ms-2"
                        style={{ fontSize: '0.875rem', color: '#495057' }}
                      >
                        Active
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  className="modal-footer border-0"
                  style={{
                    padding: '20px 28px',
                    background: '#f8fafc',
                    borderTop: '2px solid #e2e8f0',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDialog(false)}
                    style={{
                      padding: '10px 20px',
                      background: 'white',
                      color: '#64748b',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                      padding: '10px 20px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.35)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.25)';
                    }}
                  >
                    {editingSubsidiary ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1040,
            }}
          ></div>
          <div
            className="modal fade show"
            style={{
              display: 'block',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
            }}
            tabIndex="-1"
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ margin: 'auto', maxWidth: '500px', width: '90%' }}
            >
              <div
                className="modal-content border-0 shadow-lg"
                style={{ borderRadius: '16px', overflow: 'hidden', background: 'white' }}
              >
                <div
                  className="modal-header border-0"
                  style={{
                    background: '#f8fafc',
                    padding: '24px 28px',
                    borderBottom: '2px solid #e2e8f0',
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle p-2 me-3"
                      style={{
                        background: '#fee2e2',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <i
                        className="bi bi-exclamation-triangle-fill"
                        style={{ fontSize: '1.25rem', color: '#ef4444' }}
                      ></i>
                    </div>
                    <h5
                      className="modal-title fw-bold mb-0"
                      style={{ fontSize: '20px', color: '#1e293b' }}
                    >
                      Confirm Delete
                    </h5>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeleteModal({ open: false, id: null })}
                    style={{ opacity: 0.5 }}
                  ></button>
                </div>
                <div className="modal-body" style={{ padding: '24px 28px', textAlign: 'center' }}>
                  <p className="mb-0" style={{ fontSize: '14px', color: '#64748b' }}>
                    Are you sure you want to delete this subsidiary? This action cannot be undone.
                  </p>
                </div>
                <div
                  className="modal-footer border-0"
                  style={{
                    padding: '20px 28px',
                    background: '#f8fafc',
                    borderTop: '2px solid #e2e8f0',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setDeleteModal({ open: false, id: null })}
                    style={{
                      padding: '10px 20px',
                      background: 'white',
                      color: '#64748b',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await handleDelete(deleteModal.id);
                      setDeleteModal({ open: false, id: null });
                    }}
                    style={{
                      padding: '10px 20px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#dc2626';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.35)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#ef4444';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.25)';
                    }}
                  >
                    <i className="bi bi-trash me-2"></i>Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Employee Status Component with Calendar, Monthly Stats, and Loading States
const EmployeeStatus = () => {
  const queryClient = useQueryClient();
  const [employees, setEmployees] = useState([]);
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [formattedData, setFormattedData] = useState([]);
  const [singleStatus, setSingleStatus] = useState([]);
  const [allStatuses, setAllStatuses] = useState({});
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Calendar state management
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter states
  const [leaveFilter, setLeaveFilter] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [filteredStatuses, setFilteredStatuses] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const selectedAcsStatusDate = useAuthStore(state => state.selectedAcsStatusDate);

  // Fetch data with loading states
  const { data: calendarData, isLoading: isLoadingCalendarData } = useStatusCalendar(empId);

  // Filter calendar data based on subsidiary permissions
  const data = useMemo(() => {
    if (!calendarData?.status_updates) return calendarData;

    const currentRole = localStorage.getItem('roles');
    const userRoles = currentRole?.split(',').map(role => role.trim()) || [];
    const hasSubsidiaryRoles = userRoles.some(role => role.startsWith('status_subsidiary_'));

    // If user is superadmin or has no subsidiary restrictions, show all data
    if (userRoles.includes('superadmin') || !hasSubsidiaryRoles) {
      return calendarData;
    }

    // Get user's allowed subsidiaries
    const userSubsidiaries = userRoles
      .filter(role => role.startsWith('status_subsidiary_'))
      .map(role => role.replace('status_subsidiary_', '').toUpperCase());

    // Filter status updates based on subsidiary access
    return {
      ...calendarData,
      status_updates: calendarData.status_updates.filter(item => {
        const subsidiary = item.subsidiary || item.subsidary;
        return subsidiary && userSubsidiaries.includes(subsidiary.toUpperCase());
      }),
    };
  }, [calendarData]);
  const {
    data: employeeData = [],
    isLoading: isLoadingEmployees,
    error: employeeError,
  } = useFetchData('status', '/get_status_ids');

  // Log any API errors
  useEffect(() => {
    if (employeeError) {
      console.error('Error fetching employee data:', employeeError);
      setError(employeeError);
    }
  }, [employeeError]);
  const { mutate: getAllStatus } = useAddData('status', '/get_status_update');

  // Handle calendar date changes and update global store
  useEffect(() => {
    useAuthStore.setState({ selectedAcsStatusDate: calendarSelectedDate });
  }, [calendarSelectedDate]);

  useEffect(() => {
    if (data?.status_updates) {
      const inputDate = new Date(selectedAcsStatusDate);
      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);

      // Get user roles
      const currentRole = localStorage.getItem('roles');
      const userRoles = currentRole?.split(',').map(role => role.trim()) || [];
      const hasSubsidiaryRoles = userRoles.some(role => role.startsWith('status_subsidiary_'));

      // Get user's allowed subsidiaries
      const userSubsidiaries = userRoles
        .filter(role => role.startsWith('status_subsidiary_'))
        .map(role => role.replace('status_subsidiary_', '').toUpperCase());

      // Filter statuses for the selected date
      const dateStatuses = data?.status_updates?.filter(item => item.date === formattedDate) || [];

      // Apply subsidiary access filtering
      const filteredStatuses = dateStatuses.filter(item => {
        // If user is superadmin, show all
        if (userRoles.includes('superadmin')) {
          return true;
        }

        // If user has only status role without subsidiary roles, show all
        if (userRoles.includes('status') && !hasSubsidiaryRoles) {
          return true;
        }

        // Get subsidiary from status
        const subsidiary = item.subsidiary || item.subsidary || '';

        // If user has subsidiary roles, only show matching subsidiaries
        if (hasSubsidiaryRoles) {
          // If no subsidiary specified and user has subsidiary roles, don't show
          if (!subsidiary) {
            return false;
          }
          return userSubsidiaries.includes(subsidiary.toUpperCase());
        }

        return false;
      });

      setSingleStatus(filteredStatuses);
    }
  }, [selectedAcsStatusDate, data]);

  const formattedCallenderData = data?.status_updates
    ? data?.status_updates?.map(item => [item.date, item.leave])
    : [];

  useEffect(() => {
    // If still loading, don't process
    if (isLoadingEmployees) return;

    // Handle empty or invalid data
    if (!employeeData || !Array.isArray(employeeData)) {
      console.warn('Invalid or empty employee data:', employeeData);
      setEmployees([]);
      return;
    }

    // Get user roles
    const currentRole = localStorage.getItem('roles');
    const userRoles = currentRole?.split(',').map(role => role.trim()) || [];

    // Check subsidiary access
    const hasSubsidiaryRoles = userRoles.some(role => role.startsWith('status_subsidiary_'));

    // If superadmin or no subsidiary restrictions, show all
    if (userRoles.includes('superadmin') || !hasSubsidiaryRoles) {
      setEmployees(employeeData);
      return;
    }

    // Get allowed subsidiaries
    const userSubsidiaries = userRoles
      .filter(role => role.startsWith('status_subsidiary_'))
      .map(role => role.replace('status_subsidiary_', '').toUpperCase());
    console.log('Allowed subsidiaries:', userSubsidiaries);

    setEmployees(employeeData);
  }, [employeeData]);

  // Function to filter status updates based on subsidiary access
  const filterStatusByAccess = statusData => {
    const currentRole = localStorage.getItem('roles');
    const userRoles = currentRole?.split(',').map(role => role.trim()) || [];

    // If user is superadmin, show all
    if (userRoles.includes('superadmin')) {
      return statusData;
    }

    // Check if user has any subsidiary-specific access
    const hasSubsidiaryRoles = userRoles.some(role => role.startsWith('status_subsidiary_'));

    // If user has status role but no subsidiary roles, show all
    if (userRoles.includes('status') && !hasSubsidiaryRoles) {
      return statusData;
    }

    // Get the subsidiaries user has access to
    const userSubsidiaries = userRoles
      .filter(role => role.startsWith('status_subsidiary_'))
      .map(role => role.replace('status_subsidiary_', '').toUpperCase());

    return statusData.filter(item => {
      // Extract subsidiary from status data
      const subsidiary =
        item.subsidiary ||
        item.userStatus?.subsidiary ||
        item.subsidary ||
        item.userStatus?.subsidary; // Handle both spellings

      // If no subsidiary info and user has any subsidiary access, deny
      if (!subsidiary && userSubsidiaries.length > 0) {
        return false;
      }

      return userSubsidiaries.includes(subsidiary?.toUpperCase());
    });
  };

  useEffect(() => {
    if (empId) {
      setIsLoadingStatuses(true);
      setError(null);
      getAllStatus(
        { user_id: empId },
        {
          onSuccess: response => {
            // Filter response based on user's subsidiary access
            const filteredResponse = filterStatusByAccess(response);

            const newStatuses = filteredResponse.reduce((acc, item) => {
              const { user_id, date, ...userStatus } = item;
              if (!acc[user_id]) {
                acc[user_id] = [];
              }
              acc[user_id].push({ date, userStatus });
              return acc;
            }, {});

            setAllStatuses(newStatuses);
            queryClient.invalidateQueries('status');
            setIsLoadingStatuses(false);
          },
          onError: error => {
            console.error('Error fetching statuses:', error);
            setAllStatuses({});
            setIsLoadingStatuses(false);
          },
        }
      );
    }
  }, [empId, getAllStatus, queryClient]);
  useEffect(() => {
    if (empId && allStatuses[empId]) {
      const sortedStatuses = [...allStatuses[empId]].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setFormattedData(sortedStatuses);
    }
  }, [allStatuses, empId]);

  // Apply filters to statuses
  useEffect(() => {
    if (formattedData.length > 0) {
      let filtered = [...formattedData];

      // Date range filter
      if (startDateFilter) {
        filtered = filtered.filter(status => status.date >= startDateFilter);
      }
      if (endDateFilter) {
        filtered = filtered.filter(status => status.date <= endDateFilter);
      }

      // Leave filter
      if (leaveFilter !== 'all') {
        filtered = filtered.filter(status => {
          const hasLeave = status.userStatus.leave === true || status.userStatus.leave === 'true';
          return leaveFilter === 'with_leave' ? hasLeave : !hasLeave;
        });
      }

      setFilteredStatuses(filtered);
    } else {
      setFilteredStatuses([]);
    }
  }, [formattedData, startDateFilter, endDateFilter, leaveFilter]);

  // Calculate monthly stats
  const calculateMonthStats = (data, month) => {
    const year = month.getFullYear();
    const mon = String(month.getMonth() + 1).padStart(2, '0');

    // Filter entries for the current visible month and remove duplicates
    const monthEntries = data.filter(([date]) => {
      if (!date) return false;
      return date.startsWith(`${year}-${mon}`);
    });

    // Remove duplicate dates (keep the last one if there are duplicates)
    const uniqueEntries = new Map();
    monthEntries.forEach(([date, leave]) => {
      uniqueEntries.set(date, leave);
    });
    const entries = Array.from(uniqueEntries.entries()).map(([date, leave]) => [date, leave]);

    // Helper function to check if leave is true (handles multiple formats)
    const isLeave = leave => {
      // Handle boolean
      if (leave === true) return true;
      if (leave === false) return false;

      // Handle string
      if (typeof leave === 'string') {
        const lowerLeave = leave.toLowerCase().trim();
        if (lowerLeave === 'true' || lowerLeave === '1' || lowerLeave === 'yes') return true;
        if (
          lowerLeave === 'false' ||
          lowerLeave === '0' ||
          lowerLeave === 'no' ||
          lowerLeave === ''
        )
          return false;
      }

      // Handle number
      if (typeof leave === 'number') {
        return leave === 1;
      }

      // Handle null/undefined
      if (leave === null || leave === undefined) return false;

      return false;
    };

    // Count days working (leave is false/null/undefined), leaves (leave is true)
    const daysWorking = entries.filter(([_, leave]) => !isLeave(leave)).length;
    const leaves = entries.filter(([_, leave]) => isLeave(leave)).length;

    // Calculate total days of month up to today if current month; otherwise full month days
    const now = new Date();
    let totalDays = new Date(year, month.getMonth() + 1, 0).getDate();
    if (year === now.getFullYear() && month.getMonth() === now.getMonth()) {
      totalDays = now.getDate();
    }

    // Find days with no status (days in month not in data)
    // Create a set of all dates that have entries
    const filledDates = new Set(entries.map(([date]) => date));

    // Count empty days: days in the month that don't have entries
    let emptyDays = 0;
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${mon}-${String(d).padStart(2, '0')}`;
      if (!filledDates.has(dateStr)) {
        emptyDays++;
      }
    }

    // Ensure the math is correct: daysWorking + leaves + emptyDays should equal totalDays
    // This handles any edge cases where the calculation might be off
    const calculatedTotal = daysWorking + leaves + emptyDays;
    if (calculatedTotal !== totalDays && calculatedTotal > 0) {
      // Recalculate emptyDays to ensure correct total
      emptyDays = Math.max(0, totalDays - daysWorking - leaves);
    }

    return { daysWorking, leaves, emptyDays, totalDays };
  };

  const handleEmployeeChange = event => {
    const selectedEmpId = event.target.value;
    const selectedEmpName = employees?.find(emp => emp.user_id === selectedEmpId)?.user_name;

    // Clear previous data
    setFormattedData([]);
    setAllStatuses({});
    setSingleStatus([]);
    setFilteredStatuses([]);

    // Set new employee
    setEmpId(selectedEmpId);
    setEmpName(selectedEmpName);

    // Reset filters
    setLeaveFilter('all');
    setStartDateFilter('');
    setEndDateFilter('');

    // Reset calendar
    setCalendarSelectedDate(new Date());
    setCurrentMonth(new Date());
  };

  const handleExportPDF = async () => {
    if (!filteredStatuses || filteredStatuses.length === 0) {
      alert('No status data available to export');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const filterData = {
        startDate: startDateFilter,
        endDate: endDateFilter,
        leaveFilter: leaveFilter,
      };

      const result = await generateStatusPDF(filteredStatuses, empName, empId, filterData);

      if (!result.success) {
        alert('Failed to generate PDF. Please try again.');
        console.error('PDF generation error:', result.error);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const monthStats = calculateMonthStats(formattedCallenderData, currentMonth);

  // Loading Component
  const LoadingSpinner = ({ text = 'Loading...' }) => (
    <div className="text-center p-5">
      <div
        className="spinner-border text-primary mb-3"
        role="status"
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 fs-6 text-muted fw-medium">{text}</p>
    </div>
  );

  LoadingSpinner.propTypes = {
    text: PropTypes.string,
  };

  // Stats Loading Component
  const StatsLoadingCards = () => (
    <div className="row g-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="col-6 col-md-3">
          <div
            className="text-center p-3 rounded border-0 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              className="spinner-border spinner-border-sm text-primary mb-2"
              role="status"
              style={{ width: '1.5rem', height: '1.5rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="placeholder-glow">
              <small className="placeholder col-8 bg-secondary rounded"></small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Employee Status Dashboard
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
          Track and manage employee status updates and attendance
        </p>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
          marginBottom: '24px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'end' }}>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label
                className="form-label fw-semibold mb-2"
                style={{
                  fontSize: '13px',
                  color: '#475569',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                <i className="bi bi-person-circle me-2" style={{ color: '#3b82f6' }}></i>Select
                Employee
              </label>
              {isLoadingEmployees ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <select
                    className="form-select"
                    disabled
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: '#f8fafc',
                    }}
                  >
                    <option>Loading employees...</option>
                  </select>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid #e2e8f0',
                      borderTopColor: '#3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  ></div>
                </div>
              ) : (
                <select
                  className="form-select"
                  value={empId}
                  onChange={handleEmployeeChange}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#1e293b',
                    transition: 'all 0.2s ease',
                    background: 'white',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Choose an employee...</option>
                  {Array.isArray(employees) && employees.length > 0 ? (
                    employees.map(employee => (
                      <option key={employee.user_id} value={employee.user_id}>
                        {employee.user_name || 'Unnamed Employee'}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {isLoadingEmployees ? 'Loading employees...' : 'No employees available'}
                    </option>
                  )}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger border-0 shadow-sm d-flex align-items-center"
          role="alert"
          style={{
            borderRadius: '12px',
            padding: '16px 20px',
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            marginBottom: '24px',
          }}
        >
          <i className="bi bi-exclamation-triangle-fill me-3" style={{ fontSize: '1.25rem' }}></i>
          <div>
            <strong>Error:</strong> {error.message || 'An error occurred while fetching data'}
          </div>
        </div>
      )}

      {empId.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div className="mb-4">
            <i className="bi bi-person-circle" style={{ fontSize: '4rem', color: '#cbd5e1' }}></i>
          </div>
          <h4
            style={{
              fontSize: '18px',
              color: '#475569',
              fontWeight: '600',
              marginTop: '16px',
              marginBottom: '8px',
            }}
          >
            Select an Employee
          </h4>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Please choose an employee from the dropdown above to view their status information
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Row: Calendar and Stats Side by Side */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              alignItems: 'stretch',
            }}
            className="calendar-stats-row"
          >
            {/* Calendar Section */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: '24px 28px',
                  background: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                }}
              >
                <h5
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: 0,
                  }}
                >
                  <i className="bi bi-calendar3 me-2" style={{ color: '#3b82f6' }}></i>Status
                  Calendar
                </h5>
              </div>
              <div
                style={{
                  padding: '24px 28px',
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isLoadingCalendarData ? (
                  <LoadingSpinner text="Loading calendar data..." />
                ) : (
                  <div style={{ width: '100%' }}>
                    <StatusCalendar
                      data={formattedCallenderData}
                      empName={empName}
                      selectedDate={calendarSelectedDate}
                      onDateChange={setCalendarSelectedDate}
                      onMonthChange={setCurrentMonth}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Stats Panel */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: '24px 28px',
                  background: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                }}
              >
                <h5
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: 0,
                  }}
                >
                  <i className="bi bi-graph-up me-2" style={{ color: '#3b82f6' }}></i>
                  {currentMonth.toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  Statistics
                </h5>
              </div>
              <div style={{ padding: '24px 28px', flex: 1 }}>
                {isLoadingCalendarData ? (
                  <StatsLoadingCards />
                ) : (
                  <>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        marginBottom: '20px',
                      }}
                    >
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '20px',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#10b981';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#10b981',
                            marginBottom: '8px',
                          }}
                        >
                          {monthStats.daysWorking}
                        </div>
                        <small style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                          Days Working
                        </small>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '20px',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#ef4444';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#ef4444',
                            marginBottom: '8px',
                          }}
                        >
                          {monthStats.leaves}
                        </div>
                        <small style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                          Leaves
                        </small>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '20px',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#f59e0b';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#f59e0b',
                            marginBottom: '8px',
                          }}
                        >
                          {monthStats.emptyDays}
                        </div>
                        <small style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                          Empty Status
                        </small>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '20px',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div
                          style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            color: '#3b82f6',
                            marginBottom: '8px',
                          }}
                        >
                          {monthStats.totalDays}
                        </div>
                        <small style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                          Total Days
                        </small>
                      </div>
                    </div>
                    {empName && (
                      <div
                        style={{
                          marginTop: '20px',
                          paddingTop: '16px',
                          borderTop: '1px solid #e2e8f0',
                        }}
                      >
                        <small
                          style={{
                            fontSize: '13px',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <i className="bi bi-person-fill me-2" style={{ color: '#3b82f6' }}></i>
                          Employee:{' '}
                          <strong style={{ marginLeft: '8px', color: '#1e293b' }}>{empName}</strong>
                        </small>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: Status Views Side by Side */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              alignItems: 'stretch',
            }}
            className="status-views-row"
          >
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
                flex: 1,
              }}
            >
              <div style={{ padding: '24px 28px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <h5
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: 0,
                    }}
                  >
                    <i className="bi bi-info-circle me-2" style={{ color: '#3b82f6' }}></i>Single
                    Status
                  </h5>
                  {selectedDate && (
                    <span
                      style={{
                        padding: '6px 14px',
                        background: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderRadius: '20px',
                        border: '1px solid #93c5fd',
                      }}
                    >
                      {selectedDate}
                    </span>
                  )}
                </div>
                <div className="overflow-auto" style={{ maxHeight: '500px' }}>
                  {isLoadingCalendarData ? (
                    <LoadingSpinner text="Loading status data..." />
                  ) : Array.isArray(data?.status_updates) &&
                    data.status_updates.some(item => item.date === selectedDate) ? (
                    Array.isArray(singleStatus) && singleStatus?.length > 0 ? (
                      singleStatus?.map((status, statusIndex) => {
                        const filteredEntries = Object.entries(status)?.filter(
                          ([key, value]) =>
                            value !== '' &&
                            value !== '0.00' &&
                            value !== 0 &&
                            value !== '0' &&
                            value !== null &&
                            key !== 'id' &&
                            key !== 'user_id' &&
                            key !== 'user_name'
                        );

                        // Remove duplicates based on key
                        const uniqueEntries = filteredEntries?.reduce((acc, [key, value]) => {
                          const existingIndex = acc.findIndex(
                            ([existingKey]) => existingKey === key
                          );
                          if (existingIndex === -1) {
                            acc.push([key, value]);
                          }
                          return acc;
                        }, []);

                        return (
                          <div key={statusIndex}>
                            {uniqueEntries?.map(([key, value], index) => (
                              <div
                                key={index}
                                className="py-3 border-bottom"
                                style={{
                                  transition: 'all 0.2s ease',
                                  borderColor: '#e9ecef',
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                                  e.currentTarget.style.paddingLeft = '1rem';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.backgroundColor = '';
                                  e.currentTarget.style.paddingLeft = '';
                                }}
                              >
                                <div className="d-flex flex-column">
                                  <strong
                                    className="text-capitalize mb-2 fw-semibold"
                                    style={{ fontSize: '0.875rem', color: '#6c757d' }}
                                  >
                                    {key.replace(/_/g, ' ')}:
                                  </strong>
                                  <div
                                    className="text-break"
                                    style={{ fontSize: '0.95rem', color: '#212529' }}
                                  >
                                    {key === 'leave' ? (
                                      <span
                                        className={`badge ${value ? 'bg-warning text-dark' : 'bg-success'}`}
                                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                      >
                                        {value ? 'Yes' : 'No'}
                                      </span>
                                    ) : key === 'ticket_link' || key === 'github_link' ? (
                                      <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary text-decoration-none fw-medium"
                                        style={{
                                          transition: 'all 0.2s ease',
                                          wordBreak: 'break-all',
                                        }}
                                        onMouseEnter={e => {
                                          e.currentTarget.style.textDecoration = 'underline';
                                        }}
                                        onMouseLeave={e => {
                                          e.currentTarget.style.textDecoration = 'none';
                                        }}
                                      >
                                        <i className="bi bi-box-arrow-up-right me-1"></i>
                                        {value}
                                      </a>
                                    ) : (
                                      value
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className="alert alert-warning border-0 shadow-sm d-flex align-items-center"
                        role="alert"
                        style={{ borderRadius: '10px' }}
                      >
                        <i
                          className="bi bi-exclamation-triangle me-3"
                          style={{ fontSize: '1.5rem' }}
                        ></i>
                        <div>
                          You don&apos;t have permission to view this status due to subsidiary
                          restrictions.
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-5">
                      <i
                        className="bi bi-calendar-x"
                        style={{ fontSize: '3rem', color: '#dee2e6' }}
                      ></i>
                      <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.95rem' }}>
                        Select a date to see status
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* All Statuses Section */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
                flex: 1,
              }}
            >
              <div style={{ padding: '24px 28px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <h5
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1e293b',
                      margin: 0,
                    }}
                  >
                    <i className="bi bi-list-ul me-2" style={{ color: '#3b82f6' }}></i>All Statuses
                    of {empName}
                  </h5>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
                  >
                    <span
                      style={{
                        padding: '6px 14px',
                        background: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '13px',
                        fontWeight: '600',
                        borderRadius: '20px',
                        border: '1px solid #93c5fd',
                      }}
                    >
                      {isLoadingStatuses ? (
                        <span
                          style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            border: '2px solid #1e40af',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                            marginRight: '6px',
                          }}
                        ></span>
                      ) : null}
                      {filteredStatuses.length} records
                    </span>
                    <button
                      onClick={handleExportPDF}
                      disabled={
                        isGeneratingPDF || isLoadingStatuses || filteredStatuses.length === 0
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background:
                          isGeneratingPDF || isLoadingStatuses || filteredStatuses.length === 0
                            ? '#cbd5e1'
                            : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor:
                          isGeneratingPDF || isLoadingStatuses || filteredStatuses.length === 0
                            ? 'not-allowed'
                            : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow:
                          isGeneratingPDF || isLoadingStatuses || filteredStatuses.length === 0
                            ? 'none'
                            : '0 2px 8px rgba(59, 130, 246, 0.25)',
                      }}
                      onMouseEnter={e => {
                        if (!isGeneratingPDF && !isLoadingStatuses && filteredStatuses.length > 0) {
                          e.currentTarget.style.background = '#2563eb';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.35)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isGeneratingPDF && !isLoadingStatuses && filteredStatuses.length > 0) {
                          e.currentTarget.style.background = '#3b82f6';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.25)';
                        }
                      }}
                    >
                      {isGeneratingPDF ? (
                        <>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '14px',
                              height: '14px',
                              border: '2px solid white',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              animation: 'spin 0.8s linear infinite',
                            }}
                          ></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{ flexShrink: 0 }}
                          >
                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                          </svg>
                          Export PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Filters - Responsive Layout */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: '13px',
                        color: '#475569',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      <i className="bi bi-calendar-range me-1"></i>Date Range
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="date"
                        value={startDateFilter}
                        onChange={e => setStartDateFilter(e.target.value)}
                        disabled={isLoadingStatuses}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          color: '#1e293b',
                          transition: 'all 0.2s ease',
                          background: isLoadingStatuses ? '#f8fafc' : 'white',
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      <span
                        style={{
                          alignSelf: 'center',
                          fontSize: '13px',
                          color: '#64748b',
                          fontWeight: '500',
                        }}
                      >
                        to
                      </span>
                      <input
                        type="date"
                        value={endDateFilter}
                        onChange={e => setEndDateFilter(e.target.value)}
                        disabled={isLoadingStatuses}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          color: '#1e293b',
                          transition: 'all 0.2s ease',
                          background: isLoadingStatuses ? '#f8fafc' : 'white',
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: '13px',
                        color: '#475569',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      <i className="bi bi-funnel me-1"></i>Leave Status
                    </label>
                    <select
                      value={leaveFilter}
                      onChange={e => setLeaveFilter(e.target.value)}
                      disabled={isLoadingStatuses}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#1e293b',
                        transition: 'all 0.2s ease',
                        background: isLoadingStatuses ? '#f8fafc' : 'white',
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="all">All</option>
                      <option value="with_leave">With Leave</option>
                      <option value="without_leave">Without Leave</option>
                    </select>
                  </div>
                </div>

                <div style={{ overflow: 'auto', maxHeight: '500px' }}>
                  {isLoadingStatuses ? (
                    <LoadingSpinner text="Loading all statuses..." />
                  ) : filteredStatuses?.length > 0 ? (
                    filteredStatuses?.map((status, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'white',
                          marginBottom: '12px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease',
                          padding: '16px',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'start',
                              marginBottom: '12px',
                            }}
                          >
                            <h6
                              style={{
                                fontSize: '15px',
                                fontWeight: '700',
                                color: '#3b82f6',
                                margin: 0,
                              }}
                            >
                              <i className="bi bi-calendar-event me-2"></i>
                              {status.date}
                            </h6>
                            {status.userStatus.leave && (
                              <span
                                style={{
                                  padding: '6px 14px',
                                  background: '#fee2e2',
                                  color: '#991b1b',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  borderRadius: '20px',
                                  border: '1px solid #fca5a5',
                                }}
                              >
                                <i className="bi bi-calendar-x me-1"></i>Leave
                              </span>
                            )}
                          </div>
                          <div className="row g-2">
                            {Object.entries(status.userStatus)
                              .filter(
                                ([key, value]) =>
                                  value !== '' &&
                                  value !== '0.00' &&
                                  value !== 0 &&
                                  value !== '0' &&
                                  value !== null &&
                                  key !== 'id' &&
                                  key !== 'user_id' &&
                                  key !== 'user_name' &&
                                  key !== 'date'
                              )
                              .map(([key, value], idx) => (
                                <div key={idx} className="col-6 col-md-6">
                                  <small
                                    className="text-muted text-capitalize d-block mb-1 fw-semibold"
                                    style={{ fontSize: '0.75rem' }}
                                  >
                                    {key.replace(/_/g, ' ')}:
                                  </small>
                                  <div
                                    className="fw-semibold"
                                    style={{
                                      fontSize: '0.875rem',
                                      color: '#212529',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {key === 'leave' ? (
                                      <span
                                        className={`badge ${value ? 'bg-warning text-dark' : 'bg-success'}`}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                                      >
                                        {value ? 'Yes' : 'No'}
                                      </span>
                                    ) : (
                                      value
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#64748b',
                          marginTop: '16px',
                          marginBottom: '4px',
                          fontWeight: '600',
                        }}
                      >
                        No statuses found with current filters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Status Component with tabs
export const Status = () => {
  const [activeTab, setActiveTab] = useState('employee');

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0,
            letterSpacing: '-0.5px',
          }}
        >
          Status Management
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
          Comprehensive status tracking and subsidiary management system
        </p>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 10px 40px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        <ul
          className="nav nav-tabs flex-column flex-sm-row border-0"
          id="statusTab"
          role="tablist"
          style={{
            background: '#f8fafc',
            borderBottom: '2px solid #e2e8f0',
            margin: 0,
            padding: 0,
            display: 'flex',
            listStyle: 'none',
          }}
        >
          <li style={{ flex: 1 }} role="presentation">
            <button
              className={`nav-link w-100 text-center border-0 ${activeTab === 'employee' ? 'active' : ''}`}
              id="employee-tab"
              type="button"
              role="tab"
              onClick={() => setActiveTab('employee')}
              style={{
                width: '100%',
                padding: '16px 24px',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                color: activeTab === 'employee' ? '#3b82f6' : '#64748b',
                background: activeTab === 'employee' ? 'white' : 'transparent',
                border: 'none',
                borderBottom:
                  activeTab === 'employee' ? '3px solid #3b82f6' : '3px solid transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                if (activeTab !== 'employee') {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== 'employee') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i
                className={`bi bi-person-check me-2`}
                style={{ color: activeTab === 'employee' ? '#3b82f6' : '#64748b' }}
              ></i>
              <span className="d-none d-sm-inline">Employee Status</span>
              <span className="d-sm-none">Employee</span>
            </button>
          </li>
          <li style={{ flex: 1 }} role="presentation">
            <button
              className={`nav-link w-100 text-center border-0 ${activeTab === 'subsidiary' ? 'active' : ''}`}
              id="subsidiary-tab"
              type="button"
              role="tab"
              onClick={() => setActiveTab('subsidiary')}
              style={{
                width: '100%',
                padding: '16px 24px',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                color: activeTab === 'subsidiary' ? '#3b82f6' : '#64748b',
                background: activeTab === 'subsidiary' ? 'white' : 'transparent',
                border: 'none',
                borderBottom:
                  activeTab === 'subsidiary' ? '3px solid #3b82f6' : '3px solid transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                if (activeTab !== 'subsidiary') {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }
              }}
              onMouseLeave={e => {
                if (activeTab !== 'subsidiary') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i
                className={`bi bi-building me-2`}
                style={{ color: activeTab === 'subsidiary' ? '#3b82f6' : '#64748b' }}
              ></i>
              <span className="d-none d-sm-inline">Subsidiary Management</span>
              <span className="d-sm-none">Subsidiary</span>
            </button>
          </li>
        </ul>

        <div className="tab-content p-0" id="statusTabContent">
          <div
            className={`tab-pane fade ${activeTab === 'employee' ? 'show active' : ''}`}
            id="employee"
            role="tabpanel"
            aria-labelledby="employee-tab"
          >
            <div className="p-0">
              <EmployeeStatus />
            </div>
          </div>
          <div
            className={`tab-pane fade ${activeTab === 'subsidiary' ? 'show active' : ''}`}
            id="subsidiary"
            role="tabpanel"
            aria-labelledby="subsidiary-tab"
          >
            <div className="p-0">
              <SubsidiaryManagement />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
