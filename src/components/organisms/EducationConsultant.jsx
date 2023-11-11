import React, { useState } from 'react';
import Select from 'react-select';
import { colleges } from '../../dataconfig';

export const EducationConsultant = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOptions = colleges.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleInputChange = (inputValue) => {
        setSearchQuery(inputValue);
    };
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    return (
        <div className="container">

            <div>
                <h2>Search Component</h2>
                <Select
                    value={selectedOption}
                    onChange={handleSelectChange}
                    onInputChange={handleInputChange}
                    options={filteredOptions}
                    isSearchable
                    placeholder="Search colleges..."
                />
                {selectedOption && (
                    <>
                        <div className='row align-items-center justify-content-start my-3 p-2 rounded-pill shadow'>
                            <div className="col-1 p-0">
                                <img className='' width='30px' src="https://th.bing.com/th/id/R.b473fcad595f09b0afe1270d9016ac8c?rik=UkXeB5L2aE8Biw&riu=http%3a%2f%2fpngimg.com%2fuploads%2finstagram%2finstagram_PNG9.png&ehk=GnhAoqBr5eV3LRtLGDB2XElOW7mvkdk29%2byVkqj09y8%3d&risl=&pid=ImgRaw&r=0" alt="" />
                            </div>
                            <div className='col text-center p-0'>Lorem ipsum dolor sit amet.</div>
                        </div>
                        <div className='row align-items-center justify-content-start my-3 p-2 rounded-pill shadow'>
                            <div className="col-1 p-0">
                                <img className='' width='30px' src="https://th.bing.com/th/id/R.b473fcad595f09b0afe1270d9016ac8c?rik=UkXeB5L2aE8Biw&riu=http%3a%2f%2fpngimg.com%2fuploads%2finstagram%2finstagram_PNG9.png&ehk=GnhAoqBr5eV3LRtLGDB2XElOW7mvkdk29%2byVkqj09y8%3d&risl=&pid=ImgRaw&r=0" alt="" />
                            </div>
                            <div className='col text-center p-0'>Lorem ipsum dolor sit amet.</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};