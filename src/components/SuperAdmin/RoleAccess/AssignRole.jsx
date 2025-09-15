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

  const { data = [], isLoading, error } = useFetchData('roles', '/api/user_and_role_overview/');
  const { mutate: assignRole } = useAddData('roles', `/assignrole/`); // Using your custom hook

  // Function to get user's current roles
  const getUserRoles = userId => {
    return (
      data?.assigned_roles?.filter(role => role.user_id === userId)?.map(role => role.role_name) ||
      []
    );
  };

  const handleAssignRole = (user, role) => {
    assignRole(
      { user, role },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('roles'); // Refresh user data and roles
          setRole('');
          setUser('');
        },
        onError: error => {
          console.error('Error assigning role:', error);
        },
      }
    );
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    if (deleteRoleId) {
      handleDelete();
    }
  }, [deleteRoleId]);

  const { mutate: deleteRole } = useDeleteData('roles', `/deleteRole/${deleteRoleId}/`);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      deleteRole(null, {
        onSuccess: () => {
          queryClient.invalidateQueries('roles'); // Refresh the roles and user data
        },
        onError: error => {
          console.error('Error deleting role:', error);
        },
      });
    }
  };

  const handleDeleteRole = roleId => {
    setDeleteRoleId(roleId);
  };

  // Function to validate role assignment
  const validateRoleAssignment = async (userId, roleId) => {
    try {
      // Get the role name from the roles data
      const selectedRole = data?.roles.find(r => r.id === roleId)?.name_of_role;

      // If it's a subsidiary status role
      if (selectedRole?.startsWith('status_subsidiary_')) {
        // Find user's current roles
        const userRoles = data?.assigned_roles
          .filter(r => r.user_id === userId)
          .map(r => r.role_name);

        // Check if user has the base 'status' role
        if (!userRoles.includes('status')) {
          return {
            isValid: false,
            message:
              'User must have "status" role before assigning subsidiary-specific status roles',
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      console.error('Error validating role assignment:', error);
      return {
        isValid: false,
        message: 'Error validating role assignment',
      };
    }
  };

  const handleAssign = async event => {
    event.preventDefault();

    let hasError = false;
    if (!user) {
      setUserError(true);
      hasError = true;
    } else {
      setUserError(false);
    }

    if (!role) {
      setRoleError(true);
      hasError = true;
    } else {
      setRoleError(false);
    }

    if (hasError) return;

    // Validate role assignment
    const validation = await validateRoleAssignment(user, role);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    handleAssignRole(user, role);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Handle network errors
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        An error occurred: {error.message || 'Failed to fetch data. Please try again later.'}
      </div>
    );
  }

  // Handle no records
  if (!data?.assigned_roles || data.assigned_roles.length === 0) {
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
              onChange={e => setUser(e.target.value)}
            >
              <option value="" disabled>
                Select User
              </option>
              {data?.users.map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.full_name}
                </option>
              ))}
            </select>
            {userError && <div className="invalid-feedback">User is required.</div>}
          </div>

          <div className={`mb-3 col-md-6 ${roleError ? 'has-error' : ''}`}>
            <label htmlFor="roleSelect" className="form-label">
              Role
            </label>
            <select
              id="roleSelect"
              className={`form-select ${roleError ? 'is-invalid' : ''}`}
              value={role || ''}
              onChange={e => setRole(e.target.value)}
            >
              <option value="" disabled>
                Select Role
              </option>
              {data?.roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name_of_role}
                </option>
              ))}
            </select>
            {roleError && <div className="invalid-feedback">Role is required.</div>}
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </div>
        </form>
        <div className="alert alert-info" role="alert">
          No records to display.
        </div>
      </div>
    );
  }

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
            onChange={e => setUser(e.target.value)}
          >
            <option value="" disabled>
              Select User
            </option>
            {data?.users.map(user => (
              <option key={user.user_id} value={user.user_id}>
                {user.full_name}
              </option>
            ))}
          </select>
          {userError && <div className="invalid-feedback">User is required.</div>}
        </div>

        <div className={`mb-3 col-md-6 ${roleError ? 'has-error' : ''}`}>
          <label htmlFor="roleSelect" className="form-label">
            Role
          </label>
          <select
            id="roleSelect"
            className={`form-select ${roleError ? 'is-invalid' : ''}`}
            value={role || ''}
            onChange={e => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select Role
            </option>
            {data?.roles.map(role => {
              const isSubsidiaryRole = role.name_of_role.startsWith('status_subsidiary_');
              const hasStatusRole = user ? getUserRoles(user).includes('status') : false;
              const isDisabled = isSubsidiaryRole && !hasStatusRole;

              return (
                <option key={role.id} value={role.id} disabled={isDisabled}>
                  {role.name_of_role}
                  {isSubsidiaryRole ? ' (Requires status role)' : ''}
                </option>
              );
            })}
          </select>
          {roleError && <div className="invalid-feedback">Role is required.</div>}
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
