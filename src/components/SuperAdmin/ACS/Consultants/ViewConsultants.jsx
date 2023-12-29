import React, { useState, useEffect } from "react";
import ConsultantCard from "../../../organisms/Card/ConsultantCard";
import ConsultantDetailsModal from "../../../organisms/Modal/ConsultantDetailsModal";

function ViewConsultants() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = () => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/consultants/`)
      .then((response) => response.json())
      .then((data) => {
        setConsultants(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      });
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleFilterChange = (filterKey, value) => {
    setFilters({ ...filters, [filterKey]: value });
  };

  const applyFilters = (consultant) => {
    return Object.keys(filters).every((key) => {
      if (filters[key] === "") return true;
      return consultant[key] === filters[key];
    });
  };

  const handleViewDetails = (consultant) => {
    setSelectedConsultant(consultant);
    setIsModalVisible(true);
  };
  const handleDeleteConsultant = (consultantId) => {
    fetch(`${API_BASE_URL}/consultants/delete/${consultantId}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Consultant deleted successfully");
          fetchConsultants();
        } else {
          console.error("Failed to delete consultant");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSaveChanges = (updatedConsultant) => {
    fetch(`${API_BASE_URL}/api/consultants/${updatedConsultant.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConsultant),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsModalVisible(false);
        fetchConsultants();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
                  handleFilterChange("visa_status", e.target.value)
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
                  handleFilterChange("full_name_verified", e.target.value)
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
                  handleFilterChange("relocation", e.target.value)
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
                  handleFilterChange("experience_in_us", e.target.value)
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
                  handleFilterChange("current_location", e.target.value)
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
          style={{ minHeight: "200px" }}
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
                applyFilters(consultant)
            )
            .map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                consultant={consultant}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteConsultant}
              />
            ))}
          <ConsultantDetailsModal
            show={isModalVisible}
            onHide={() => setIsModalVisible(false)}
            consultant={selectedConsultant}
            onSave={handleSaveChanges}
          />
        </div>
      )}
    </div>
  );
}

export default ViewConsultants;
