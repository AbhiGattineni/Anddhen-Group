import React from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'react-bootstrap';

const CustomToast = ({ showToast, setShowToast, toastMsg }) => {
  return (
    <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
      <Toast.Body>{toastMsg}</Toast.Body>
    </Toast>
  );
};

CustomToast.propTypes = {
  showToast: PropTypes.bool.isRequired,
  setShowToast: PropTypes.func.isRequired,
  toastMsg: PropTypes.string.isRequired,
};

export default CustomToast;
