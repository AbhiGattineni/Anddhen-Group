import React, { useEffect } from 'react';
import './Card.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import useAuthStore from 'src/services/store/globalStore';
import { useFetchData } from 'src/react-query/useFetchApis';

const Cards = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const teamData = useAuthStore((state) => state.teamAllDetails);
  const {
    data: teamDetail = [],
    isLoading,
    error,
  } = useFetchData('teamMembers', '/team_members/');

  // Use effect to set the fetched data to the store if `teamData` is not already populated
  useEffect(() => {
    if (!teamData || teamData.length === 0) {
      useAuthStore.setState({ teamAllDetails: teamDetail });
    }
  }, [teamDetail, teamData]);

  function handleClick(detail) {
    useAuthStore.setState({ myWorkData: null });
    useAuthStore.setState({ teamDetails: detail });
  }

  if (isLoading) {
    return (
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-4 text-center">
            <h3 className="main-heading mt-4">Our Team</h3>
            <div className="underline mx-auto"></div>
          </div>
          <div className="border rounded row">
            {(teamData || teamDetail)
              .filter((detail) => detail.subsidiary === 'ass') // Filter by subsidiary
              .map((detail) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 mb-5"
                  key={detail.id}
                >
                  <div
                    className="card shadow mt-2 p-1 border border-1 cursor-pointer"
                    onClick={() => handleClick(detail)}
                  >
                    <div className="image">
                      <img
                        src={`${API_BASE_URL}${detail.image}`}
                        alt={detail.name}
                      />
                    </div>
                    <div className="card-body text-center p-1">
                      <h5>{detail.name}</h5>
                      <p>
                        {detail.work_time_from} - {detail.work_time_to}
                      </p>
                      <p>{detail.role}</p>
                      <div className="socials">
                        <a href={detail.facebook_link}>
                          <i id="f" className="bi bi-facebook"></i>
                        </a>
                        <a href={detail.linkedin_link}>
                          <i id="l" className="bi bi-linkedin"></i>
                        </a>
                        <a href={detail.github_link}>
                          <i id="t" className="bi bi-github"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cards;
