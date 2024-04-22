import React, { useCallback, useEffect, useState } from "react";
import useAuthStore from "src/services/store/globalStore";

export const AssTeamModal = () => {
  const [showModal, setShowModal] = useState(false);
  const teamDetails = useAuthStore((state) => state.teamDetails);

  const toggleModal = useCallback(() => {
    useAuthStore.setState({ teamDetails: null });
    document.body.style.overflow = "auto"; // Restore body overflow
    setShowModal(false);
  }, []);

  useEffect(() => {
    const handleBodyOverflow = () => {
      document.body.style.overflow = showModal ? "hidden" : "auto";
    };

    handleBodyOverflow();

    return () => {
      document.body.style.overflow = "auto"; // Ensure body overflow is restored when unmounting
    };
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModal && !event.target.closest(".modal-content")) {
        toggleModal();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showModal, toggleModal]);

  useEffect(() => {
    setShowModal(teamDetails !== null);
  }, [teamDetails]);

  return (
    <div
      className={`position-fixed top-50 start-50 translate-middle bg-white rounded shadow overflow-hidden modal-dialog-centered ${
        showModal ? "d-block" : "d-none"
      }`}
      style={{ maxHeight: "90vh", maxWidth: "90vw" }} // Limiting modal height and width
    >
      {teamDetails && (
        <div className="modal-content p-0 h-100">
          <div className="modal-header py-2 px-3">
            <h1 className="modal-title fs-6" id="exampleModalLabel">
              Profile
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={toggleModal}
            ></button>
          </div>
          <div className="p-0 h-100 overflow-auto" style={{ maxHeight: "calc(90vh - 90px)" }}>
            <div className="profile-photo d-flex flex-column w-100 justify-content-center align-items-center">
              <img
                className="rounded-circle border border-3 m-2 p-1"
                src={teamDetails.Photo}
                alt="profile photo"
                width="150px"
                height="150px"
              />
              <h3>{teamDetails.Name}</h3>
              <i>{teamDetails.Role}</i>
            </div>
            <div className="px-3 py-3">
              <p className="px-2 mt-3">{teamDetails.Description}</p>
              <i className="text-secondary px-2">
                {teamDetails.Start_date} - {teamDetails.End_date}
              </i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
