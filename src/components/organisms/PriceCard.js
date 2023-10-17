import React from "react";

export const PriceCard = ({ data }) => {
  return (
    <div className="card shadow-sm">
      <div className="d-flex justify-content-center">
        {data.popularity ? (
          <p className="position-absolute bg-danger p-1 rounded-3 text-white top-0 translate-middle start-50">
            MOST POPUPULAR
          </p>
        ) : null}
        <div className="p-4">
          <div
            className={
              window.innerWidth <= 768
                ? ""
                : "d-flex justify-content-center align-self-center"
            }
          >
            <h4>
              {data.package} : {data.categery}
            </h4>
          </div>
          <div className="text-start p-3">
            {data.features.map((feature) => (
              <div className="d-flex align-items-start" key={feature.id}>
                <span className="mx-3 text-success">
                  <i className="bi bi-check-circle-fill"></i>
                </span>
                <span className="flex-grow-1">{feature}</span>
              </div>
            ))}
          </div>

          {data?.nonFeatures?.length && (
            <div className="text-start p-3">
              {data?.nonFeatures?.map((feature) => (
                <div className="d-flex align-items-start" key={feature.id}>
                  <span className="mx-3 text-danger">
                    <i className="bi bi-x-circle-fill"></i>
                  </span>
                  <span className="flex-grow-1">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
