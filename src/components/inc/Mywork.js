import React from 'react';
import { Link } from 'react-router-dom';
import Slider1 from '../images/fullstack.png';
import Slider2 from '../images/portfolio.jpg';
import Slider3 from '../images/app.jpg';
import { tab } from '@testing-library/user-event/dist/tab';

function Mywork() {
    return (
        <div className='container mb-5'>
            <div className='row '>
                <div className='col-md-12 mb-4 text-center'>
                    <h3 className='main-heading mt-4'>Our Works</h3>
                    <div className='underline mx-auto'></div>
                </div>
            </div>
            <div className='border rounded'>
                <nav className='justify-content-center'>
                    <div className='nav nav-tabs' id='nav-tab' role='tablist'>
                        <button className='nav-link active px-3 fw-bold' id='nav-home-tab' data-bs-toggle='tab' data-bs-target="#nav-home" type='button' role={tab} aria-controls='nav-home' aria-selected='true'>
                            Web Applications
                        </button>

                        <button className='nav-link px-3 fw-bold' id='nav-profile-tab' data-bs-toggle='tab' data-bs-target="#nav-profile" type='button' role={tab} aria-controls='nav-profile' aria-selected='false'>
                            Full Stack Applications
                        </button>

                        <button className='nav-link px-3 fw-bold' id='nav-contact-tab' data-bs-toggle='tab' data-bs-target="#nav-contact" type='button' role={tab} aria-controls='nav-contact' aria-selected='false'>
                            Mobile Applications
                        </button>
                    </div>
                </nav>
                <div className='tab-content' id='nav-tabContent'>
                    <div className='tab-pane fade show active' id='nav-home' role='tabpanel' aria-labelledby='nav-home-tab'>
                        <div className='card shadow m-3'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <img src={Slider1} className='img-fluid' />
                                </div>
                                <div className='col-md-8'>
                                    <h3>Google</h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                            </div>
                        </div>
                        <div className='card shadow m-3'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <img src={Slider1} className='img-fluid' />
                                </div>
                                <div className='col-md-8'>
                                    <h3>Google</h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='tab-pane fade p-3' id='nav-profile' role='tabpanel' aria-labelledby='nav-profile-tab'>
                        <div className='card shadow m-3'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <img src={Slider2} className='img-fluid' />
                                </div>
                                <div className='col-md-8'>
                                    <h3>Microsoft</h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                            </div>
                        </div>
                        <div className='card shadow m-3'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <img src={Slider2} className='img-fluid' />
                                </div>
                                <div className='col-md-8'>
                                    <h3>Microsoft</h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='tab-pane fade p-3' id='nav-contact' role='tabpanel' aria-labelledby='nav-contact-tab'>
                        <div className='card shadow m-3'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <img src={Slider3} className='img-fluid' />
                                </div>
                                <div className='col-md-8'>
                                    <h3>Anddhen</h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                            </div>
                        </div>
                        <div className='card shadow m-3'>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <img src={Slider3} className='img-fluid' />
                                </div>
                                <div className='col-md-8'>
                                    <h3>Anddhen</h3>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mywork;