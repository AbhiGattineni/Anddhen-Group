import React from 'react';
import { Link } from 'react-router-dom';

function Company() {
    return (
        <section className='section'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12 text-center'>
                        <h3 className='main-heading'>Our Company</h3>
                        <div className='underline mx-auto'></div>
                        <p>
                            To create a world where anyone can belong anywhere and we are focused on creating an end-to-end platform that will handle every part of your everything.</p>
                        <Link to="/about" className='btn btn-warning shadow'>Read More</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Company;