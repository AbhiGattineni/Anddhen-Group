import React, { useState } from 'react';
import SearchableTable from 'src/components/atoms/Table/SearchableTable';
import useAssignRoleToUser from 'src/react-query/useAssignRoleToUser';
import useUserAndRoleOverview from 'src/react-query/useUserAndRoleOverview';
import { useQueryClient, useMutation } from 'react-query';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AssignRole = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState('');
  const [userError, setUserError] = useState(false);
  const [role, setRole] = useState('');
  const [roleError, setRoleError] = useState(false);

  const { data, isLoading, error } = useUserAndRoleOverview();
  const assignRoleMutation = useAssignRoleToUser();

  const queryClient = useQueryClient();
  const deleteRole = useMutation(
    (roleId) =>
      fetch(`${API_BASE_URL}/deleteRole/${roleId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userDataAndRoles']);
      },
    }
  );

  const handleAssign = (event) => {
    event.preventDefault();

    if (!user) {
      setUserError(true);
    } else {
      setUserError(false);
    }

    if (!role) {
      setRoleError(true);
    } else {
      setRoleError(false);
    }

    if (user && role) {
      assignRoleMutation.mutate({ user, role });
    }
  };

  if (isLoading) return 'Loading...';
  if (error) return 'An error has occurred: ' + error.message;

  const renderRow = (role, index) => (
    <tr key={index}>
      <td>{role.name}</td>
      <td>{role.role_name}</td>
      <td>
        <button
          className="btn btn-danger"
          onClick={() => deleteRole.mutate(role.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );

  return (
    <div className="container">
      <h2 className="my-4">Assign Role</h2>

      <form onSubmit={handleAssign} className="mb-4 row">
        <div className={`mb-3 col-md-6 ${userError ? 'has-error' : ''}`}>
          <label htmlFor="userSelect" className="form-label">
            User
          </label>
          <select
            id="userSelect"
            className={`form-select ${userError ? 'is-invalid' : ''}`}
            value={user || ''}
            onChange={(e) => setUser(e.target.value)}
          >
            <option value="" disabled>
              Select User
            </option>
            {data.users.map((user) => (
              <option key={user.user_id} value={user.user_id}>
                {user.full_name}
              </option>
            ))}
          </select>
          {userError && (
            <div className="invalid-feedback">User is required.</div>
          )}
        </div>

        <div className={`mb-3 col-md-6 ${roleError ? 'has-error' : ''}`}>
          <label htmlFor="roleSelect" className="form-label">
            Role
          </label>
          <select
            id="roleSelect"
            className={`form-select ${roleError ? 'is-invalid' : ''}`}
            value={role || ''}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select Role
            </option>
            {data.roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name_of_role}
              </option>
            ))}
          </select>
          {roleError && (
            <div className="invalid-feedback">Role is required.</div>
          )}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Assign
          </button>
        </div>
      </form>
      <div className="table-responsive">
        <SearchableTable
          data={data.assigned_roles}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          renderRow={renderRow}
        />
      </div>
    </div>
  );
};

export default AssignRole;
