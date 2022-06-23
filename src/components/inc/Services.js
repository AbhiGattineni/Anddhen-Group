import React from 'react';
import { Link } from 'react-router-dom';
import Service1 from '../images/dp.jpg';


function Services() {
    return (
        <section className='section border-top'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mb-4 text-center'>
                            <h3 className='main-heading'>Our Services</h3>
                            <div className='underline mx-auto'></div>
                        </div>
                        <div className='col-md-4 '>
                            <div className='card shadow'>
                                <img src={Service1} className="w-100 border-bottom" alt="services" />
                                <div className='card-body'>
                                    <h6>Services1</h6>
                                    <div className='underline'></div>
                                    <p>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </p>
                                    <Link to="/services" className='btn btn-warning shadow'>Read More</Link>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4 '>
                            <div className='card shadow'>
                                <img src={Service1} className="w-100 border-bottom" alt="services" />
                                <div className='card-body'>
                                    <h6>Services1</h6>
                                    <div className='underline'></div>
                                    <p>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </p>
                                    <Link to="/services" className='btn btn-warning shadow'>Read More</Link>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4 '>
                            <div className='card shadow'>
                                <img src={Service1} className="w-100 border-bottom" alt="services" />
                                <div className='card-body'>
                                    <h6>Services1</h6>
                                    <div className='underline'></div>
                                    <p>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </p>
                                    <Link to="/services" className='btn btn-warning shadow'>Read More</Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
    );
}

export default Services;