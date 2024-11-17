import React, { useState, useEffect } from 'react';
import ConsultantCard from '../../../organisms/Card/ConsultantCard';
import ConsultantDetailsModal from '../../../organisms/Modal/ConsultantDetailsModal';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useDeleteData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';
import { useUpdateData } from 'src/react-query/useFetchApis';

function ViewConsultants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [consultants, setConsultants] = useState([]);
  const queryClient = useQueryClient();
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [consultantId, setConsultantId] = useState(null);
  const [updatedConsultant, setUpdatedConsultant] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const {
    data = [],
    isLoading, // Provide a default value of an empty array
  } = useFetchData('consultant', `/api/consultants/`);
  useEffect(() => {
    setConsultants(data);
  }, [data]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleFilterChange = (filterKey, value) => {
    setFilters({ ...filters, [filterKey]: value });
  };

  const applyFilters = (consultant) => {
    return Object.keys(filters).every((key) => {
      if (filters[key] === '') return true;
      return consultant[key] === filters[key];
    });
  };

  const handleViewDetails = (consultant) => {
    setSelectedConsultant(consultant);
    setIsModalVisible(true);
  };
  const { mutate: deleteConsultant, isLoading: isDeleting } = useDeleteData(
    'consultant',
    `/consultants/delete/${consultantId}/`,
  );

  const handleDeleteConsultant = (consultantId) => {
    setConsultantId(consultantId);
    deleteConsultant(null, {
      onSuccess: () => {
        queryClient.invalidateQueries('consultant');
      },
      onError: (error) => {
        console.error('An error occurred:', error);
      },
    });
  };

  const handleClose = () => {
    setIsEditable(false);
    setIsModalVisible(false);
  };

  const { mutate: updateConsultant, isLoading: isUpdating } = useUpdateData(
    'colleges',
    `/api/consultants/${updatedConsultant?.id}/`,
  );

  const handleSaveChanges = async (updatedConsultant) => {
    setUpdatedConsultant(updatedConsultant);
    const submitData = new FormData();
    Object.keys(updatedConsultant).forEach((key) => {
      if (key !== 'consulting_resume' && key !== 'original_resume') {
        if (key === 'technologies') {
          // Stringify the array before appending it to FormData
          submitData.append(key, JSON.stringify(updatedConsultant[key]));
        } else {
          // If it's a regular field, append the value
          submitData.append(key, updatedConsultant[key]);
        }
      }
    });
    try {
      await updateConsultant(submitData, {
        onSuccess: () => {
          queryClient.invalidateQueries('consultant');
          setIsModalVisible(false);
          setIsEditable(false);
        },
        onError: (error) => {
          console.error('An error occurred:', error);
        },
      });
    } catch (error) {
      console.error('Update error:', error.message);
    }
  };

  return (
    <div className="container mt-3">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Consultants"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="input-group-append">
          <button
            onClick={toggleFilters}
            className="btn btn-outline-secondary"
            type="button"
          >
            <i className="bi bi-funnel-fill"></i> Filters
          </button>
        </div>
      </div>
      {showFilters && (
        <div className="card card-body mb-3">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Visa Status</label>
              <select
                className="form-select"
                onChange={(e) =>
                  handleFilterChange('visa_status', e.target.value)
                }
              >
                <option value="">All</option>
                <option value="OPT">OPT</option>
                <option value="CPT">CPT</option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Verified Status</label>
              <select
                className="form-select"
                onChange={(e) =>
                  handleFilterChange('full_name_verified', e.target.value)
                }
              >
                <option value="">All</option>
                <option value={true}>Verified</option>
                <option value={false}>Unverified</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Relocation</label>
              <select
                className="form-select"
                onChange={(e) =>
                  handleFilterChange('relocation', e.target.value)
                }
              >
                <option value="">All</option>
                <option value={true}>Willing to Relocate</option>
                <option value={false}>Not Willing to Relocate</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Experience in US</label>
              <input
                type="text"
                className="form-control"
                placeholder="Experience in US"
                onChange={(e) =>
                  handleFilterChange('experience_in_us', e.target.value)
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Current Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="Current Location"
                onChange={(e) =>
                  handleFilterChange('current_location', e.target.value)
                }
              />
            </div>
            {/* Add more filters based on other data fields */}
          </div>
        </div>
      )}
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '200px' }}
        >
          <div className="d-flex align-items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="mb-0 mr-3">Loading Data...</h5>
          </div>
        </div>
      ) : (
        <div className="row">
          {consultants
            .filter(
              (consultant) =>
                consultant.full_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) &&
                applyFilters(consultant),
            )
            .map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                consultant={consultant}
                onViewDetails={handleViewDetails}
                isDeleting={isDeleting}
                onDelete={handleDeleteConsultant}
              />
            ))}
          <ConsultantDetailsModal
            show={isModalVisible}
            onHide={handleClose}
            consultant={selectedConsultant}
            isUpdating={isUpdating}
            isEditable={isEditable}
            setIsEditable={setIsEditable}
            onSave={handleSaveChanges}
          />
        </div>
      )}
    </div>
  );
}

export default ViewConsultants;
