import { TextField } from '@mui/material';
import React from 'react';

const PersonalInfo = (props) => {
  return props.categories[0].fields.map((field) => (
    <TextField
      key={field}
      label={field
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())}
      name={field}
      fullWidth
      margin="normal"
      onChange={props.handleChange}
      value={props.formData.personalInfo?.[field] ?? ''}
      required={props.categories[0].required.includes(field)}
    />
  ));
};

export default PersonalInfo;
