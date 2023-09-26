import React from 'react'
import { InputField } from '../../inc/InputField'

export const Registration = () => {
    return (
        <div className="py-3">
            <div className='col-md-12 mb-4 text-center'>
                <h3 className='main-heading'>Registration</h3>
                <div className='underline mx-auto'></div>
            </div>
            <div className='card shadow-sm p-3 my-3'>
                <div className="row gap-4">
                    <div className="col-md-6">
                        <h5 className=''>Student Registration</h5>
                        <div className='underline'></div>
                        <form action="https://script.google.com/macros/s/AKfycby4yFPN4-yxpBzTkvakGdbllfFzPiYG44EaJ8MP65XjJRcX4z2-2x_ewyM5xd-IeEdUig/exec" method='post'>
                            <InputField name="name" label="Name" placeholder="Full Name" type="text" />
                            <InputField name="email" label="Email" placeholder="Email" type="email" />
                            <InputField name="phone" label="Phone" placeholder="Phone" type="tel" />
                            <InputField name="college" label="College" placeholder="College" type="text" />
                            <InputField name="reference" label=" Referred by" placeholder="Referrer Name" type="text" />
                            <div className='d-md-flex my-3 gap-5'>
                                <label className=''>Job Type</label>
                                <div className="d-flex gap-2">
                                    <input type="radio" name="job" value="Internship" />Internship
                                    <input type="radio" name="job" value="Full Time" />Full Time
                                </div>
                            </div>
                            <div className='form-group py-3'>
                                <button type="button " className='btn btn-warning shadow w-100'>Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-5">
                        <h5 className=''> Part Timer Registration</h5>
                        <div className='underline'></div>
                        <form action="" method='post'>
                            <InputField name="name" label="Name" placeholder="Full Name" type="text" />
                            <InputField name="email" label="Email" placeholder="Email" type="email" />
                            <InputField name="phone" label="Phone" placeholder="Phone" type="tel" />
                            <InputField name="college" label="College" placeholder="College" type="text" />
                            <InputField name="reference" label="Referred by" placeholder="Referrer Name" type="text" />
                            <InputField name="status" label="Current Status" placeholder="Current Status" type="text" />
                            <div className='form-group py-3'>
                                <button type="button " className='btn btn-warning shadow w-100'>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <h4>Contact Us</h4>
            <div className="underline"></div>
            <div className="">
                <p><i class="bi bi-envelope me-3"></i>email@domain.com</p>
                <p><i class="bi bi-telephone-fill me-3"></i>+91 8801043608</p>
            </div>
        </div>
    )
}
