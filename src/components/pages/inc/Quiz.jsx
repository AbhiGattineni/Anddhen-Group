import React, { useEffect, useState } from "react";
import { Modal } from "../../organisms/Modal";

export const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://sheet.best/api/sheets/f8d5124b-bbe7-4a1a-bd26-7805d50e3261"
        );
        const jsonData = await res.json();
        setQuiz(jsonData);
        setLoading(false);
      } catch (error) {}
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Replace with your Google Sheets API key and spreadsheet ID
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const SPREADSHEET_ID = process.env.REACT_APP_SPREAD_SHEET_ID;
    const TAB_NAME = "Sheet3"; // or whatever your tab's name is

    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${TAB_NAME}!A1:F10?key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  return (
    <div>
      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center w-100"
          style={{ height: "100vh" }}
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
                    {index + 1}. {data.Question}
                  </p>
                  <div className="mx-4">
                    <input
                      className="me-2"
                      type="radio"
                      name={`question${index}`}
                    />
                    {data.option1}
                  </div>
                  <div className="mx-4">
                    <input
                      className="me-2"
                      type="radio"
                      name={`question${index}`}
                    />
                    {data.option2}
                  </div>
                  <div className="mx-4">
                    <input
                      className="me-2"
                      type="radio"
                      name={`question${index}`}
                    />
                    {data.option3}
                  </div>
                  <div className="mx-4">
                    <input
                      className="me-2"
                      type="radio"
                      name={`question${index}`}
                    />
                    {data.option4}
                  </div>
                </div>
              ))}
              <button
                className="btn btn-warning"
                onClick={() => setIsModalOpen(true)}
              >
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
