import React from "react";
import { Link } from "react-router-dom";

function Company() {
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h3 className="main-heading">Our Company</h3>
            <div className="underline mx-auto"></div>
            <p>
              Anddhen is a startup company that offers leading consultancy and
              implementation expertise to help drive value across your business.
              We can deliver both out-of-the box and proprietary solutions and
              be a trustworthy, long-term technology partner that aligns with
              your goals and helps you achieve the results you require.
            </p>
            <p>
              Whether you require complete digital transformation, a new cloud
              solution, a platform for gathering intelligence on markets,
              customers, suppliers, or employees; better run sales, teams,
              operations, practices and processes; manage customer
              communications; drive efficiencies; or build new solutions to meet
              market, business and real-world requirements, Anddhen can help
              deliver the right technological solution.
            </p>
            <Link to="/about" className="btn btn-warning shadow">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Company;
