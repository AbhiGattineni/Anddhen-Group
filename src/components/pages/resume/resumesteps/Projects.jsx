import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const Projects = props => {
  return (
    <>
      {props.formData.projects?.map((proj, index) => (
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
          {props.categories[3].fields.map(field =>
            field === 'current' ? (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    name={field}
                    checked={proj[field] || false}
                    onChange={e => props.handleChange(e, index)}
                  />
                }
                label="Currently Working"
              />
            ) : (
              <TextField
                key={field}
                label={field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                name={field}
                fullWidth
                margin="normal"
                onChange={e => props.handleChange(e, index)}
                value={proj[field] ?? ''}
                required={props.categories[3].required.includes(field)}
                disabled={field === 'end_Date' && proj.current}
                multiline={field === 'description'}
                minRows={field === 'description' ? 3 : undefined}
              />
            )
          )}

          {/* Remove Education Entry (Disabled if only 1 entry remains) */}
          {props.formData.projects.length > 1 && (
            <Typography
              onClick={() => props.removeProjects('projects', index)}
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
        onClick={() => props.addProjects('projects')}
        sx={{ mt: 2 }}
      >
        Add Project
      </Button>
    </>
  );
};

Projects.propTypes = {
  formData: PropTypes.shape({
    projects: PropTypes.arrayOf(
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
  removeProjects: PropTypes.func.isRequired,
  addProjects: PropTypes.func.isRequired,
};

export default Projects;
