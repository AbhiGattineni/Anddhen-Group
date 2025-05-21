import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from 'src/components/atoms/LoadingSpinner/LoadingSpinner';

export const AdminPortal = () => {
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const spreadsheetId = process.env.REACT_APP_SPREAD_SHEET_ID;
  const name = 'Manager Status';

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${name}?key=${API_KEY}`
        );
        setData(response.data.values);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="main-heading">AdminPortal</h1>
      <div className="row">
        {data.map(row => (
          <p key={row[0]}>
            {row[0]}: {row[1]}
          </p>
        ))}
      </div>
    </div>
  );
};
