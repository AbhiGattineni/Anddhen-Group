import React from 'react'
import { Pricing } from '../Pricing'
import { Registration } from './Registration'

export const Acs = () => {
    return (
        <div className="">
            <div className='container mt-3'>
                <h1 className="main-heading">Anddhen Consulting Services</h1>
                <p>Welcome to Anddhen Consulting Services, the emerging leader in next-gen business solutions. As a startup, we understand the nuances and agility required in today's fast-paced world. Our fresh, innovative approach ensures that we're not just meeting your expectations, but exceeding them. Whether you're a fellow startup seeking guidance, or an established enterprise aiming for revitalization, Anddhen is poised to propel your business into the future. Let's embark on this journey together and redefine success.</p>
                <Pricing />
                <div className='col-md-12 mb-4 text-center'>
                    <h3 className='main-heading'>Videos</h3>
                    <div className='underline mx-auto'></div>
                </div>
                <div class="row">
                    <div className="col-12 col-lg-4 col-md-6 p-2">
                        <div class="card">
                            <div class="ratio ratio-16x9">
                                <iframe src="https://www.youtube.com/embed/NB_bj5H1UR0?si=46yLwpYCUnAush3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Video for applying Student Job Applications</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-md-6 p-2">
                        <div class="card">
                            <div class="ratio ratio-16x9">
                                <iframe src="https://www.youtube.com/embed/NAMvdbS4lk4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Video for applying Easy Apply and Recruiter Messages</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-md-6 p-2">
                        <div class="card">
                            <div class="ratio ratio-16x9">
                                <iframe src="https://www.youtube.com/embed/l_EaQ0_kmbE?si=OwIqpaf5Iij-cwuE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Video for filtering unnecessary Job Applications</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-md-6 p-2">
                        <div class="card">
                            <div class="ratio ratio-16x9">
                                <iframe src="https://www.youtube.com/embed/1X9-BYFx9_k?si=V19wlivDq6eXQPXj" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Video for filtering Staffing and Consulting jobs</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-md-6 p-2">
                        <div class="card">
                            <div class="ratio ratio-16x9">
                                <iframe src="https://www.youtube.com/embed/Wk_p1JYFA8Y?si=lViZVlVt7Ld2xz_Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Video to filter out sponsorship, active clearance, citizen or resident jobs</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-md-6 p-2">
                        <div class="card">
                            <div class="ratio ratio-16x9">
                                <iframe src="https://www.youtube.com/embed/NAMvdbS4lk4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">How to use simplify chrome extension</h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Registration />
            </div>
        </div >
    )
}
