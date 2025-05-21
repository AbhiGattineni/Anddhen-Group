import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';

const Additional = ({ formData, categories, addAdditional, removeAdditional, setFormData }) => {
  const addEntry = sectionIndex => {
    setFormData(prevData => {
      const categoryId = categories[5].id;
      const existingArray = Array.isArray(prevData[categoryId]) ? [...prevData[categoryId]] : [];

      if (!existingArray[sectionIndex]) {
        existingArray[sectionIndex] = { entries: [] };
      }

      if (!Array.isArray(existingArray[sectionIndex].entries)) {
        existingArray[sectionIndex].entries = [];
      }

      existingArray[sectionIndex].entries.push({}); // Add new entry

      return { ...prevData, [categoryId]: existingArray };
    });
  };

  const removeEntry = (sectionIndex, entryIndex) => {
    setFormData(prevData => {
      const categoryId = categories[5].id;
      const existingArray = Array.isArray(prevData[categoryId]) ? [...prevData[categoryId]] : [];

      if (
        existingArray[sectionIndex] &&
        Array.isArray(existingArray[sectionIndex].entries) &&
        existingArray[sectionIndex].entries.length > 1
      ) {
        existingArray[sectionIndex].entries = existingArray[sectionIndex].entries.filter(
          (_, i) => i !== entryIndex
        );
      }

      return { ...prevData, [categoryId]: existingArray };
    });
  };

  const handleChange = (e, sectionIndex = null, entryIndex = null) => {
    const { name, value, type, checked } = e.target;

    setFormData(prevData => {
      const categoryId = categories[5].id;
      let updatedData = Array.isArray(prevData[categoryId]) ? [...prevData[categoryId]] : [];

      if (sectionIndex !== null) {
        if (!updatedData[sectionIndex]) {
          updatedData[sectionIndex] = { section_Name: '', entries: [] };
        }

        if (entryIndex === null) {
          // Update section name
          updatedData[sectionIndex] = {
            ...updatedData[sectionIndex],
            [name]: value,
          };
        } else {
          // Update entry field
          if (!Array.isArray(updatedData[sectionIndex].entries)) {
            updatedData[sectionIndex].entries = [];
          }

          if (!updatedData[sectionIndex].entries[entryIndex]) {
            updatedData[sectionIndex].entries[entryIndex] = {};
          }

          updatedData[sectionIndex].entries[entryIndex] = {
            ...updatedData[sectionIndex].entries[entryIndex],
            [name]: type === 'checkbox' ? checked : value,
          };

          if (name === 'current') {
            updatedData[sectionIndex].entries[entryIndex].end_Date = checked ? 'Present' : '';
          }
        }
      }

      return { ...prevData, [categoryId]: updatedData };
    });
  };

  return (
    <>
      {formData.additional?.map((section, sectionIndex) => (
        <Box
          key={sectionIndex}
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid #ddd',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          <TextField
            label="Section Name"
            name="section_Name"
            fullWidth
            margin="normal"
            onChange={e => handleChange(e, sectionIndex)}
            value={section.section_Name ?? ''}
            required
          />

          {section.entries?.map((entry, entryIndex) => (
            <Box
              key={entryIndex}
              sx={{
                mb: 2,
                p: 2,
                border: '1px dashed #bbb',
                borderRadius: '6px',
              }}
            >
              {categories[5].fields.map(field =>
                field === 'current' ? (
                  <FormControlLabel
                    key={field}
                    control={
                      <Checkbox
                        name={field}
                        checked={entry[field] || false}
                        onChange={e => handleChange(e, sectionIndex, entryIndex)}
                      />
                    }
                    label="Current Date"
                  />
                ) : (
                  <TextField
                    key={field}
                    label={field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    name={field}
                    fullWidth
                    margin="normal"
                    onChange={e => handleChange(e, sectionIndex, entryIndex)}
                    value={entry[field] ?? ''}
                    required={categories[5].required.includes(field)}
                    disabled={field === 'end_Date' && entry.current}
                    minRows={field === 'description' ? 3 : undefined}
                  />
                )
              )}

              {section.entries.length > 1 && (
                <Typography
                  onClick={() => removeEntry(sectionIndex, entryIndex)}
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
                  Remove Entry
                </Typography>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={() => addEntry(sectionIndex)} sx={{ mb: 2 }}>
            Add Entry
          </Button>

          {formData.additional.length > 1 && (
            <Typography
              onClick={() => removeAdditional(sectionIndex)}
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
              Remove Section
            </Typography>
          )}
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={() => addAdditional('additional')}
        sx={{ mt: 2 }}
      >
        Add Section
      </Button>
    </>
  );
};

Additional.propTypes = {
  formData: PropTypes.shape({
    additional: PropTypes.arrayOf(
      PropTypes.shape({
        section_Name: PropTypes.string,
        entries: PropTypes.arrayOf(PropTypes.object),
      })
    ),
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fields: PropTypes.arrayOf(PropTypes.string),
      required: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  handleChange: PropTypes.func.isRequired,
  addAdditional: PropTypes.func.isRequired,
  removeAdditional: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default Additional;
