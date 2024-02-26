import React from "react";

// Button Component
const Button = ({ setShowModal, setEditingRole, buttonText }) => {
  return (
    <button
      className="btn btn-success mb-3"
      onClick={() => {
        setShowModal(true);
        setEditingRole({ id: null, name: "", admin_access_role: "" }); // Reset editing role
      }}
    >
      {buttonText}
    </button>
  );
};

export default Button;
