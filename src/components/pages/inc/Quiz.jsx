import React, { useEffect, useState } from 'react';
import { Modal } from '../../organisms/Modal';

export const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    // Replace with your Google Sheets API key and spreadsheet ID
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const SPREADSHEET_ID = process.env.REACT_APP_SPREAD_SHEET_ID;
    const TAB_NAME = 'Sheet3'; // or whatever your tab's name is
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${TAB_NAME}!A1:F10?key=${API_KEY}`,
        )
          .then((response) => response.json())
          .then((data) => {
            setQuiz(data.values);
          })
          .catch((error) => console.error('Error fetching data:', error));
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const handleAnswerChange = (e, questionIndex) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = e.target.value;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let score = 0;
    quiz.forEach((item, index) => {
      const correctOption = item[5];
      if (userAnswers[index] === correctOption) {
        score++;
      }
    });

    setIsModalOpen(true);

    const data = {
      sheetName: 'Marks',
      score: score,
    };

    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbwGMNYOC26_sohGkqU-vsPM9Za-GhzSMG9oHJHsEdTtqpY2sgqqJ_lpzyaOZoisIK-b/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        console.log('HTTP Status:', response.status, response.statusText);
        throw new Error('Network response was not ok');
      }

      const responseBody = await response.json();
      console.log('Fetch response:', responseBody);
    } catch (error) {
      console.error(
        'There was a problem with the fetch operation:',
        error.message,
      );
    }
  };

  return (
    <div>
      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center w-100"
          style={{ height: '100vh' }}
        >
          <div className="spinner-border " role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <nav className="navbar bg-dark">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1 text-white">
                Anddhen Group
              </span>
            </div>
          </nav>
          <div className="container">
            <div className="my-3 ">
              <p className="fw-bold fs-5 d-inline">Number of Quetions : </p>
              <span className="fs-4">{quiz.length}</span>
            </div>
            <form>
              {quiz.map((data, index) => (
                <div key={index} className="py-3">
                  <p className="fs-5">
                    {index + 1}. {data[0]}
                  </p>
                  <div className="mx-4">
                    <input
                      className="me-2"
                      type="radio"
                      value={data[1]}
                      onChange={(e) => handleAnswerChange(e, index)}
                      name={`question${index}`}
                    />
                    {data[1]}
                  </div>
                  <div className="mx-4">
                    <input
                      className="me-2"
                      type="radio"
                      value={data[2]}
                      onChange={(e) => handleAnswerChange(e, index)}
                      name={`question${index}`}
                    />
                    {data[2]}
                  </div>
                  <div className="mx-4">
                    <input
                      className="me-2"
                      type="radio"
                      value={data[3]}
                      onChange={(e) => handleAnswerChange(e, index)}
                      name={`question${index}`}
                    />
                    {data[3]}
                  </div>
                  <div className="mx-4">
                    <input
                      className="me-2"
                      type="radio"
                      value={data[4]}
                      onChange={(e) => handleAnswerChange(e, index)}
                      name={`question${index}`}
                    />
                    {data[4]}
                  </div>
                </div>
              ))}
              <button className="btn btn-warning mb-3" onClick={handleSubmit}>
                Submit
              </button>
            </form>
          </div>
          <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </>
      )}
    </div>
  );
};
