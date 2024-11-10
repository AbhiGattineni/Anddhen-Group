import React, { useEffect, useState } from 'react';
import AddRoleModal from './AddRoleModal';
import Button from '../../atoms/Button/Button';
import { useFetchData } from 'src/react-query/useFetchApis';
import { useAddData } from 'src/react-query/useFetchApis';
import { useQueryClient } from 'react-query';
import Toast from 'src/components/organisms/Toast';
import { useDeleteData } from 'src/react-query/useFetchApis';
import { useUpdateData } from 'src/react-query/useFetchApis';

const RoleAccess = () => {
  const [editingRole, setEditingRole] = useState({
    id: null,
    name_of_role: '',
    admin_access_role: '',
  });
  const [deleteRoleId, setDeleteRoleId] = useState(null);
  const [deletingRoleId, setDeletingRoleId] = useState(null); // Track ID of role being deleted
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({
    show: false,
    message: '',
    color: undefined,
  });
  const [showModal, setShowModal] = useState(false);

  const { data: roles = [], isLoading } = useFetchData('roles', `/roles/all/`);

  const handleEditRole = (role) => {
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
          queryClient.invalidateQueries('roles'); // Refresh roles data
          setShowModal(false);
          setToast({
            show: true,
            message: 'Role added successfully!',
            color: '#82DD55',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
        onError: (error) => {
          console.error('Error adding role:', error);
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
      }
    );
  };

  const { mutate: updateRole } = useUpdateData(
    'roles',
    `/roles/update/${editingRole?.id}/`
  );

  const handleUpdateRole = (id, roleName, accessRole) => {
    updateRole(
      {
        name_of_role: roleName,
        admin_access_role: accessRole,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('roles'); // Refresh the roles data
          setEditingRole({ id: null, name_of_role: '', admin_access_role: '' }); // Reset editing role state
          setToast({
            show: true,
            message: 'Role updated successfully!',
            color: '#82DD55',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
        onError: (error) => {
          console.error('Error updating role:', error);
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
      }
    );
  };

  useEffect(() => {
    if (deleteRoleId) {
      handleDelete();
    }
  }, [deleteRoleId]);

  const { mutate: deleteRole } = useDeleteData(
    'roles',
    `/roles/delete/${deleteRoleId}/`
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setDeletingRoleId(deleteRoleId); // Set the role ID being deleted
      deleteRole(null, {
        onSuccess: () => {
          queryClient.invalidateQueries('roles'); // Refresh roles data after deletion
          setDeletingRoleId(null); // Reset deleting role ID
          setToast({
            show: true,
            message: 'Role deleted successfully!',
            color: '#82DD55',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
        onError: (error) => {
          console.error('Error deleting role:', error);
          setDeletingRoleId(null); // Reset deleting role ID on error
          setToast({
            show: true,
            message: 'Something went wrong!',
            color: '#E23636',
          });
          setTimeout(
            () => setToast({ show: false, message: '', color: undefined }),
            3000
          );
        },
      });
    }
  };

  function handleDeleteRole(roleid) {
    setDeleteRoleId(roleid);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole({ id: null, name: '', admin_access_role: '' }); // Reset editing role
  };

  return (
    <div className="container">
      <h1 className="my-4"> </h1>
      <Button
        setShowModal={setShowModal}
        setEditingRole={setEditingRole}
        buttonText="Add Role"
      />
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
        {isLoading ? (
          <div>Loading...</div> // Or replace with a spinner component
        ) : (
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
                    disabled={editingRole.id === role} // Disable button during update
                  >
                    {editingRole.id === role ? (
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
                    disabled={deletingRoleId === role.id} // Disable only the specific delete button
                  >
                    {deletingRoleId === role.id ? (
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
        )}
      </table>
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
