import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminPlates } from '../../dataconfig';

const SuperAdmin = () => {
  useEffect(() => {
    console.log('SuperAdmin');
  }, []);
  return (
    <div className="row">
      {adminPlates.map((data) => (
        <div className="col-md-6 my-3">
          <Link to={data.route} className="text-decoration-none">
            <div className="card shadow">
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
