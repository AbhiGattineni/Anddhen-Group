import React, { useCallback, useEffect, useState } from 'react';
import useAuthStore from 'src/services/store/globalStore';

export const AssProjectModal = () => {
  const [showModal, setShowModal] = useState(false);
  const workData = useAuthStore((state) => state.myWorkData);

  const toggleModal = useCallback(() => {
    useAuthStore.setState({ myWorkData: null });
    document.body.style.overflow = 'auto'; // Restore body overflow
    setShowModal(false);
  }, []);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = showModal ? 'hidden' : 'auto';
    };

    handleBodyOverflow();

    return () => {
      document.body.style.overflow = 'auto'; // Ensure body overflow is restored when unmounting
    };
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModal && !event.target.closest('.modal-content')) {
        toggleModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showModal, toggleModal]);

  useEffect(() => {
    setShowModal(workData !== null);
  }, [workData]);

  return (
    <div
      className={`position-fixed top-50 start-50 translate-middle bg-white rounded shadow overflow-hidden modal-dialog-centered ${
        showModal ? 'd-block' : 'd-none'
      }`}
      style={{ maxHeight: '90vh', maxWidth: '90vw' }} // Limiting modal height and width
    >
      {workData && (
        <div className="modal-content p-0 h-100">
          <div className="modal-header py-2 px-3">
            <h1 className="modal-title fs-6" id="exampleModalLabel">
              Project Overview
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={toggleModal}
            ></button>
          </div>
          <div
            className="modal-body p-0 h-100 overflow-auto"
            style={{ maxHeight: 'calc(90vh - 90px)' }}
          >
            {/* Adjust maxHeight based on header height */}
            <div
              className="modal-background d-flex align-items-end text-white"
              style={{ backgroundImage: `url(${workData.image})` }}
            >
              <h2 className="fw-bold px-3 px-md-5 fs-4 fs-md-2">
                {workData.title}
              </h2>
            </div>
            <div className="p-4">
              <p className="fw-bold">
                checkout here :{' '}
                <a href={workData.link} className="fw-normal">
                  {workData.link}
                </a>
              </p>
              {workData.description && (
                <div className="">
                  <h5>Description</h5>
                  <p>{workData.description}</p>
                </div>
              )}
              <i className="text-secondary">{workData.timeline}</i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
