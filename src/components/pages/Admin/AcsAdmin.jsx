import React, { useState, useEffect } from "react";
import { sheetNames } from "../../../dataconfig";
import { StatusCalendar } from "../../templates/StatusCalender";
import { logout } from "../../../services/Authentication/Logout";

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
      emp.push("All");
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

  useEffect(() => {
    fetch("http://35.172.219.206:8000/person/2/")
      .then((res) => {
        if (res.ok) {
          return res.json(); // This returns a promise that resolves with the parsed JSON
        }
        throw new Error("Network response was not ok.");
      })
      .catch((e) => console.log("Error fetching data:", e));
  }, []);

  useEffect(() => {
    fetch("https://server.anddhengroup.com/person/2/")
      .then((res) => {
        if (res.ok) {
          return res.json(); // This returns a promise that resolves with the parsed JSON
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        console.log("Data:", data); // This logs the actual JSON data
      })
      .catch((e) => console.log("Error fetching data:", e));
  }, []);

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

    if (empName && empName !== "All") {
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
  const toggleCalendar = () => {
    if (
      sheetName !== "Part Timers Registrations" &&
      sheetName !== "Student Registration"
    ) {
      setShowCalendar(!showCalendar);
    }
  };
  const handleLogout = () => {
    logout()
      .then(() => {
        console.log("logout success");
      })
      .catch((error) => {
        console.log("logout fail");
      });
  };
  return (
    <div className="">
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "90vh" }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      ) : (
        <>
          <div className="container p-3">
            <div className="row justify-content-between align-items-center gap-2">
              {/* Dropdowns to the left */}
              <div className="col col-12 col-md-3 d-flex justify-content-center gap-2">
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
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      disabled={!data.length}
                    >
                      {empName ? empName : "Name"}
                    </button>
                    {data.length ? (
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
                    ) : null}
                  </div>
                )}
              </div>

              {/* Search and toggle to the right */}
              <div className="col col-12 col-md-8">
                <div className="row align-items-center">
                  <div className="col">
                    <input
                      type="text"
                      className="col-3 form-control me-2 rounded-pill"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {empName && empName != "All" ? (
                    <div className="col-md-auto form-check form-switch gap-2 d-flex justify-content-end">
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
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {showCalendar && empName && (
            <StatusCalendar data={getFilteredData()} empName={empName} />
          )}
          <div className="table-responsive p-1">
            <table className="table table-striped border border-secondary border-2 rounded-1">
              <thead>
                <tr className="table-dark">
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
                {data.length ? (
                  <>
                    {getFilteredData().map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            {(sheetName === "Manager Status" ||
                              sheetName === "Part Timer Status" ||
                              sheetName === "Intern Status") &&
                            cellIndex == 0
                              ? new Date(cell).toLocaleDateString()
                              : cell}
                          </td>
                        ))}
                        <td>
                          <a href="#edit">edit</a>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr className="text-center">
                    <td colSpan={headers.length + 1}>
                      <div className="p-3">
                        <h4>No data to display</h4>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
