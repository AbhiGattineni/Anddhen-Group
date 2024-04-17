import React from 'react';
import Slider1 from '../images/slider-1.png';
import Slider2 from '../images/slider-2.jpg';
import Slider3 from '../images/fullstack.png';
import Slider4 from '../images/slider-4.jpg';
import Slider5 from '../images/slider-5.jpg';
// import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function Slider() {
    return (
        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                    <img src={Slider1} className="d-block w-100 carousel-image" alt="Slide 1" />
                    <div className="carousel-caption d-none d-md-block text-black">
                        <h5>Anddhen Marketing Services</h5>
                        <p>Empowering your brand's online presence through strategic social media marketing solutions with Anddhen Marketing Services.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={Slider2} className="d-block w-100 carousel-image" alt="Slide 2" />
                    <div className="carousel-caption d-none d-md-block text-white">
                        <h5>Anddhen Consulting Services</h5>
                        <p className='text-white'>Guiding aspiring students through the complex process of studying abroad with personalized consulting services from Anddhen Consulting.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={Slider3} className="d-block w-100 carousel-image" alt="Slide 3" />
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Anddhen Software Services</h5>
                        <p className='text-white bg-secondary p-0'>Revolutionizing businesses with cutting-edge software solutions tailored to their unique needs, Anddhen Software Services drives innovation and efficiency.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={Slider4} className="d-block w-100 carousel-image" alt="Slide 4" />
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Anddhen Philanthropy Services</h5>
                        <p className=' text-white'>Empowering positive change and social impact through strategic philanthropic initiatives, Anddhen Philanthropy Services champions meaningful causes worldwide.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src={Slider5} className="d-block w-100 carousel-image" alt="Slide 5" />
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Anddhen Trading & Investiment</h5>
                        <p className=' text-white'>Unlocking financial opportunities and maximizing returns through expert trading and investment strategies, Anddhen Trading & Investment leads the way in wealth management.</p>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default Slider;