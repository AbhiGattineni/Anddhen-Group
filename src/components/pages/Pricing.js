import React from 'react'
import { PriceCard } from '../inc/PriceCard'
import { priceData } from '../../dataconfig'

export const Pricing = () => {
    return (
        <div className='container my-5 text-center'>
            <h1>Plans that fit your need</h1>
            <div className="row gap-lg-0 gap-4 mt-5 align-items-center">
                {priceData.map((data) => (
                    <div key={data.id} className='col-12 col-lg-4'>
                        <PriceCard data={data} />
                    </div>
                ))}
            </div>

        </div>
    )
}
