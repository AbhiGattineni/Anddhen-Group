import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const Education = props => {
  return (
    <>
      {props.formData.education?.map((edu, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid #ddd',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          {props.categories[1].fields.map(field =>
            field === 'current' ? (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    name={field}
                    checked={edu[field] || false}
                    onChange={e => props.handleChange(e, index)}
                  />
                }
                label="Currently Studying"
              />
            ) : (
              <TextField
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                name={field}
                fullWidth
                margin="normal"
                onChange={e => props.handleChange(e, index)}
                value={edu[field] ?? ''}
                required={props.categories[1].required.includes(field)}
                disabled={field === 'end_Date' && edu.current}
              />
            )
          )}

          {/* Remove Education Entry (Disabled if only 1 entry remains) */}
          {props.formData.education.length > 1 && (
            <Typography
              onClick={() => props.removeEducation('education', index)}
              sx={{
                mt: 1,
                color: 'red',
                cursor: 'pointer',
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: 'bold',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Remove
            </Typography>
          )}
        </Box>
      ))}

      {/* Add Education Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.addEducation('education')}
        sx={{ mt: 2 }}
      >
        Add Education
      </Button>
    </>
  );
};

Education.propTypes = {
  formData: PropTypes.shape({
    education: PropTypes.arrayOf(
      PropTypes.shape({
        // Define the expected properties inside education objects
      })
    ),
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      fields: PropTypes.arrayOf(PropTypes.object),
      required: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  handleChange: PropTypes.func.isRequired,
  removeEducation: PropTypes.func.isRequired,
  addEducation: PropTypes.func.isRequired,
};

export default Education;
