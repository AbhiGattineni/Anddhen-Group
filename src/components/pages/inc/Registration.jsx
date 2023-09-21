import React from 'react'
import { InputField } from '../../inc/InputField'

export const Registration = () => {
    return (
        <div className="py-3">
            <h1 className='text-center pb-3'>Registration</h1>
            <div className='card shadow-sm p-3'>
                <div className="row gap-4">
                    <div className="col-md-6">
                        <h5 className=''>Student Registration</h5>
                        <div className='underline'></div>
                        <form action="https://script.google.com/macros/s/AKfycbz1o4WMurk0JJjWFYhLqKpoBqd_ZG2fmKL-pmmHlHgnHDYblvgLNT7GdW9bXLViI9U/exec" method='post'>
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
                <div className="border-top py-2">
                    <h5 className='main-heading'>Address Information</h5>
                    <div className='underline'></div>
                    <p>Hyderabad, Telangana-521175</p>
                    <p>Phone: +91 8801043608</p>
                    <p>Email: email@domain.com</p>
                </div>
            </div>
        </div>
    )
}
