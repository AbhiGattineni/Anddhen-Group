import React, { useState } from 'react';
import Select from 'react-select';

import PropTypes from 'prop-types';

export const Search = ({
  setSelectedOption,
  selectedOption,
  placeholder,
  options,
  isMulti,
}) => {
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

Search.propTypes = {
  setSelectedOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.object,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  isMulti: PropTypes.bool,
};
