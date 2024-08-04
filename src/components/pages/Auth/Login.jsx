import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import useUnifiedAuth from 'src/hooks/useUnifiedAuth';
import Toast from 'src/components/organisms/Toast';
import useErrorHandling from 'src/hooks/useErrorHandling';
import useAuthStore from 'src/services/store/globalStore';
import LoadingSpinner from 'src/components/atoms/LoadingSpinner/LoadingSpinner';

export const Login = () => {
  const { onGoogleSignIn, onEmailPasswordSignIn } = useUnifiedAuth();
  const [error, setError] = useState(null); // Use state to manage the raw error

  // Use the useErrorHandling hook with the current error state
  const { errorCode, title, message } = useErrorHandling(error);

  const { loading } = useAuthStore();

  const handleSignIn = async (signInMethod) => {
    const result = await signInMethod();
    console.log('result : ', result);
    if (result && !result.success) {
      setError(result.error); // Set the raw error for processing
    } else {
      setError(null); // Clear error on successful authentication or if result is unexpectedly null/undefined
    }
  };

  // Wrapper functions for each sign-in method
  const handleGoogleSignIn = () => handleSignIn(onGoogleSignIn);
  const handleEmailPasswordSignIn = (email, password) =>
    handleSignIn(() => onEmailPasswordSignIn(email, password));

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-light min-vh-100 d-flex align-items-center user-select-none">
          <div className="container">
            <div
              className="card shadow-lg rounded p-4 mx-auto"
              style={{ maxWidth: '600px' }}
            >
              <div className="text-center mb-4">
                <h2>Sign In</h2>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div>Sign in with</div>
                <div className="ms-3 d-flex gap-3">
                  <i
                    className="bi bi-google fs-4 cursor-pointer"
                    onClick={handleGoogleSignIn}
                    style={{ transition: 'transform 0.2s', color: '#4285F4' }}
                  ></i>
                  {/* <i
                    className="bi bi-facebook fs-4"
                    onClick={handleFacebookSignIn}
                    style={{
                      transition: "transform 0.2s",
                      color: "#3b5998",
                      cursor: "pointer",
                    }}
                  ></i>
                  <i
                    className="bi bi-twitter fs-4"
                    style={{
                      transition: "transform 0.2s",
                      color: "#1DA1F2",
                      // cursor: "not-allowed",
                    }}
                  ></i>
                  <i
                    className="bi bi-linkedin fs-4"
                    style={{
                      transition: "transform 0.2s",
                      color: "#0A66C2",
                      // cursor: "not-allowed",
                    }}
                  ></i> */}
                  {/* Add other social icons here */}
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div
                  style={{
                    flexGrow: 1,
                    height: '1px',
                    backgroundColor: '#d3d3d3',
                  }}
                ></div>
                <span
                  className="px-2"
                  style={{
                    backgroundColor: '#fff',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  or
                </span>
                <div
                  style={{
                    flexGrow: 1,
                    height: '1px',
                    backgroundColor: '#d3d3d3',
                  }}
                ></div>
              </div>
              {error && (
                <p className="text-danger">
                  {errorCode}-{message}
                </p>
              )}
              <LoginForm onSubmit={handleEmailPasswordSignIn} />
              <div className="d-flex justify-content-center mt-3">
                <span>Don&apos;t have an account? </span>
                <Link
                  to="/register"
                  className="text-primary fw-bold text-decoration-none ms-1"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
          {error && (
            <Toast
              show={true}
              message={`Error: ${errorCode}-${title}`}
              onClose={() => setError(null)}
            />
          )}
        </div>
      )}
    </>
  );
};
