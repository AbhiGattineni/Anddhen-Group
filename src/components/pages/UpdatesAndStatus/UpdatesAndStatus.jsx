import React from "react";
import { Link } from "react-router-dom";
import { updatesAndStatus } from "../../../dataconfig";

export const UpdatesAndStatus = () => {
  return (
    <div className="container my-5">
      <h1 className="main-heading">Updates And Status</h1>
      <div className="row">
        {updatesAndStatus.map((data) => (
          <div className="col-md-6 my-3">
            <Link to={data.route} className="text-decoration-none">
              <div className="card shadow-lg">
                {" "}
                {/* Added shadow for a bit of depth */}
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-3">
                    {" "}
                    {/* Added margin-bottom for spacing */}
                    <p className=" font-weight-bold">{data.child}</p>{" "}
                    {/* Made the text bold and large */}
                  </div>
                  <div className="d-flex justify-content-center">
                    <code>{data.route}</code>{" "}
                    {/* Used code styling for the route */}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
