import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReactSelectDropdown = ({
  options,
  onChange,
  value,
  placeholder,
  variant,
}) => {
  const customStyles = {
    react: {
      control: (base) => ({
        ...base,
        minHeight: 55, // Increased height
        height: 55,
      }),
      indicatorsContainer: (base) => ({
        ...base,
        height: 55,
      }),
      valueContainer: (base) => ({
        ...base,
        height: 55,
        padding: '0 8px',
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
      }),
    },
    bootstrap: {
      control: (base) => ({
        ...base,
        borderRadius: '.25rem',
        border: '1px solid #ced4da',
        minHeight: 55, // Increased height
        fontSize: '1rem',
      }),
      indicatorsContainer: (base) => ({
        ...base,
        height: 55,
      }),
      valueContainer: (base) => ({
        ...base,
        height: 55,
        padding: '0 8px',
      }),
      input: (base) => ({
        ...base,
        margin: 0,
        padding: 0,
      }),
    },
  };

  if (variant === 'mui') {
    return (
      <Autocomplete
        disablePortal
        options={options}
        getOptionLabel={(option) => option.label || ''}
        value={options.find((opt) => opt.value === value) || null}
        onChange={(event, newValue) => onChange(newValue?.value || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label={placeholder}
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { height: 55 } }} // Increased height
          />
        )}
        isOptionEqualToValue={(option, val) => option.value === val.value}
      />
    );
  }

  return (
    <Select
      styles={customStyles[variant] || {}}
      options={options}
      onChange={(selected) => onChange(selected?.value)}
      value={options.find((o) => o.value === value) || null}
      placeholder={placeholder}
      isClearable
      isSearchable={true}
    />
  );
};

ReactSelectDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  variant: PropTypes.oneOf(['react', 'bootstrap', 'mui']),
};

ReactSelectDropdown.defaultProps = {
  value: null,
  placeholder: 'Select...',
  variant: 'react',
};

export default ReactSelectDropdown;
