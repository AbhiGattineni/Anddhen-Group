import React from "react";
import { STAFFING, CONSULTING, Filter } from '../../dataconfig';

export const KeyWordsComponent = () => {
    return (
        <div className="row">
            <div className="accordion col-12 col-lg-4 col-md-6 p-2">
                <div class="accordion-item" id="accordionPanelsStayOpenExample">
                    <h2 class="card h-100 p-2 accordion-header" id="panelsStayOpen-headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                            STAFFING
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                        <div class="accordion-body">
                            <ul>{STAFFING.map((data, index) => {
                                return (<li className="" key={index}>{data}</li>)
                            })}</ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="accordion col-12 col-lg-4 col-md-6 p-2">
                <div class="accordion-item" id="accordionPanelsStayOpenExample">
                    <h2 class="card h-100 p-2 accordion-header" id="panelsStayOpen-headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo">
                            CONSULTING
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                        <div class="accordion-body">
                            <ul>{CONSULTING.map((data, index) => {
                                return (<li className="" key={index}>{data}</li>)
                            })}</ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="accordion col-12 col-lg-4 col-md-6 p-2">
                <div class="accordion-item" id="accordionPanelsStayOpenExample">
                    <h2 class="card h-100 p-2 accordion-header" id="panelsStayOpen-headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true" aria-controls="panelsStayOpen-collapseThree">
                            FILTER
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                        <div class="accordion-body">
                            <ul>{Filter.map((data, index) => {
                                return (<li className="" key={index}>{data}</li>)
                            })}</ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}