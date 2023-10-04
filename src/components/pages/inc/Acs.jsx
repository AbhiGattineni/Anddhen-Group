import React from 'react'
import { Pricing } from '../Pricing'
import { Registration } from './Registration'
import { Videos } from '../../inc/Videos'
import { Link } from 'react-router-dom'

export const Acs = () => {
    return (
        <div className="">
            <div className='container mt-3'>
                <h1 className="main-heading">Anddhen Consulting Services</h1>
                <p>Welcome to Anddhen Consulting Services, the emerging leader in next-gen business solutions. As a startup, we understand the nuances and agility required in today's fast-paced world. Our fresh, innovative approach ensures that we're not just meeting your expectations, but exceeding them. Whether you're a fellow startup seeking guidance, or an established enterprise aiming for revitalization, Anddhen is poised to propel your business into the future. Let's embark on this journey together and redefine success.</p>
                <Pricing />
                <Videos />
                <div className='col-md-12 mb-4 text-center'>
                    <h3 className='main-heading'>Practice Test</h3>
                    <div className='underline mx-auto'></div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-lg-6 col-12">
                        <h3>Job Application Video Checklist: Test Your Understanding</h3>
                        <p>This quiz aims to test how well you've grasped the key concepts presented in those videos. Successfully completing the quiz demonstrates your commitment and readiness for the job application process. Ensure you've watched all the videos thoroughly before attempting. Good luck!</p>
                    </div>
                </div>
                <Link to={"/test"} className='btn btn-warning shadow'>Take Test</Link>
                <Registration />
            </div>
        </div >
    )
}
