// DynamicTable.js
import React from "react";

const BasicTable = ({ data, onEdit }) => {
  if (!data.length) return null;

  const headers = Object.keys(data[0]);

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>
              {header.charAt(0).toUpperCase() + header.slice(1)}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={`${header}-${index}`}>
                {header === "originalResume" ? (
                  <a
                    href={item[header]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                ) : (
                  item[header]
                )}
              </td>
            ))}
            <td>
              <button
                onClick={() => onEdit(item)}
                className="btn btn-secondary"
              >
                Edit
              </button>
              {/* Include other actions as needed */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BasicTable;
