import React from "react";

const Toast = ({ show, onClose, color, message }) => {
  return (
    <div
      className={`toast ${show ? "show" : ""} .bg-body-secondary`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ position: "fixed", left: "10px", bottom: "10px", zIndex: 1050, backgroundColor: color ? color : undefined }}
    >
      <div className="toast-body d-flex justify-content-between fw-bold">
        {message}
        <button
          type="button"
          className="ml-2 mb-1 close border-0 rounded-circle"
          data-dismiss="toast"
          aria-label="Close"
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
