import React from 'react';
import { Link } from 'react-router-dom';
import { subsidiaries } from '../../dataconfig';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Subsidiaries = () => {
  return (
    <section className="section border-top">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-4 text-center">
            <h3 className="main-heading">Our Subsidiaries</h3>
            <div className="underline mx-auto"></div>
          </div>
          {subsidiaries.map(subsidiary => (
            <div className="col-md-4 mb-3" key={subsidiary.Name}>
              <div className="card">
                <LazyLoadImage
                  effect="blur"
                  src={subsidiary.Photo}
                  className="w-100 border-bottom"
                  alt="subsidiary"
                  style={{
                    height: window.innerWidth < 768 && window.innerWidth >= 576 ? '150px' : '200px', // Set height for tablets and larger screens
                    objectFit: 'cover',
                  }}
                />

                <div className="card-body">
                  <h6
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1, // Limits the name to 2 lines
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis', // Ensures ellipsis is added if text is truncated
                      whiteSpace: 'normal', // Allows wrapping to multiple lines
                      lineHeight: '1.5em', // Adjust this as needed
                      height: '1.8em', // Fixes height for 2 lines (2 * line-height)
                    }}
                  >
                    <Link to={subsidiary.link} className="text-black text-decoration-none">
                      {subsidiary.Name}
                    </Link>
                  </h6>
                  <div className="underline"></div>
                  <p
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2, // Limits the text to 2 lines
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis', // Ensures ellipsis is added if text is truncated
                      whiteSpace: 'normal', // Allows wrapping to multiple lines
                      lineHeight: '1.5em', // Adjust this as needed
                      height: '3em', // Fixes height for 2 lines (2 * line-height)
                    }}
                  >
                    {subsidiary.Description}
                  </p>
                  <Link to={subsidiary.link} className="btn btn-warning shadow">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Subsidiaries;
