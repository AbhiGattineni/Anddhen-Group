import React, { useState } from 'react';
import Select from 'react-select';

export const Search = ({ setSelectedOption, selectedOption, placeholder, options, isMulti }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleInputChange = (inputValue) => {
        setSearchQuery(inputValue);
    };
    const handleSelectChange = (selectedOptions) => {
        setSelectedOption(selectedOptions);
    };
    return (
        <div>
            <Select
                value={selectedOption}
                onChange={handleSelectChange}
                onInputChange={handleInputChange}
                options={filteredOptions}
                isSearchable
                isMulti={isMulti}
                placeholder={placeholder}
            />
        </div>
    );
};
