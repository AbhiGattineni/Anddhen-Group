import React, { Component } from 'react';
import './Card.css';
import "bootstrap-icons/font/bootstrap-icons.css"
import image1 from '../images/dp.jpg';
import image2 from '../images/img1.jpg';


const Cards = () => {
    const details = [
        {
            Name: "Abhishek Gattineni",
            Photo: image1,
            Start_date: "10 / 10 / 2022",
            End_date: "10 / 10 / 2022",
            Role: "Software Developer",
            Facebook: "https://www.facebook.com/abhi.gattineni/",
            LinkedIn: "https://www.linkedin.com/in/abhishek-gattineni-05937088/",
            Twitter: "https://twitter.com/",

        },
        {
            Name: "Trinath Gundla",
            Photo: image2,
            Start_date: "10 / 10 / 2022",
            End_date: "10 / 10 / 2022",
            Role: "Software Intern",
            Facebook: "https://www.facebook.com/gundla.trinath",
            LinkedIn: "https://www.linkedin.com/in/trinath-gundla-298828210/",
            Twitter: "https://twitter.com/TrinathGundla",
        },
    ];

    const Cards = (card) => {
        return (
            <div className="col-md-4 col-lg-3 col-sm-6">
                <div className="card">
                    <div className="image">
                        <img src={card.Photo} />
                    </div>
                    <div className="main-text">
                        <h5>{card.Name}</h5>
                        <p>{card.Start_date} - {card.End_date}</p>
                        <p>{card.Role}</p>
                    </div>
                    <div className="socials">
                        <a href={card.Facebook}><i id="f" class="bi bi-facebook"></i></a>
                        <a href={card.LinkedIn}><i id="l" class="bi bi-linkedin"></i></a>
                        <a href={card.Twitter}><i id="t" class="bi bi-twitter"></i></a>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='bg-c-light'>
            <div className='row '>
                <div className='col-md-12 mb-4 text-center'>
                    <h3 className='main-heading mt-4'>Our Employees</h3>
                    <div className='underline mx-auto'></div>
                </div>
            </div>
            <div className='row mx-5'>{details.map(Cards)}</div>
        </div>
    );

};
export default Cards;