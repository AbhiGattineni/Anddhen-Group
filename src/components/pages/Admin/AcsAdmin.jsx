import React, { useState, useEffect } from 'react';

export const AcsAdmin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sheetName = 'Part Timers Registrations';

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZ-hHTGjg8RWzqAcYk5nBXIdfQxLqYY78mcJotWU5XAMnQ_uBZyhZ3QVeQYJZ33VE4HQ/exec";

    useEffect(() => {
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
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Data from Sheet: {sheetName}</h2>
            <table border="1">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </table>
        </div>
    );
}
