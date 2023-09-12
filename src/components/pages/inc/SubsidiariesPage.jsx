import React from 'react'
import { useLocation } from 'react-router-dom'
import Services from '../../inc/Services';
import Myworks from '../../inc/Myworks';
import { Pricing } from '../Pricing';

export const SubsidiariesPage = () => {
  const location = useLocation()
  const prop = location.state;
  return (
    <div className="">
      {/* <img src={`https://www.anddhengroup.com${prop.Photo}`} alt={prop.Name} className='w-100' /> */}
      <div className='container mt-3'>
        <h1 className="main-heading">{prop.Name}</h1>
        <p>{prop.Description}</p>
        {prop.Name === "Anddhen Software Services" &&
          <>
            <Services />
            <Myworks />
          </>
        }
        {prop.Name === "Anddhen Consulting Services" &&
          <Pricing />
        }
      </div>
    </div>
  )
}
