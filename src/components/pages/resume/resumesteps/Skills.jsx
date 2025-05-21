import { Box, Button, Chip, CircularProgress, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SparkleIcon from '@mui/icons-material/AutoAwesome';
import { fetchAi } from '../AISuggestions';

const Skills = props => {
  const [loading, setLoading] = useState(false);
  const handleGenerate = async () => {
    const { formData, setFormData } = props;

    if (!formData?.skills || formData.skills.length === 0) return;
    setLoading(true);

    try {
      const categorizationResponse = await fetchAi(
        `Categorize the following skills into relevant groups such as Languages, Frameworks, Tools, Databases, etc(related category). Provide the response in JSON format without additional explanation:
        ${JSON.stringify(formData.skills)}`
      );
      // const categorizationResponse = JSON.stringify({
      //   Languages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
      //   Frameworks: ['React', 'Angular', 'Django', 'Express'],
      //   Tools: ['Git', 'Docker', 'Webpack', 'ESLint'],
      //   Databases: ['MySQL', 'MongoDB', 'PostgreSQL'],
      // });
      setFormData(prev => ({
        ...prev,
        categorialSkills: JSON.parse(categorizationResponse),
      }));
    } catch (error) {
      console.error('Error generating descriptions:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  return (
    <>
      <TextField
        label="Add Skill"
        fullWidth
        value={props.skillInput}
        onChange={e => props.setSkillInput(e.target.value)}
        margin="normal"
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={props.handleAddSkill} variant="contained" sx={{ mt: 1 }}>
          Add Skill
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

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {props.formData.skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            onDelete={() => props.handleRemoveSkill(skill)}
            variant="outlined"
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              fontWeight: 500,
            }}
          />
        ))}
      </Box>
    </>
  );
};

Skills.propTypes = {
  skillInput: PropTypes.string.isRequired,
  setSkillInput: PropTypes.func.isRequired,
  handleAddSkill: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    skills: PropTypes.arrayOf(PropTypes.string),
    categorizedSkills: PropTypes.shape({}),
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  handleRemoveSkill: PropTypes.func.isRequired,
};

export default Skills;
