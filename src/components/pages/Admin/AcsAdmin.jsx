import React, { useState, useEffect } from 'react';
import { sheetNames } from '../../../dataconfig';

export const AcsAdmin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sheetName, setSheetName] = useState(sheetNames[0]);

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
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [sheetName]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="">
            <ul className="nav nav-pills nav-justified p-3">
                {sheetNames.map((tab, index) => (
                    <li key={index} className="nav-item">
                        <button className={`nav-link ${sheetName == tab ? "active" : null}`} onClick={() => setSheetName(tab)}>{tab}</button>
                    </li>
                ))}
            </ul>
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
        </div>
    );
}
