import React, { Component } from 'react';
import './Card.css';
import "bootstrap-icons/font/bootstrap-icons.css"
import image1 from '../images/dp.jpg';
import image2 from '../images/img1.jpg';
import rushil from '../images/rushil.jpg';
import stephen from '../images/stephen.jpg';
import saiteja from '../images/saiteja.png';
import vijetha from '../images/vijetha.jpg';
import chandu from '../images/chandu.jpg';


const Cards = () => {
    const details = [
        {
            Name: "Rushil Basappa",
            Photo: rushil,
            Start_date: "10/10/2022",
            End_date: "10/10/2022",
            Role: "CEO",
            Facebook: "https://www.facebook.com/abhi.gattineni/",
            LinkedIn: "https://www.linkedin.com/in/abhishek-gattineni-05937088/",
            GitHub: "https://github.com/AbhiGattineni",

        },
        {
            Name: "Stephen Jakku",
            Photo: stephen,
            Start_date: "10/10/2022",
            End_date: "10/10/2022",
            Role: "Senior Software Engineer",
            Facebook: "https://www.facebook.com/gundla.trinath",
            LinkedIn: "https://www.linkedin.com/in/trinath-gundla-298828210/",
            GitHub: "https://github.com/GundlaTrinath",
        },
        {
            Name: "Saiteja Polampally",
            Photo: saiteja,
            Start_date: "10/10/2022",
            End_date: "10/10/2022",
            Role: "Software Developer",
            Facebook: "https://www.facebook.com/abhi.gattineni/",
            LinkedIn: "https://www.linkedin.com/in/abhishek-gattineni-05937088/",
            GitHub: "https://github.com/AbhiGattineni",

        },
        {
            Name: "Vijetha Boddapati",
            Photo: vijetha,
            Start_date: "10/10/2022",
            End_date: "10/10/2022",
            Role: "Software Developer",
            Facebook: "https://www.facebook.com/abhi.gattineni/",
            LinkedIn: "https://www.linkedin.com/in/abhishek-gattineni-05937088/",
            GitHub: "https://github.com/AbhiGattineni",

        },
        {
            Name: "Chandu Vardhan",
            Photo: chandu,
            Start_date: "10/10/2022",
            End_date: "10/10/2022",
            Role: "Software Developer",
            Facebook: "https://www.facebook.com/abhi.gattineni/",
            LinkedIn: "https://www.linkedin.com/in/abhishek-gattineni-05937088/",
            GitHub: "https://github.com/AbhiGattineni",

        },
        {
            Name: "Abhishek Gattineni",
            Photo: image1,
            Start_date: "10/10/2022",
            End_date: "10/10/2022",
            Role: "Software Developer",
            Facebook: "https://www.facebook.com/abhi.gattineni/",
            LinkedIn: "https://www.linkedin.com/in/abhishek-gattineni-05937088/",
            GitHub: "https://github.com/AbhiGattineni",

        },
        {
            Name: "Trinath Gundla",
            Photo: image2,
            Start_date: "10/10/2022",
            End_date: "10/10/2022",
            Role: "Software Intern",
            Facebook: "https://www.facebook.com/gundla.trinath",
            LinkedIn: "https://www.linkedin.com/in/trinath-gundla-298828210/",
            GitHub: "https://github.com/GundlaTrinath",
        },
    ];

    return (
        <section className='section border-top bg-c-light'>
            <div className='container '>
                <div className='row '>
                    <div className='col-md-12 mb-4 text-center'>
                        <h3 className='main-heading mt-4'>Our Employees</h3>
                        <div className='underline mx-auto'></div>
                    </div>

                    {details.map((detail) =>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-5">
                            <div className="card shadow p-1 border border-1">
                                <div className="image">
                                    <img src={detail.Photo} />
                                </div>
                                <div class="card-body text-center p-1">
                                    <h5>{detail.Name}</h5>
                                    <p>{detail.Start_date} - {detail.End_date}</p>
                                    <p>{detail.Role}</p>
                                    <div className="socials">
                                        <a href={detail.Facebook}><i id="f" class="bi bi-facebook"></i></a>
                                        <a href={detail.LinkedIn}><i id="l" class="bi bi-linkedin"></i></a>
                                        <a href={detail.GitHub}><i id="t" class="bi bi-github"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section >
    );

};
export default Cards;