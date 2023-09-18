import React, { useRef, useState } from 'react';
import { Card } from '../inc/Card'
import image from "../images/fullstack.png"
import { myworks } from '../../dataconfig';

const Myworks = () => {
    const [active, setActive] = useState(1);

    return (
        <div className='container mb-5'>
            <div className="d-flex flex-lg-row gap-3 flex-column my-4 ">
                <button className={`nav-link active px-3 fw-bold rounded-pill border-2 ${active == 1 ? "bg-primary text-white border-0" : "bg-white"}`} onClick={() => setActive(1)} id='nav-portfolio-tab' data-bs-toggle='tab' data-bs-target="#nav-portfolio" type='button' aria-controls='nav-portfolio' aria-selected='true'>
                    Portfolio or Business Applications
                </button>

                <button className={`nav-link px-3 fw-bold rounded-pill border-2 ${active == 2 ? "bg-primary text-white border-0" : "bg-white"}`} onClick={() => setActive(2)} id='nav-fullstack-tab' data-bs-toggle='tab' data-bs-target="#nav-fullstack" type='button' aria-controls='nav-fullstack' aria-selected='false'>
                    Full Stack Applications
                </button>

                <button className={`nav-link px-3 fw-bold rounded-pill border-2 ${active == 3 ? "bg-primary text-white border-0" : "bg-white"}`} onClick={() => setActive(3)} id='nav-mobile-tab' data-bs-toggle='tab' data-bs-target="#nav-mobile" type='button' aria-controls='nav-mobile' aria-selected='false'>
                    Mobile Applications
                </button>

                <button className={`nav-link px-3 fw-bold rounded-pill border-2 ${active == 4 ? "bg-primary text-white border-0" : "bg-white"}`} onClick={() => setActive(4)} id='nav-web-tab' data-bs-toggle='tab' data-bs-target="#nav-web" type='button' aria-controls='nav-web' aria-selected='false'>
                    Web Applications
                </button>
            </div>
            <div className="d-flex flex-row flex-nowrap overflow-auto gap-3">
                {myworks.map((work) => (
                    <Card image={work.image} title={work.name} description={work.description} link={work.link} />
                ))}
            </div>
        </div>
    );
}

export default Myworks;