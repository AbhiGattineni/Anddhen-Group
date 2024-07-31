import React from 'react';
import { videoLinks } from '../../dataconfig';

export const Videos = () => {
  return (
    <div>
      <div className="col-md-12 mb-4 text-center">
        <h3 className="main-heading">Videos</h3>
        <div className="underline mx-auto"></div>
      </div>
      <div className="row">
        {videoLinks.map((videoData, index) => (
          <div key={index} className="col-12 col-lg-4 col-md-6 p-2">
            <div className="card h-100">
              <div className="ratio ratio-16x9">
                <iframe
                  src={videoData.link}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen="allowfullscreen"
                ></iframe>
              </div>
              <div className="card-body">
                <h5 className="card-title">{videoData.title}</h5>
                <p className="card-text">{videoData.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
