import React, { useState, useEffect } from "react";
import { sheetNames } from "../../../dataconfig";
import { StatusCalendar } from "../../templates/StatusCalender";

export const AcsAdmin = () => {
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sheetName, setSheetName] = useState(sheetNames[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [empDetails, setEmpDetails] = useState([]);
  const [empName, setEmpName] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);

  function handleTab(details) {
    if (
      sheetName === "Manager Status" ||
      sheetName === "Part Timer Status" ||
      sheetName === "Intern Status"
    ) {
      let emp = [];
      for (let i = 1; i < details.length; i++) {
        emp.push(details[i][1]); // Assuming that the name is in the second column
      }
      let sorted = [...new Set(emp)];
      setEmpDetails(sorted);
      setShowDropdown(true);
      setEmpName(null); // Reset the empName when changing tabs
    } else {
      setEmpDetails([]);
      setShowDropdown(false);
      setEmpName(null); // Also reset the empName here
    }
  }
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxZ-hHTGjg8RWzqAcYk5nBXIdfQxLqYY78mcJotWU5XAMnQ_uBZyhZ3QVeQYJZ33VE4HQ/exec";

  useEffect(() => {
    setLoading(true);
    fetch(`${GOOGLE_SCRIPT_URL}?sheetName=${encodeURIComponent(sheetName)}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          // Separate the headers from the data
          setHeaders(result.data[0]);
          setData(result.data.slice(1));
        } else {
          setError(result.message);
        }
        handleTab(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sheetName]);

  const sortData = (sortKey) => {
    setSortConfig((currentSortConfig) => {
      if (
        currentSortConfig.key === sortKey &&
        currentSortConfig.direction === "ascending"
      ) {
        return { key: sortKey, direction: "descending" };
      }
      return { key: sortKey, direction: "ascending" };
    });
  };

  useEffect(() => {
    if (sortConfig.key !== null) {
      setData((data) =>
        [...data].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        })
      );
    }
  }, [sortConfig]);

  const getFilteredData = () => {
    let filteredData = data;

    if (empName) {
      filteredData = filteredData.filter((row) => row.includes(empName));
    }

    if (searchTerm) {
      filteredData = filteredData.filter((row) =>
        row.some((cell) =>
          cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filteredData;
  };
  const toggleCalendar = () => setShowCalendar(!showCalendar);

  return (
    <div className="">
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "90vh" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="container p-3">
            <div className="row justify-content-between align-items-center">
              {/* Dropdowns to the left */}
              <div className="col-lg-auto mb-2 mb-lg-0">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {sheetName}
                  </button>
                  <ul className="dropdown-menu">
                    {sheetNames.map((tab, index) => (
                      <li key={index}>
                        <button
                          className="dropdown-item"
                          onClick={() => setSheetName(tab)}
                        >
                          {tab}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {showDropdown && (
                  <div className="dropdown mt-2">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Name
                    </button>
                    <ul className="dropdown-menu">
                      {empDetails.map((detail, index) => (
                        <li key={index}>
                          <button
                            className="dropdown-item"
                            onClick={() => setEmpName(detail)}
                          >
                            {detail}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Search and toggle to the right */}
              <div className="col-lg-auto">
                <div className="d-lg-flex justify-content-end align-items-center">
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="calendarToggle"
                      checked={showCalendar}
                      onChange={toggleCalendar}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="calendarToggle"
                    >
                      Calendar View
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showCalendar && empName && (
            <StatusCalendar data={getFilteredData()} empName={empName} />
          )}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} onClick={() => sortData(index)}>
                      {header}
                      {sortConfig.key === index
                        ? sortConfig.direction === "ascending"
                          ? " 🔼"
                          : " 🔽"
                        : null}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredData().map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                    <td>
                      <a href="#edit">edit</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
