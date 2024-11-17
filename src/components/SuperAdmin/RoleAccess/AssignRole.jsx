import React, { useEffect, useState } from 'react';
import SearchableTable from 'src/components/atoms/Table/SearchableTable';
import { useQueryClient } from 'react-query';
import { useDeleteData } from 'src/react-query/useFetchApis';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';

const AssignRole = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState('');
  const [userError, setUserError] = useState(false);
  const [role, setRole] = useState('');
  const [roleError, setRoleError] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);

  const {
    data = [],
    isLoading,
    error,
  } = useFetchData('roles', '/api/user_and_role_overview/');

  const { mutate: assignRole } = useAddData('roles', `/assignrole/`); // Using your custom hook

  const handleAssignRole = (user, role) => {
    assignRole(
      { user, role },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('roles'); // Refresh user data and roles
          setRole('');
          setUser('');
        },
        onError: (error) => {
          console.error('Error assigning role:', error);
        },
      },
    );
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    if (deleteRoleId) {
      handleDelete();
    }
  }, [deleteRoleId]);
  const { mutate: deleteRole } = useDeleteData(
    'roles',
    `/deleteRole/${deleteRoleId}/`,
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      deleteRole(null, {
        onSuccess: () => {
          queryClient.invalidateQueries('roles'); // Refresh the roles and user data
        },
        onError: (error) => {
          console.error('Error deleting role:', error);
        },
      });
    }
  };

  function handleDeleteRole(roleId) {
    setDeleteRoleId(roleId);
  }

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
      handleAssignRole(user, role);
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
          onClick={() => handleDeleteRole(role.id)}
          disabled={deleteRoleId === role.id} // Disable button during delete operation
        >
          {deleteRoleId === role.id ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            'Delete'
          )}
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
            {data?.users.map((user) => (
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
            {data?.roles.map((role) => (
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
          data={data?.assigned_roles}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          renderRow={renderRow}
        />
      </div>
    </div>
  );
};

export default AssignRole;
