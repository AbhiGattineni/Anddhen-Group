import React, { useState } from 'react';
import { adminPlates } from '../../dataconfig';
import AssignCards from '../pages/Admin/AssignCards';

const SuperAdmin = () => {
  const [search, setSearch] = useState('');
  const [filteredPlates, setFilteredPlates] = useState(adminPlates);

  const handleSearch = e => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredPlates(
      adminPlates.filter(
        plate =>
          plate.child.toLowerCase().includes(query) || plate.route.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="">
      <div className="input-group px-5 mt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search cards..."
          value={search}
          onChange={handleSearch}
        />
      </div>
      <AssignCards adminPlates={filteredPlates} />
    </div>
  );
};

export default SuperAdmin;
