import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../services/Authentication/Logout';
import useAuthStore from '../../services/store/globalStore';

function Navbar(props) {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const setNewUser = useAuthStore((state) => state.setParttimer_consent);
  const handleLogout = () => {
    logout()
      .then(() => {
        setNewUser(false);
      })
      .catch((error) => {});
    setNavbarOpen(false);
  };

  const handleLinkClick = () => {
    setNavbarOpen(false);
  };

  return (
    <div className="navbar-dark bg-dark shadow">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <nav className="navbar navbar-expand-lg ">
              <div className="container-fluid">
                <Link to="/" className="navbar-brand nav-link-highlight">
                  Anddhen Group
                </Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={() => setNavbarOpen(!navbarOpen)}
                  aria-controls="navbarSupportedContent"
                  aria-expanded={navbarOpen}
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon nav-link-highlight"></span>
                </button>
                <div
                  className={`collapse navbar-collapse ${
                    navbarOpen ? 'show' : ''
                  }`}
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link
                        to="/"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/about"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        About
                      </Link>
                    </li>
                    <li className="nav-item dropdown d-none d-lg-block">
                      <a
                        className="nav-link dropdown-toggle active custom-dropdown nav-link-highlight"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Subsidiaries
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <Link to="/ams" className="dropdown-item">
                            Anddhen Marketing Services
                          </Link>
                        </li>
                        <li>
                          <Link to="/acs" className="dropdown-item">
                            Anddhen Consulting Services
                          </Link>
                        </li>
                        <li>
                          <Link to="/ass" className="dropdown-item">
                            Anddhen Software Services
                          </Link>
                        </li>
                        <li>
                          <Link to="/aps" className="dropdown-item">
                            Anddhen Philanthropy Services
                          </Link>
                        </li>
                        <li>
                          <Link to="/ati" className="dropdown-item">
                            Anddhen Trading & Investiment
                          </Link>
                        </li>
                        <li>
                          <Link to="/ats" className="dropdown-item">
                            Anddhen Travel Services
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item d-lg-none">
                      <Link
                        to="/ams"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        Anddhen Marketing Services
                      </Link>
                    </li>
                    <li className="nav-item d-lg-none">
                      <Link
                        to="/acs"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        Anddhen Consulting Services
                      </Link>
                    </li>
                    <li className="nav-item d-lg-none">
                      <Link
                        to="/ass"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        Anddhen Software Services
                      </Link>
                    </li>
                    <li className="nav-item d-lg-none">
                      <Link
                        to="/aps"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        Anddhen Philanthropy Services
                      </Link>
                    </li>
                    <li className="nav-item d-lg-none">
                      <Link
                        to="/ati"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        Anddhen Trading & Investiment
                      </Link>
                    </li>
                    <li className="nav-item d-lg-none">
                      <Link
                        to="/ats"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        Anddhen Travel Services
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/contact"
                        onClick={handleLinkClick}
                        className="nav-link active nav-link-highlight"
                      >
                        Contact
                      </Link>
                    </li>
                    {props.logout ? (
                      <li className="nav-item d-flex justify-content-center align-items-center">
                        <button
                          onClick={handleLogout}
                          className="btn btn-warning mx-2 btn-sm fw-bold"
                        >
                          Logout
                        </button>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
