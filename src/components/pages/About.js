import React from 'react';
import Vmc from './inc/Vmc';

function About() {
    return (
        <div >
            <section className='py-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-4 my-auto'>
                            <h4>About Us</h4>
                        </div>
                        <div className='col-md-8 my-auto'>
                            <h6 className='float-end'>
                                Home/About Us
                            </h6>
                        </div>
                    </div>
                </div>
            </section>
            <section className='section border-bottom'>
                <div className='container'>
                    <h5 className='main-heading'>Our Company</h5>
                    <div className='underline'></div>
                    <p>Anddhen is a startup company that offers leading consultancy and implementation expertise to help drive value across your business. We can deliver both out-of-the box and proprietary solutions and be a trustworthy, long-term technology partner that aligns with your goals and helps you achieve the results you require.</p>
                    <p>Whether you require complete digital transformation, a new cloud solution, a platform for gathering intelligence on markets, customers, suppliers, or employees; better run sales, teams, operations, practices and processes; manage customer communications; drive efficiencies; or build new solutions to meet market, business and real-world requirements, Anddhen can help deliver the right technological solution.</p>

                </div>
            </section>
            <Vmc />
        </div>

    );
}

export default About;