import React, { useEffect, useState } from 'react'
import { Modal } from '../../inc/Modal';

export const Quiz = () => {
    const [quiz, setQuiz] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0)
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://sheet.best/api/sheets/f8d5124b-bbe7-4a1a-bd26-7805d50e3261");
                const jsonData = await res.json();
                setQuiz(jsonData);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);
    console.log(quiz);
    return (
        <div>
            {loading ?
                <div className="d-flex align-items-center justify-content-center w-100" style={{ height: "100vh" }}>
                    <div class="spinner-border " role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                :
                <>
                    <nav className="navbar bg-dark">
                        <div className="container-fluid">
                            <span className="navbar-brand mb-0 h1 text-white">Anddhen Group</span>
                        </div>
                    </nav>
                    <div className="container">
                        <div className="my-3 ">
                            <p className='fw-bold fs-5 d-inline'>Number of Quetions : </p><span className='fs-4'>{quiz.length}</span>
                        </div>
                        <form>
                            {quiz.map((data, index) => (
                                <div key={index} className="py-3">
                                    <p className='fs-5'>{index + 1}. {data.Question}</p>
                                    <div className="mx-4">
                                        <input className='me-2' type="radio" name="question1" />{data.option1}
                                    </div>
                                    <div className="mx-4">
                                        <input className='me-2' type="radio" name="question1" />{data.option2}
                                    </div>
                                    <div className="mx-4">
                                        <input className='me-2' type="radio" name="question1" />{data.option3}
                                    </div>
                                    <div className="mx-4">
                                        <input className='me-2' type="radio" name="question1" />{data.option4}
                                    </div>
                                </div>
                            ))}
                            <button className='btn btn-warning' onClick={()=>setIsModalOpen(true)}>Submit</button>
                        </form>
                    </div >
                    <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                </>
            }
        </div >
    )
}