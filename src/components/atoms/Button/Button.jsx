import React from 'react';
import PropTypes from 'prop-types';

// Button Component
const Button = ({ setShowModal, setEditingRole, buttonText }) => {
  return (
    <button
      className="btn btn-success mb-3"
      onClick={() => {
        setShowModal(true);
        setEditingRole({ id: null, name: '', admin_access_role: '' }); // Reset editing role
      }}
    >
      {buttonText}
    </button>
  );
};

Button.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  setEditingRole: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default Button;
