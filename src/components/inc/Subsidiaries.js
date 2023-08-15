import React from 'react';
import { Link, Router } from 'react-router-dom';
import Subsidiary1 from '../images/marketing.jpg';
import Subsidiary2 from '../images/consulting2.jpg';
import Subsidiary3 from '../images/service6.jpg';
import Subsidiary4 from '../images/philanthropy1.jpg';
import Subsidiary5 from '../images/trade3.jpg';

const Subsidiaries = () => {
    const subsidiaries = [
        {
            Name: "Anddhen Marketing Services",
            Photo: Subsidiary1,
            Description: "Description for Subsidiary 1"
        },
        {
            Name: "Anddhen Consulting Services",
            Photo: Subsidiary2,
            Description: "Description for Subsidiary 2"
        },
        {
            Name: "Anddhen Software Services",
            Photo: Subsidiary3,
            Description: "Description for Subsidiary 3"
        },
        {
            Name: "Anddhen Philanthropy Services ",
            Photo: Subsidiary4,
            Description: "Description for Subsidiary 4"
        },
        {
            Name: "Anddhen Trading & Investiment",
            Photo: Subsidiary5,
            Description: "Description for Subsidiary 5"
        }
    ];

    return (
        <section className='section border-top'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12 mb-4 text-center'>
                        <h3 className='main-heading'>Our Subsidiaries</h3>
                        <div className='underline mx-auto'></div>
                    </div>
                    {subsidiaries.map((subsidiary) =>
                        <div className='col-md-4 mb-3' key={subsidiary.Name}>
                            <div className='card'>
                                <img src={subsidiary.Photo} className="w-100 border-bottom" alt="subsidiary" />
                                <div className='card-body'>
                                    {/* <h6>{subsidiary.Name}</h6> */}
                                    {/* <Link to={`/subsidiary/${subsidiary.Name}`} style={{ textDecoration: 'none' }}>
                                        <h6>{subsidiary.Name}</h6>
                                    </Link> */}
                                    <Link to="/about" className='btn btn-warning shadow'><h6>{subsidiary.Name}</h6></Link>
                                    <div className='underline'></div>
                                    <p>{subsidiary.Description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Subsidiaries;
