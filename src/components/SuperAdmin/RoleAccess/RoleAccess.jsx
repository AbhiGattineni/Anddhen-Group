import React, { useState } from 'react';
import AddRoleModal from './AddRoleModal';
import Button from '../../atoms/Button/Button';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';
import Toast from 'src/components/organisms/Toast';
import { useDeleteData } from 'src/react-query/useFetchApis';
import { useUpdateData } from 'src/react-query/useFetchApis';
import ConfirmationDialog from 'src/components/organisms/Modal/ConfirmationDialog';

const RoleAccess = () => {
  const [editingRole, setEditingRole] = useState({
    id: null,
    name_of_role: '',
    admin_access_role: '',
  });
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [deletingRoleId, setDeletingRoleId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const [toast, setToast] = useState({
    show: false,
    message: '',
    color: undefined,
  });
  const [showModal, setShowModal] = useState(false);

  const { data: roles = [], isLoading, error } = useFetchData('roles', `/roles/all/`);

  const handleEditRole = role => {
    setEditingRole({
      id: role.id,
      name_of_role: role.name_of_role,
      admin_access_role: role.admin_access_role,
    });
    setShowModal(true);
  };

  const handleSaveRole = async (roleName, accessRole, id) => {
    if (id) {
      await handleUpdateRole(id, roleName, accessRole);
    } else {
      await handleAddRole(roleName, accessRole);
    }
  };

  const { mutate: addRole } = useAddData('roles', `/roles/add/`);

  const handleAddRole = (roleName, accessRole) => {
    addRole(
      {
        name_of_role: roleName,
        admin_access_role: accessRole,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('roles');
          setShowModal(false);
          setToast({
            show: true,
            message: 'Role added successfully!',
            color: '#82DD55',
          });
          setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
        },
        onError: error => {
          console.error('Error adding role:', error);
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
        },
      }
    );
  };

  const { mutate: updateRole } = useUpdateData('roles', `/roles/update/${editingRole?.id}/`);

  const handleUpdateRole = (id, roleName, accessRole) => {
    updateRole(
      {
        name_of_role: roleName,
        admin_access_role: accessRole,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('roles');
          setEditingRole({ id: null, name_of_role: '', admin_access_role: '' });
          setToast({
            show: true,
            message: 'Role updated successfully!',
            color: '#82DD55',
          });
          setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
        },
        onError: error => {
          console.error('Error updating role:', error);
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
        },
      }
    );
  };

  const { mutate: deleteRole } = useDeleteData('roles', `/roles/delete/${deleteRoleId}/`);

  // Handle delete role - opens confirmation dialog
  const handleDeleteRole = roleid => {
    setDeleteRoleId(roleid);
    setShowConfirmation(true);
  };

  // Confirm delete - executes after user confirms
  const handleConfirmDelete = () => {
    if (!deleteRoleId) return;

    setIsDeleting(true);
    setDeletingRoleId(deleteRoleId);

    deleteRole(null, {
      onSuccess: () => {
        queryClient.invalidateQueries('roles');
        setShowConfirmation(false);
        setDeleteRoleId(null);
        setDeletingRoleId(null);
        setIsDeleting(false);
        setToast({
          show: true,
          message: 'Role deleted successfully!',
          color: '#82DD55',
        });
        setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
      },
      onError: error => {
        console.error('Error deleting role:', error);
        setShowConfirmation(false);
        setDeleteRoleId(null);
        setDeletingRoleId(null);
        setIsDeleting(false);
        setToast({
          show: true,
          message: 'Something went wrong!',
          color: '#E23636',
        });
        setTimeout(() => setToast({ show: false, message: '', color: undefined }), 3000);
      },
    });
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setDeleteRoleId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole({ id: null, name: '', admin_access_role: '' });
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
  if (!roles || roles.length === 0) {
    return (
      <div className="container">
        <h1 className="my-4">Role Access</h1>
        <Button setShowModal={setShowModal} setEditingRole={setEditingRole} buttonText="Add Role" />
        <div className="alert alert-info" role="alert">
          No records to display.
        </div>
        <AddRoleModal
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSaveRole}
          editingRole={editingRole}
          setEditingRole={setEditingRole}
          handleEditRole={handleEditRole}
        />
        <Toast
          show={toast.show}
          message={toast.message}
          color={toast.color}
          onClose={() => setToast({ show: false, message: '', color: undefined })}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="my-4">Role Access</h1>
      <Button setShowModal={setShowModal} setEditingRole={setEditingRole} buttonText="Add Role" />
      <AddRoleModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={handleSaveRole}
        editingRole={editingRole}
        setEditingRole={setEditingRole}
        handleEditRole={handleEditRole}
      />

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Role Name</th>
            <th scope="col">Admin Access Role</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id}>
              <th scope="row">{index + 1}</th>
              <td>{role.name_of_role}</td>
              <td>{role.admin_access_role}</td>
              <td>
                <button
                  className="btn btn-primary mr-2"
                  onClick={() => handleEditRole(role)}
                  disabled={editingRole.id === role.id}
                >
                  {editingRole.id === role.id ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <i className="bi bi-pencil-fill"></i>
                  )}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteRole(role.id)}
                  disabled={deletingRoleId === role.id && isDeleting}
                >
                  {deletingRoleId === role.id && isDeleting ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <i className="bi bi-trash-fill"></i>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        title="Confirmation"
        show={showConfirmation}
        isLoading={isDeleting}
        message="Are you sure you want to delete this role?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        color={toast.color}
        onClose={() => setToast({ show: false, message: '', color: undefined })}
      />
    </div>
  );
};

export default RoleAccess;
