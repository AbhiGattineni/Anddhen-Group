import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [navbarOpen, setNavbarOpen] = useState(false);

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
                                <Link to="/" className="navbar-brand">Anddhen Group</Link>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    onClick={() => setNavbarOpen(!navbarOpen)}
                                    aria-controls="navbarSupportedContent"
                                    aria-expanded={navbarOpen}
                                    aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className={`collapse navbar-collapse ${navbarOpen ? 'show' : ''}`} id="navbarSupportedContent">
                                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                        <li className="nav-item">
                                            <Link to="/" onClick={handleLinkClick} className="nav-link active" >Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/about" onClick={handleLinkClick} className="nav-link active" >About</Link>
                                        </li>
                                        <li class="nav-item dropdown d-none d-lg-block">
                                            <a class="nav-link dropdown-toggle active custom-dropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Subsidiaries
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li><Link to="/ams" class="dropdown-item">Anddhen Marketing Services</Link></li>
                                                <li><Link to="/acs" class="dropdown-item">Anddhen Consulting Services</Link></li>
                                                <li><Link to="/ass" class="dropdown-item">Anddhen Software Services</Link></li>
                                                <li><Link to="/aps" class="dropdown-item">Anddhen Philanthropy Services</Link></li>
                                                <li><Link to="/ati" class="dropdown-item">Anddhen Trading & Investiment</Link></li>
                                            </ul>
                                        </li>
                                        <li className="nav-item d-lg-none">
                                            <Link to="/ams" onClick={handleLinkClick} className="nav-link active" >Anddhen Marketing Services</Link>
                                        </li>
                                        <li className="nav-item d-lg-none">
                                            <Link to="/acs" onClick={handleLinkClick} className="nav-link active" >Anddhen Consulting Services</Link>
                                        </li>
                                        <li className="nav-item d-lg-none">
                                            <Link to="/ass" onClick={handleLinkClick} className="nav-link active" >Anddhen Software Services</Link>
                                        </li>
                                        <li className="nav-item d-lg-none">
                                            <Link to="/aps" onClick={handleLinkClick} className="nav-link active" >Anddhen Philanthropy Services</Link>
                                        </li>
                                        <li className="nav-item d-lg-none">
                                            <Link to="/ati" onClick={handleLinkClick} className="nav-link active" >Anddhen Trading &  Investiment</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/contact" onClick={handleLinkClick} className="nav-link active">Contact</Link>
                                        </li>
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
