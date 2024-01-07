import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export const updatesAndStatus = [
  {
    child: "Anddhen Consulting Services",
    route: "acs_consultants",
  },
  {
    child: "Anddhen Consulting Services",
    route: "managers/updates",
  },
  {
    child: "Anddhen Consulting Services",
    route: "parttimers/updates",
  },
  {
    child: "Anddhen Software Services",
    route: "interns/updates",
  },
  {
    child: "Anddhen Access Services",
    route: "roleaccess",
  },
];

const SuperAdmin = () => {
  useEffect(() => {
    console.log("SuperAdmin");
  }, []);
  return (
    <div className="row">
      {updatesAndStatus.map((data) => (
        <div className="col-md-6 my-3">
          <Link to={data.route} className="text-decoration-none">
            <div className="card shadow-lg">
              <div className="card-body">
                <div className="d-flex justify-content-center mb-3">
                  <p className=" font-weight-bold">{data.child}</p>
                </div>
                <div className="d-flex justify-content-center">
                  <code>{data.route}</code>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SuperAdmin;
