import React from 'react'
import { InputField } from '../../inc/InputField'

export const Registration = () => {
    return (
        <div className='card shadow-sm p-3'>
            <div className="row gap-4">
                <div className="col-md-6">
                    <h5 className=''>Student Registration</h5>
                    <div className='underline'></div>
                    <form action="" method='post'>
                        <InputField name="name" label="Name" placeholder="Full Name" type="text" />
                        <InputField name="email" label="Email" placeholder="Email" type="email" />
                        <InputField name="phone" label="Phone" placeholder="Phone" type="tel" />
                        <InputField name="college" label="College" placeholder="College" type="text" />
                        <InputField name="reference" label=" Referred by" placeholder="Referrer Name" type="text" />
                        <div className='d-md-flex my-3 gap-5'>
                            <label className=''>Job Type</label>
                            <div className="d-flex gap-2">"
                                <input type="radio" name="job" value="Internship"/>Internship
                                <input type="radio" name="job" value="Full Time"/>Full Time
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
                    <InputField name="Name" label="Name" placeholder="Full Name" type="text" />
                    <InputField name="Email" label="Email" placeholder="Email" type="email" />
                    <InputField name="Phone" label="Phone" placeholder="Phone" type="tel" />
                    <InputField name="College" label="College" placeholder="College" type="text" />
                    <InputField name="Referrer" label="Referred by" placeholder="Referrer Name" type="text" />
                    <InputField name="status" label="Current Status" placeholder="Current Status" type="text" />
                    <div className='form-group py-3'>
                        <button type="button " className='btn btn-warning shadow w-100'>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
