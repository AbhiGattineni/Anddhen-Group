import React, { useState } from 'react'
import Select from 'react-select';

export const Search = ({setSelectedOption,selectedOption,placeholder,filtered}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredOptions = filtered.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleInputChange = (inputValue) => {
        setSearchQuery(inputValue);
    };
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };
    return (
        <div>
            <Select
                value={selectedOption}
                onChange={handleSelectChange}
                onInputChange={handleInputChange}
                options={filteredOptions}
                isSearchable
                placeholder={placeholder}
            />
        </div>
    )
}
