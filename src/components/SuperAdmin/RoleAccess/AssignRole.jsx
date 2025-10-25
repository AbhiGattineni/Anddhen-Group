import React, { useState } from 'react';
import Select from 'react-select';
import SearchableTable from 'src/components/atoms/Table/SearchableTable';
import { useQueryClient } from 'react-query';
import { useDeleteData } from 'src/react-query/useFetchApis';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import ConfirmationDialog from 'src/components/organisms/Modal/ConfirmationDialog';

const AssignRole = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState(false);
  const [role, setRole] = useState('');
  const [roleError, setRoleError] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data = [], isLoading, error } = useFetchData('roles', '/api/user_and_role_overview/');
  const { mutate: assignRole } = useAddData('roles', `/assignrole/`);

  // Transform users data for react-select
  const userOptions =
    data?.users?.map(user => ({
      value: user.user_id,
      label: user.full_name,
    })) || [];

  // Function to get user's current roles
  const getUserRoles = userId => {
    return (
      data?.assigned_roles?.filter(role => role.user_id === userId)?.map(role => role.role_name) ||
      []
    );
  };

  const handleAssignRole = (userId, roleId) => {
    assignRole(
      { user: userId, role: roleId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('roles');
          setRole('');
          setUser(null);
        },
        onError: error => {
          console.error('Error assigning role:', error);
        },
      }
    );
  };

  const queryClient = useQueryClient();

  const { mutate: deleteRole } = useDeleteData('roles', `/deleteRole/${deleteRoleId}/`);

  // Handle delete confirmation
  const handleDeleteRole = roleId => {
    setDeleteRoleId(roleId);
    setShowConfirmation(true);
  };

  // Execute delete after confirmation
  const handleConfirmDelete = () => {
    if (!deleteRoleId) return;

    setIsDeleting(true);
    deleteRole(null, {
      onSuccess: () => {
        queryClient.invalidateQueries('roles');
        setShowConfirmation(false);
        setDeleteRoleId(null);
        setIsDeleting(false);
      },
      onError: error => {
        console.error('Error deleting role:', error);
        setIsDeleting(false);
        setShowConfirmation(false);
        setDeleteRoleId(null);
      },
    });
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setDeleteRoleId(null);
  };

  // Function to validate role assignment
  const validateRoleAssignment = async (userId, roleId) => {
    try {
      const selectedRole = data?.roles.find(r => r.id === roleId)?.name_of_role;

      if (selectedRole?.startsWith('status_subsidiary_')) {
        const userRoles = data?.assigned_roles
          .filter(r => r.user_id === userId)
          .map(r => r.role_name);

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
    const validation = await validateRoleAssignment(user.value, role);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    handleAssignRole(user.value, role);
  };

  // Custom styles for react-select to match Bootstrap validation
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: userError ? '#dc3545' : state.isFocused ? '#86b7fe' : '#ced4da',
      boxShadow: userError
        ? '0 0 0 0.25rem rgba(220, 53, 69, 0.25)'
        : state.isFocused
          ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
          : 'none',
      '&:hover': {
        borderColor: userError ? '#dc3545' : '#86b7fe',
      },
    }),
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
            <Select
              id="userSelect"
              options={userOptions}
              value={user}
              onChange={setUser}
              placeholder="Select User"
              isClearable
              isSearchable
              styles={customStyles}
            />
            {userError && <div className="text-danger small mt-1">User is required.</div>}
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
          disabled={deleteRoleId === role.id && isDeleting}
        >
          {deleteRoleId === role.id && isDeleting ? (
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
          <Select
            id="userSelect"
            options={userOptions}
            value={user}
            onChange={setUser}
            placeholder="Select User"
            isClearable
            isSearchable
            styles={customStyles}
          />
          {userError && <div className="text-danger small mt-1">User is required.</div>}
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
              const hasStatusRole = user ? getUserRoles(user.value).includes('status') : false;
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

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        title="Confirmation"
        show={showConfirmation}
        isLoading={isDeleting}
        message="Are you sure you want to delete this role?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default AssignRole;
