import React from 'react'

export const PriceCard = ({ data }) => {
  return (
    <div className='card shadow-sm'>
      <div className="d-flex justify-content-center">
        {data.popularity ?
          <p className="position-absolute bg-danger p-1 rounded-3 text-white top-0 translate-middle start-50">MOST POPUPULAR</p>
          : null}
        <div className="p-4">
          {/* <p className='fs-4 fw-bold text-secondary'>{data.Name}</p> */}
          {/* <p className='fs-3 mt-lg-1 text-secondary'>{data.Name}</p> */}
          <div className="d-flex justify-content-center align-self-center">
            <h4>{data.categery} : {data.Name}</h4>
          </div>
          <div className="text-start p-3">
            {data.features.map((feature) => (
              <div className="">
                <span className='mx-3 text-success'><i class="bi bi-check-circle-fill"></i></span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
