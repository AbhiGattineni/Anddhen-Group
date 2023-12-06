import React, { useState, useEffect } from 'react';

export const QuestionCard = ({ setShowForm, setMessage }) => {
    const [partTimerQuestions, setPartTimerQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [button1, setButton1] = useState(true);
    const [button2, setButton2] = useState(true);
    const [questionNo, setQuestionNo] = useState(0);
    const [question, setQuestion] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [result, setResult] = useState([]);
    const [btnDisable,setBtnDisable] = useState(false);

    useEffect(() => {
        // Replace with your Google Sheets API key and spreadsheet ID
        const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
        const SPREADSHEET_ID = "133YjHEbzn11c_dEQxaO7KdcCyUJUpQWN_5Kuf-pOzZ0";
        const TAB_NAME = "Part Timer Questions";
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(TAB_NAME)}!A1:B12?key=${API_KEY}`
                );

                if (!response.ok) {
                    console.error(`Error fetching data. Status: ${response.status}`);
                    const errorData = await response.json();
                    console.error('Error details:', errorData.error); // Log the entire error details object
                } else {
                    const data = await response.json();
                    setPartTimerQuestions(data.values);
                    setQuestion(data.values[0][0])
                }

                setLoading(false);
            } catch (error) {
                console.error("Error in fetchData:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    function handleButton(btn) {
        setBtnDisable(true)
        if (btn === 'yes') {
            setButton1(false);
            setButton2(true);
        } else {
            setButton1(true);
            setButton2(false);
        }

        setTimeout(() => {
            setResult(prevResult => [...prevResult, btn]);
            setButton1(true);
            setButton2(true);
            setIsFlipped(!isFlipped);
            setQuestionNo(questionNo + 1);
            setQuestion(partTimerQuestions[questionNo + 1][0]);
            setBtnDisable(false);
        }, 500);
    }
    function handleSubmit() {
        let correct = true;
        if(result.length == partTimerQuestions.length){
            partTimerQuestions.forEach((que,index) => {
                if(que[1] != result[index]){
                    correct=false;
                }
            })
        }
        setShowForm(correct);
        if(!correct){
            setMessage("You are not matching with our requirements!")
        }
        else{
            setMessage("Take test to procced with registration")
        }
    }

    function resetResult() {
        setResult([]);
        setQuestionNo(0);
        setQuestion(partTimerQuestions[0][0]);
        setShowForm(false)
    }

    return (
        <div className={`card-container mb-3 ${isFlipped ? 'flip' : ''}`}>
            <div className="card bg-card p-3 shadow shadow-sm" style={{ height: "300px", width: "300px" }}>
                {partTimerQuestions.length > result.length ?
                    <div className={`card-body d-flex flex-column justify-content-between ${isFlipped ? 'flip' : ''}`}>
                        <div className="">
                            <h5 className="card-title">Q{questionNo + 1}.</h5>
                            <p className="card-text fs-5">{question}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <button
                                type='button'
                                onClick={() => handleButton('yes')}
                                disabled={btnDisable}
                                className={`border cursor-pointer text-nowrap border-2 rounded-3 px-2 py-1 w-25 text-center text-decoration-none fw-bold border-success btn btn-outline-success ${button1 ? 'btn btn-outline-success' : 'btn btn-success'
                                    }`}
                            >
                                Yes
                            </button>
                            <button
                                type='button'
                                onClick={() => handleButton('no')}
                                disabled={btnDisable}
                                className={`border cursor-pointer text-nowrap border-2 rounded-3 px-2 py-1 w-25 text-center text-decoration-none fw-bold border-danger btn btn-outline-danger ${button2 ? 'btn btn-outline-danger' : 'btn btn-danger'
                                    }`}
                            >
                                No
                            </button>
                        </div>
                    </div> :
                    <div className={`card-review ${isFlipped ? 'flip' : ''}`}>
                        <div className="card-title fw-bold text-center">Review</div>
                        {partTimerQuestions.map((que, index) => (
                            <div key={index} className="">
                                <div className="">{que[0]}</div>
                                <p className='fw-bold'>{result[index]}</p>
                            </div>
                        ))}
                        <div className="d-flex justify-content-between align-items-center mx-1">
                            <div onClick={resetResult} className="text-decoration-underline text-secondary cursor-pointer">reset</div>
                            <div onClick={handleSubmit} className="btn btn-warning shadow">Submit</div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};
