import { useState, useEffect } from 'react';

const AddRoleModal = ({
  show,
  handleClose,
  handleSave,
  editingRole,
  handleEditRole,
}) => {
  const [roleForm, setRoleForm] = useState({ roleName: '', accessRole: '' });

  useEffect(() => {
    if (show) {
      setRoleForm({
        roleName: editingRole?.name_of_role || '',
        accessRole: editingRole?.admin_access_role || '',
      });
    }
  }, [show, editingRole]);

  const saveRole = () => {
    handleSave(roleForm.roleName, roleForm.accessRole, editingRole?.id);
    handleClose();
    // if (editingRole?.id) {
    //   handleEditRole(roleForm); // Update the role when editing
    // }
    setRoleForm({ roleName: '', accessRole: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleForm((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div
      style={{ display: show ? 'block' : 'none' }}
      className="modal"
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingRole?.id ? 'Edit Role' : 'Add New Role'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              name="roleName"
              value={roleForm.roleName}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Role Name"
            />
            <input
              type="text"
              name="accessRole"
              value={roleForm.accessRole}
              onChange={handleChange}
              className="form-control mb-2"
              placeholder="Admin Access Role"
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveRole}
            >
              {editingRole?.id ? 'Update Role' : 'Save Role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
