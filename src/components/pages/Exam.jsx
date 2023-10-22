import React, { useEffect, useState } from "react";
import InputField from "../../components/organisms/InputField";
import { Link } from "react-router-dom";

export const Exam = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scoreBoard, setScoreBoard] = useState(null);
  const startExam = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };
  return (
    <div className="container py-2">
      <h1 className="main-heading">Quiz Test</h1>
      <div className="underline"></div>
      <table className="table table-bordered my-5">
        <thead>
          <tr>
            <th colSpan={2}>Instructions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Number of Questions</th>
            <td>20</td>
          </tr>
          <tr>
            <th>Time Limit</th>
            <td>-</td>
          </tr>
          <tr>
            <th>Type of Questions</th>
            <td>MCQs</td>
          </tr>
        </tbody>
      </table>
      {scoreBoard && (
        <>
          <h3>Attempts</h3>
          <table className="table table-bordered mb-5">
            <tbody>
              <tr>
                <th>Attempt 1</th>
                <td>20</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      <h4 className="">Details</h4>
      <div className="underline"></div>
      <form className="d-flex gap-5">
        <InputField
          name="name"
          label="Full Name"
          placeholder="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-50"
        />
        <InputField
          name="email"
          label="Email"
          placeholder="Email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-50"
        />
      </form>
      <div className="my-5">
        <Link
          to="/quiz"
          onClick={startExam}
          className={`btn btn-warning ${
            name.length && email.length ? "shadow" : "disabled"
          }`}
        >
          Start Test
        </Link>
      </div>
    </div>
  );
};
