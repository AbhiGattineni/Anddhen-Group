import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SparkleIcon from '@mui/icons-material/AutoAwesome';
import { fetchAi } from '../AISuggestions';
import { CircularProgress } from '@mui/material';

const Experience = (props) => {
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    const { formData, handleChange } = props;

    if (!formData?.experience || formData.experience.length === 0) return;
    setLoading(true);

    try {
      const updatedExperience = await Promise.all(
        formData.experience.map(async (exp, index) => {
          if (!exp.description) return exp; // Skip if no description

          const response = await fetchAi(
            `Generate an experience description based on the following inputs:
            Skills: ${exp.skills}
            Description: ${exp.description}
            Use strong verbs and relevant keywords to break down and expand on each point, incorporating the listed skills where appropriate. Format the output with clear paragraphs, ensuring readability and impact.`,
          );

          // Update description and call handleChange with the correct index
          const updatedExp = { ...exp, description: response };

          // Now call handleChange to update the state
          handleChange(
            { target: { name: 'description', value: response } },
            index,
          );

          return updatedExp; // Return the updated experience
        }),
      );

      // Update the formData after all AI responses
      handleChange({
        target: { name: 'experience', value: updatedExperience },
      });
    } catch (error) {
      console.error('Error generating descriptions:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {props.formData.experience?.map((exp, index) => (
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
          {props.categories[2].fields.map((field) =>
            field === 'current' ? (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    name={field}
                    checked={exp[field] || false}
                    onChange={(e) => props.handleChange(e, index)}
                  />
                }
                label="Currently Working"
              />
            ) : field === 'skills' ? (
              <Box key={field}>
                <TextField
                  label="Add Skill *"
                  fullWidth
                  margin="normal"
                  value={exp.newSkill || ''}
                  onChange={(e) =>
                    props.handleChange(
                      { target: { name: 'newSkill', value: e.target.value } },
                      index,
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && exp.newSkill?.trim()) {
                      e.preventDefault();
                      const updatedSkills = [
                        ...(exp.skills || []),
                        exp.newSkill.trim(),
                      ];
                      props.handleChange(
                        { target: { name: 'skills', value: updatedSkills } },
                        index,
                      );
                      props.handleChange(
                        { target: { name: 'newSkill', value: '' } },
                        index,
                      );
                    }
                  }}
                />
                {/* Display added skills as chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {exp.skills?.map((skill, skillIndex) => (
                    <Chip
                      key={skillIndex}
                      label={skill}
                      onDelete={() => {
                        const updatedSkills = exp.skills.filter(
                          (_, i) => i !== skillIndex,
                        );
                        props.handleChange(
                          { target: { name: 'skills', value: updatedSkills } },
                          index,
                        );
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <TextField
                key={field}
                label={field
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                name={field}
                fullWidth
                margin="normal"
                onChange={(e) => props.handleChange(e, index)}
                value={exp[field] ?? ''}
                required={props.categories[2].required.includes(field)}
                disabled={field === 'end_Date' && exp.current}
                multiline={field === 'description'}
                minRows={field === 'description' ? 3 : undefined}
              />
            ),
          )}

          {/* Remove experience Entry (Disabled if only 1 entry remains) */}
          {props.formData.experience.length > 1 && (
            <Typography
              onClick={() => props.removeExperience('experience', index)}
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

      {/* Add Experience Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.addExperience('experience')}
          sx={{ mt: 2 }}
        >
          Add Experience
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          startIcon={
            loading ? (
              <CircularProgress size={20} sx={{ color: '#FFFDE7' }} />
            ) : (
              <SparkleIcon sx={{ color: '#FFFDE7' }} />
            )
          }
          sx={{
            mt: 2,
            ml: 2,
            background: 'linear-gradient(45deg, #00C6FF, #0072FF)',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '8px',
            padding: '8px 20px',
            letterSpacing: '0.8px',
            boxShadow: '0px 6px 15px rgba(0, 114, 255, 0.6)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(45deg, #0072FF, #00C6FF)',
              boxShadow: '0px 8px 20px rgba(0, 114, 255, 0.8)',
              transform: 'scale(1.05)',
            },
          }}
        >
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      </Box>
    </>
  );
};

Experience.propTypes = {
  formData: PropTypes.shape({
    experience: PropTypes.arrayOf(
      PropTypes.shape({
        // Define the expected properties inside each experience object
      }),
    ),
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      fields: PropTypes.arrayOf(PropTypes.object),
      required: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  handleChange: PropTypes.func.isRequired,
  removeExperience: PropTypes.func.isRequired,
  addExperience: PropTypes.func.isRequired,
};

export default Experience;
