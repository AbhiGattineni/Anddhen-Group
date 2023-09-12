import React from 'react'
import { PriceCard } from '../inc/PriceCard'

export const Pricing = () => {
    const priceData = [
        {
            id: 1,
            priceName: "Hobby",
            price: 79,
            features: ["unlimited build.", "lorem duplicate data.", "5TB Lorem, ipsum dolor."]
        },
        {
            id: 2,
            priceName: "Growth",
            price: 149,
            features: ["unlimited build.", "lorem duplicate data.", "5TB Lorem, ipsum dolor.", "5TB Lorem, ipsum dolor.", "5TB Lorem, ipsum dolor."],
            popularity: true
        },
        {
            id: 3,
            priceName: "Scale",
            price: 349,
            features: ["unlimited build.", "lorem duplicate data.", "5TB Lorem, ipsum dolor."]
        },
    ]
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
