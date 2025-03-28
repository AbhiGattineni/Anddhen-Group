import React from 'react';
import Services from '../../organisms/Services';
import Cards from '../../organisms/Cards';
import { AssProjectModal } from 'src/components/organisms/Modal/AssProjectModal';
import { AssTeamModal } from 'src/components/organisms/Modal/AssTeamModel';
import ImageSlider from 'src/components/organisms/ImageSlider/ImageSlider';
import { myworks } from 'src/dataconfig';

export const Ass = () => {
  return (
    <div className="">
      <div className="container mt-3">
        <h1 className="main-heading">Anddhen Software Services</h1>
        <p>
          Anddhen is a startup company that offers leading consultancy and
          implementation expertise to help drive value across your business. We
          can deliver both out-of-the box and proprietary solutions and be a
          trustworthy, long-term technology partner that aligns with your goals
          and helps you achieve the results you require.Whether you require
          complete digital transformation, a new cloud solution, a platform for
          gathering intelligence on markets, customers, suppliers, or employees;
          better run sales, teams, operations, practices and processes; manage
          customer communications; drive efficiencies; or build new solutions to
          meet market, business and real-world requirements, Anddhen can help
          deliver the right technological solution.
        </p>
      </div>
      <Services />
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading">Our Works</h3>
        <div className="underline mx-auto"></div>
      </div>
      <ImageSlider title="Portfolio or Business Applications" cards={myworks} />
      <ImageSlider title="Full Stack Applications" cards={myworks} />
      <ImageSlider title="Mobile Applications" cards={myworks} />
      <ImageSlider title="Web and Wordpress Applications" cards={myworks} />
      <Cards />

      <AssProjectModal />
      <AssTeamModal />
    </div>
  );
};
