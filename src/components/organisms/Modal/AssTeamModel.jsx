import React, { useCallback, useEffect, useState } from 'react';
import useAuthStore from 'src/services/store/globalStore';

export const AssTeamModal = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [showModal, setShowModal] = useState(false);
  const teamDetails = useAuthStore(state => state.teamDetails);

  const toggleModal = useCallback(() => {
    useAuthStore.setState({ teamDetails: null });
    document.body.style.overflow = 'auto';
    setShowModal(false);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  useEffect(() => {
    setShowModal(teamDetails !== null);
  }, [teamDetails]);

  if (!showModal) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1300,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s',
        }}
        onClick={toggleModal}
      />
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: '24px',
          boxShadow: '0 12px 48px rgba(102,126,234,0.25)',
          zIndex: 1400,
          minWidth: 420,
          minHeight: 320,
          width: '32vw',
          maxWidth: 600,
          height: 'auto',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.3s',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          style={{
            position: 'absolute',
            top: 18,
            right: 24,
            background: 'none',
            border: 'none',
            fontSize: 28,
            color: '#764ba2',
            cursor: 'pointer',
            fontWeight: 700,
            lineHeight: 1,
          }}
          onClick={toggleModal}
          aria-label="Close"
        >
          &times;
        </button>
        {teamDetails && (
          <>
            <img
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #eee',
                marginBottom: 18,
                boxShadow: '0 4px 16px rgba(102,126,234,0.10)',
              }}
              src={`${API_BASE_URL}${teamDetails.image}`}
              alt="profile photo"
            />
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#333' }}>
              {teamDetails.name}
            </div>
            <div style={{ fontSize: 18, color: '#764ba2', fontWeight: 600, marginBottom: 8 }}>
              {teamDetails.role}
            </div>
            <div style={{ fontSize: 16, color: '#888', marginBottom: 16 }}>
              {teamDetails.work_time_from} - {teamDetails.work_time_to}
            </div>
            <div style={{ fontSize: 17, color: '#555', marginBottom: 18, textAlign: 'center' }}>
              {teamDetails.description}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              {teamDetails.facebook_link && (
                <a
                  href={teamDetails.facebook_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1877f2', fontSize: 28 }}
                >
                  <i className="bi bi-facebook"></i>
                </a>
              )}
              {teamDetails.linkedin_link && (
                <a
                  href={teamDetails.linkedin_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0077b5', fontSize: 28 }}
                >
                  <i className="bi bi-linkedin"></i>
                </a>
              )}
              {teamDetails.github_link && (
                <a
                  href={teamDetails.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#333', fontSize: 28 }}
                >
                  <i className="bi bi-github"></i>
                </a>
              )}
            </div>
          </>
        )}
      </div>
      {/* Fade-in animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};
