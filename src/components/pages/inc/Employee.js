import React from 'react';
const Employee = () => {
  const details = [
    {
      Name: 'Trinath Trinath Trinath',
      Photo: '/images/dp.jpg',
      Start_date: '10 / 10 / 2022',
      End_date: '10 / 10 / 2022',
      Role: 'software intern',
    },
    {
      Name: 'Trinath',
      Photo: '/Images/IMG_0059-02-012.jpg',
      Start_date: '10 / 10 / 2022',
      End_date: '10 / 10 / 2022',
      Role: 'software intern',
    },
    {
      Name: 'Trinath',
      Photo: '/Images/IMG_0059-02-012.jpg',
      Start_date: '10 / 10 / 2022',
      End_date: '10 / 10 / 2022',
      Role: 'software intern',
    },
    {
      Name: 'Trinath',
      Photo: '/Images/IMG_0059-02-012.jpg',
      Start_date: '10 / 10 / 2022',
      End_date: '10 / 10 / 2022',
      Role: 'software intern',
    },
    {
      Name: 'Trinath',
      Photo: '/Images/IMG_0059-02-012.jpg',
      Start_date: '10 / 10 / 2022',
      End_date: '10 / 10 / 2022',
      Role: 'software intern',
    },
    {
      Name: 'Trinath',
      Photo: '/Images/IMG_0059-02-012.jpg',
      Start_date: '10 / 10 / 2022',
      End_date: '10 / 10 / 2022',
      Role: 'software intern',
    },
  ];

  const Card = (card) => {
    return (
      <div className="col-md-4 col-lg-3 col-sm-6">
        <div className="card">
          <div className="image">
            <img src={card.Photo} alt="Profile" />
          </div>
          <div className="main-text">
            <h2>{card.Name}</h2>
            <p className="text-secondary">{card.Start_date}</p>
            <p className="text-secondary">{card.End_date}</p>
            <p className="text-secondary">{card.Role}</p>
          </div>
          <div className="socials">
            <button onClick={() => window.open('https://www.facebook.com/')}>
              <i className="bi bi-facebook"></i>
            </button>
            <button onClick={() => window.open('https://www.linkedin.com/')}>
              <i className="bi bi-linkedin"></i>
            </button>
            <button onClick={() => window.open('https://twitter.com/')}>
              <i className="bi bi-twitter"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return <div className="row">{details.map((data) => Card(data))}</div>;
};
export default Employee;
