import React, { useState } from 'react';
import useFetchQuestions from '../../react-query/useFetchQuestions';
import LoadingSpinner from '../atoms/LoadingSpinner/LoadingSpinner';
import ErrorPage from '../pages/ErrorPage';
import useErrorHandling from 'src/hooks/useErrorHandling';

import PropTypes from 'prop-types';

export const QuestionCard = ({ setShowForm, setMessage }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [btnDisable, setBtnDisable] = useState(false);

  const { data: questions, isLoading, isError, error } = useFetchQuestions();
  const { errorCode, title, message } = useErrorHandling(error);

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return <ErrorPage errorCode={errorCode} title={title} message={message} />;

  const handleAnswer = (selectedAnswer) => {
    setBtnDisable(true);
    setSelectedAnswers((prev) => [...prev, selectedAnswer]);
    setTimeout(() => {
      setBtnDisable(false);
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 500); // Add a delay before moving to the next question
  };

  const handleSubmit = () => {
    const allCorrect = selectedAnswers.every((answer, index) => {
      return questions[index].answer === answer;
    });

    setShowForm(allCorrect);
    setMessage(
      allCorrect
        ? 'Fill form to proceed with registration'
        : 'You are not matching with our requirements!',
    );
  };

  const resetResult = () => {
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    setShowForm(false);
    setMessage('');
  };

  return (
    <div className={`card-container mb-3`}>
      <div
        className="card bg-light p-3 shadow shadow-sm"
        style={{ height: '300px', width: '300px' }}
      >
        {currentQuestionIndex < questions.length ? (
          <div
            className={`card-body d-flex flex-column justify-content-between`}
          >
            <div className="">
              <h5 className="card-title">Q{currentQuestionIndex + 1}.</h5>
              <p className="card-text fs-5">
                {questions[currentQuestionIndex].question}
              </p>
            </div>
            <div className="d-flex justify-content-between">
              {questions[currentQuestionIndex].ans_options.map(
                (option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAnswer(option)}
                    disabled={btnDisable}
                    className="border cursor-pointer text-nowrap border-2 rounded-3 px-2 py-1 w-25 text-center text-decoration-none fw-bold"
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className={`card-review`}>
            <div className="card-title fw-bold text-center">Review</div>
            {questions.map((que, index) => (
              <div key={index} className="">
                <div className="">{que.question}</div>
                <p className="fw-bold">{selectedAnswers[index]}</p>
              </div>
            ))}
            <div className="d-flex justify-content-between align-items-center mx-1">
              <div
                onClick={resetResult}
                className="text-decoration-underline text-secondary cursor-pointer"
              >
                reset
              </div>
              <div onClick={handleSubmit} className="btn btn-warning shadow">
                Submit
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

QuestionCard.propTypes = {
  setShowForm: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};
