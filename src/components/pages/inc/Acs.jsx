import React from 'react'
import { Pricing } from '../Pricing'
import { Registration } from './Registration'
import { Videos } from '../../inc/Videos'

export const Acs = () => {
    return (
        <div className="">
            <div className='container mt-3'>
                <h1 className="main-heading">Anddhen Consulting Services</h1>
                <p>Welcome to Anddhen Consulting Services, the emerging leader in next-gen business solutions. As a startup, we understand the nuances and agility required in today's fast-paced world. Our fresh, innovative approach ensures that we're not just meeting your expectations, but exceeding them. Whether you're a fellow startup seeking guidance, or an established enterprise aiming for revitalization, Anddhen is poised to propel your business into the future. Let's embark on this journey together and redefine success.</p>
                <Pricing />
                <Videos />
                <Registration />
            </div>
        </div >
    )
}
