
import React from "react";
import { STAFFING, CONSULTING, Filter } from '../../dataconfig';
import '../generalComponents/keyWordsComponent.css';

export const KeyWordsComponent = () => {
    return (
        <div className="container">
            <h3 className="text-left my-4">Key Words Categories</h3> 

            <div className="row p-4">
                <div className="col-12 col-lg-4 col-md-6 p-2">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="card-title">STAFFING</h5>
                        </div>
                        <div className="card-body overflow-auto" style={{ maxHeight: '350px' }}>
                            <ul className="list-unstyled">
                                {STAFFING.map((data, index) => (
                                    <li key={index}>{data}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6 p-2">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="card-title">CONSULTING</h5>
                        </div>
                        <div className="card-body overflow-auto" style={{ maxHeight: '350px' }}>
                            <ul className="list-unstyled">
                                {CONSULTING.map((data, index) => (
                                    <li key={index}>{data}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 col-md-6 p-2">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="card-title">FILTER</h5>
                        </div>
                        <div className="card-body overflow-auto" style={{ maxHeight: '350px' }}>
                            <ul className="list-unstyled">
                                {Filter.map((data, index) => (
                                    <li key={index}>{data}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
>>>>>>> 82d42e4 (updated lists of key word categories)
