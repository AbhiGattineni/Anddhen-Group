import React from 'react';
import PropTypes from 'prop-types';

const SearchableTable = ({ data, searchTerm, setSearchTerm, renderRow }) => {
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="table-responsive">
      <input
        type="text"
        className="form-control w-25 mb-3"
        placeholder="Search roles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map(renderRow)
          ) : (
            <tr>
              <td colSpan="2">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

SearchableTable.propTypes = {
  data: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  renderRow: PropTypes.func.isRequired,
};

export default SearchableTable;
