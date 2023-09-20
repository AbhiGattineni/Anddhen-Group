import React from 'react'
import { Pricing } from '../Pricing'
import { Registration } from './Registration'

export const Acs = () => {
    return (
        <div className="">
            <div className='container mt-3'>
                <h1 className="main-heading">Anddhen Consulting Services</h1>
                <Registration />
                <Pricing />
            </div>
        </div>
    )
}
