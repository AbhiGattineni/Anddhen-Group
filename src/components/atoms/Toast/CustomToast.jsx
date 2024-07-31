import React from 'react';
import { Toast } from 'react-bootstrap';

const CustomToast = ({ showToast, setShowToast, toastMsg }) => {
    return (
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
            <Toast.Body>{toastMsg}</Toast.Body>
        </Toast>
    );
};

export default CustomToast;
