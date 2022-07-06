import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <section className='section footer bg-dark text-white'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-4'>
                        <h6>Company Information</h6>
                        <hr />
                        <p className='text-white'>
                            Anddhen is a startup company that offers leading consultancy and implementation expertise to help drive value across your business.</p>
                        <div className="socials">
                            <a href="/"><i id="f" class="bi bi-facebook"></i></a>
                            <a href="/"><i id="l" class="bi bi-linkedin"></i></a>
                            <a href="/"><i id="t" class="bi bi-github"></i></a>
                            <a href="/"><i id="t" class="bi bi-twitter"></i></a>
                            <a href="/"><i id="t" class="bi bi-instagram"></i></a>
                            <a href="/"><i id="t" class="bi bi-youtube"></i></a>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <h6>Quick Links</h6>
                        <hr />
                        <div><Link to="/">Home</Link></div>
                        <div><Link to="/about">About</Link></div>
                        <div><Link to="/contact">Contact</Link></div>
                        <div><Link to="/blog">blog</Link></div>
                    </div>
                    <div className='col-md-4'>
                        <h6>Contact Information</h6>
                        <hr />
                        <div><p className='text-white mb-1'>#64, Banglore, karnataka, India</p></div>
                        <div><p className='text-white mb-1'>#+91 8801043088</p></div>
                        <div><p className='text-white mb-1'>email@domain.com</p></div>
                        <div><a className='fw-bolder text-decoration-underline badge bg-warning' href="https://abhishekgattineni.com/">Developed by Abhishek Gattineni</a></div>
                    </div>
                </div>
            </div>
        </section>

    );
}

export default Footer;