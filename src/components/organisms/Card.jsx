import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export const Card = (props) => {
  return (
    <div>
      <div className='card h-100'>
        <LazyLoadImage effect='blur' src={props.image} className="w-100 border-bottom" alt="services" height="200px" />
        <div className='card-body'>
          <h6><a href={props.link} className='text-black text-decoration-none'>{props.title}</a></h6>
          <div className='underline'></div>
          <p className='truncate'>{props.description}</p>
        </div>
      </div>
    </div>
  )
}
