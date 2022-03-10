import React from 'react';
import { Link } from 'react-router-dom';
import Slider from '../inc/Slider';
import Vmc from './inc/Vmc';

import Service1 from '../images/dp.jpg';

function Home() {
    return (
        <div>
            <Slider />
            <section className='section'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 text-center'>
                            <h3 className='main-heading'>Our Company</h3>
                            <div className='underline mx-auto'></div>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            </p>
                            <Link to="/about" className='btn btn-warning shadow'>Read More</Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Our Mission, Vision & Values */}
            <Vmc />

            {/* Services */}

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
        </div>
    );
}

export default Home;