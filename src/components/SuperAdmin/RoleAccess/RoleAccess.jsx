import React, { useState, useEffect } from 'react';
import AddRoleModal from './AddRoleModal';
import Button from '../../atoms/Button/Button';

const RoleAccess = () => {
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState({
    id: null,
    name_of_role: '',
    admin_access_role: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/roles/all/`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleAddRole = async (roleName, accessRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name_of_role: roleName,
          admin_access_role: accessRole,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setShowModal(false);
      fetchRoles(); // Refetch roles after adding
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleUpdateRole = async (id, roleName, accessRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/update/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name_of_role: roleName, // Use the roleName parameter
          admin_access_role: accessRole, // Use the accessRole parameter
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // You may also want to reset the editingRole state here if necessary
      setEditingRole({ id: null, name_of_role: '', admin_access_role: '' });
      fetchRoles(); // Refetch roles after updating
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/roles/delete/${roleId}/`,
          {
            method: 'DELETE',
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        fetchRoles(); // Refetch roles after deleting
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

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
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default RoleAccess;
