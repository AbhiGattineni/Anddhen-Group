import React, { useState, useEffect } from 'react';
import { sheetNames } from '../../../dataconfig';

export const AcsAdmin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sheetName, setSheetName] = useState(sheetNames[0]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [empDetails, setEmpDetails] = useState([]);
    const [empName,setEmpName] = useState(null);

    function handleTab(details) {
        if (sheetName === "Manager Status" || sheetName === "Part Timer Status" || sheetName === "Intern Status") {
            let emp = [];
            for (let i = 1; i < details.length; i++) {
                emp.push(details[i][1]);
            }
            let sorted = [...new Set(emp)];
            setEmpDetails(sorted)
            setShowDropdown(true);
        }
        else {
            setEmpDetails([]);
            setShowDropdown(false);
        }
    }
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZ-hHTGjg8RWzqAcYk5nBXIdfQxLqYY78mcJotWU5XAMnQ_uBZyhZ3QVeQYJZ33VE4HQ/exec";

    useEffect(() => {
        setLoading(true);
        fetch(`${GOOGLE_SCRIPT_URL}?sheetName=${encodeURIComponent(sheetName)}`)
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    setData(result.data);
                } else {
                    setError(result.message);
                }
                handleTab(result.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [sheetName]);

    return (
        <div className="">
            {loading ?
                <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                <>
                    <div className="d-flex gap-3 p-3">
                        <div className="dropdown-center">
                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {sheetName}
                            </button>
                            <ul className="dropdown-menu">
                                {sheetNames.map((tab, index) => (
                                    <li key={index}>
                                        <button
                                            className={`dropdown-item ${showDropdown ? "hovered" : ""}`}
                                            onClick={() => setSheetName(tab)}
                                        >
                                            {tab}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {showDropdown ?
                            <div className="dropdown-center">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Name
                                </button>
                                <ul className="dropdown-menu">
                                    {empDetails.map((detail, index) => (
                                        <li key={index}>
                                            <button
                                                className={`dropdown-item ${showDropdown ? "hovered" : ""}`}
                                                onClick={() => setEmpName(detail)}
                                            >
                                                {detail}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            : null}
                    </div>
                    <div className='table-responsive'>
                        <table className="table table-striped">
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                        ))}
                                        <td><a href="">edit</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div>
    );
}
