import React, { useMemo, useState } from 'react';
import { adminPlates } from '../../dataconfig';
import AssignCards from '../pages/Admin/AssignCards';
import { useRole } from 'src/services/roles/RoleContext';
import { ROLE_LABELS } from 'src/services/roles/roles';
import '../pages/Admin/Dashboard.css';

const SuperAdmin = () => {
  const [search, setSearch] = useState('');
  const { role } = useRole();

  const filteredPlates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return adminPlates;
    return adminPlates.filter(
      plate =>
        plate.child.toLowerCase().includes(query) ||
        plate.route.toLowerCase().includes(query) ||
        (plate.desc || '').toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="dash-wrap container-fluid px-3 px-md-5">
      <div className="dash-header d-flex flex-wrap justify-content-between align-items-end gap-3">
        <div>
          <h1 className="dash-title h3">Admin Dashboard</h1>
          <p className="dash-subtitle">
            Signed in as <span className="fw-semibold">{ROLE_LABELS[role] || role}</span> ·{' '}
            {filteredPlates.length} section{filteredPlates.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="dash-search w-100" style={{ maxWidth: 420 }}>
          <i className="bi bi-search"></i>
          <input
            type="search"
            className="form-control"
            placeholder="Search sections…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <AssignCards adminPlates={filteredPlates} />
    </div>
  );
};

export default SuperAdmin;
