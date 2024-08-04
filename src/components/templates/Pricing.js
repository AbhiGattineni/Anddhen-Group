import React from 'react';
import { PriceCard } from '../organisms/PriceCard';
import { priceData } from '../../dataconfig';

export const Pricing = () => {
  return (
    <div className="container my-5">
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading">Plans that fit your need</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="row gap-lg-0 gap-4 mt-3 align-items-center">
        {priceData.map((data) => (
          <div key={data.id} className="col-12 col-lg-4 p-2">
            <PriceCard data={data} />
          </div>
        ))}
      </div>
    </div>
  );
};
