import React from 'react'

export const InputField = (props) => {
    return (
        <div className='form-group'>
            <label className='mb-1'>{props.label}</label>
            <input type={props.type} className="form-control" placeholder={props.placeholder} name={props.name}/>
        </div>
    )
}
