import React from 'react'
import { Link } from 'react-router-dom';

export const Modal = ({ isModalOpen, setIsModalOpen }) => {
    const modalStyles = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '1000',
        backgroundColor: '#FFF',
        padding: '20px',
        width: '300px',
        borderRadius: '8px',
        boxShadow: '0px 0px 150px rgba(0, 0, 0, 0.5)'
    };

    const overlayStyles = {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: '1000'
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            {
                isModalOpen && (<div style={overlayStyles}>
                    <div style={modalStyles}>
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Submit</h1>
                        <div className="modal-body">
                            Are sure you want to submit?
                        </div>
                        <div className='d-flex justify-content-between'>
                            <button type="button" className='btn btn-secondary' onClick={closeModal}>Close</button>
                            <Link to="/test" className='btn btn-warning' onClick={() => setIsModalOpen(false)}>Submit</Link>
                        </div>
                    </div>
                </div>)
            }

        </div>
    )
}
