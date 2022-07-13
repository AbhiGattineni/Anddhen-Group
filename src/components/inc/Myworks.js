import React from 'react';
import { Link } from 'react-router-dom';
import fullstack from '../images/fullstack.png';
import portfolio from '../images/portfolio.jpg';
import app from '../images/app.jpg';
import web from '../images/web.jpg';
import { tab } from '@testing-library/user-event/dist/tab';

const Myworks = () => {
    const portfolios = [
        {
            image: portfolio,
            title: "Google",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        },
        {
            image: portfolio,
            title: "Google",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        }]
    const full_stacks = [
        {
            image: fullstack,
            title: "HP",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."


        },
        {
            image: fullstack,
            title: "ASUS",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

        }]
    const mobiles = [
        {
            image: app,
            title: "Dell",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."


        },
        {
            image: app,
            title: "Amazon",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

        }]
    const webapps = [
        {
            image: web,
            title: "FB",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

        },
        {
            image: web,
            title: "FB",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."

        }]
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
                        <button className='nav-link active px-3 fw-bold' id='nav-portfolio-tab' data-bs-toggle='tab' data-bs-target="#nav-portfolio" type='button' role={tab} aria-controls='nav-home' aria-selected='true'>
                            Portfolio or Business Applications
                        </button>

                        <button className='nav-link px-3 fw-bold' id='nav-fullstack-tab' data-bs-toggle='tab' data-bs-target="#nav-fullstack" type='button' role={tab} aria-controls='nav-profile' aria-selected='false'>
                            Full Stack Applications
                        </button>

                        <button className='nav-link px-3 fw-bold' id='nav-mobile-tab' data-bs-toggle='tab' data-bs-target="#nav-mobile" type='button' role={tab} aria-controls='nav-contact' aria-selected='false'>
                            Mobile Applications
                        </button>

                        <button className='nav-link px-3 fw-bold' id='nav-web-tab' data-bs-toggle='tab' data-bs-target="#nav-web" type='button' role={tab} aria-controls='nav-home' aria-selected='false'>
                            Web Applications
                        </button>
                    </div>
                </nav>
                <div className='tab-content' id='nav-tabContent'>
                    <div className='tab-pane fade show active' id='nav-portfolio' role='tabpanel' aria-labelledby='nav-web-tab'>
                        {portfolios.map((portfolio) =>
                            <div className='card shadow m-3'>
                                <div className='row p-2'>
                                    <div className='col-md-4'>
                                        <img src={portfolio.image} className='img-fluid' alt="" />
                                    </div>
                                    <div className='col-md-8'>
                                        <h3>{portfolio.title}</h3>
                                        <p>{portfolio.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='tab-pane fade show active' id='nav-fullstack' role='tabpanel' aria-labelledby='nav-web-tab'>
                        {full_stacks.map((full_stack) =>
                            <div className='card shadow m-3'>
                                <div className='row p-2'>
                                    <div className='col-md-4'>
                                        <img src={full_stack.image} className='img-fluid' alt="" />
                                    </div>
                                    <div className='col-md-8'>
                                        <h3>{full_stack.title}</h3>
                                        <p>{full_stack.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='tab-pane fade p-3' id='nav-mobile' role='tabpanel' aria-labelledby='nav-fullstack-tab'>
                        {mobiles.map((mobile) =>
                            <div className='card shadow m-3'>
                                <div className='row p-2'>
                                    <div className='col-md-4'>
                                        <img src={mobile.image} className='img-fluid' alt="" />
                                    </div>
                                    <div className='col-md-8'>
                                        <h3>{mobile.title}</h3>
                                        <p>{mobile.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='tab-pane fade p-3' id='nav-web' role='tabpanel' aria-labelledby='nav-mobile-tab'>
                        {webapps.map((webapp) =>
                            <div className='card shadow m-3'>
                                <div className='row p-2'>
                                    <div className='col-md-4'>
                                        <img src={webapp.image} className='img-fluid' alt="" />
                                    </div>
                                    <div className='col-md-8'>
                                        <h3>{webapp.title}</h3>
                                        <p>{webapp.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Myworks;