import React, { useMemo, useState } from 'react';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  // Paper,
  Typography,
  useMediaQuery,
  // Divider,
  Chip,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// import { resumeTemplate } from './resumeTemplate';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// import { Document, Page, Text, View, Link } from '@react-pdf/renderer';
import ResumePreview from './ResumePreview';

const categories = [
  {
    id: 'personalInfo',
    label: 'Personal Info',
    fields: [
      'name',
      'email',
      'phone',
      'address',
      'linkedIn',
      'gitHub',
      'portfolio',
    ],
    required: ['name', 'email', 'phone', 'address'],
  },
  {
    id: 'education',
    label: 'Education',
    fields: [
      'collegeName',
      'location',
      'degree',
      'field',
      'gpaScore',
      'startDate',
      'endDate',
      'current',
    ],
    required: ['collegeName', 'location', 'degree', 'field', 'startDate'],
  },
  {
    id: 'skills',
    label: 'Technical Skills',
    fields: [],
    required: [],
  },
];

const ResumeComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({ education: [{}], skills: [] });
  const [skillInput, setSkillInput] = useState('');
  const suggestedSkills = [
    'React',
    'JavaScript',
    'Python',
    'Django',
    'SQL',
    'Node.js',
    'TypeScript',
    'AWS',
    'Git',
    'GraphQL',
  ];

  const handleAddSuggestedSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const memoizedResume = useMemo(
    () => <ResumePreview formData={formData} />,
    [formData],
  );

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (e, index = null) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      const categoryId = categories[activeStep].id;
      let values = null;

      if (activeStep === 0) {
        values = {
          ...prevData[categoryId],
          [name]: type === 'checkbox' ? checked : value,
        };
      } else if (activeStep === 1) {
        const existingArray = Array.isArray(prevData[categoryId])
          ? [...prevData[categoryId]]
          : [];

        if (index !== null) {
          existingArray[index] = {
            ...existingArray[index],
            [name]: type === 'checkbox' ? checked : value,
          };

          // If "current" is checked for this entry, set "endDate" to "Present"
          if (name === 'current') {
            if (checked) {
              existingArray[index].endDate = 'Present';
            } else {
              existingArray[index].endDate = ''; // Allow the user to enter an end date again
            }
          }
        }

        values = existingArray;
      } else if (activeStep === 2) {
        values = [...prevData[categoryId], value];
      }

      return { ...prevData, [categoryId]: values };
    });
  };

  const addEducation = () => {
    setFormData((prevData) => ({
      ...prevData,
      education: [...(prevData.education || []), {}], // Add new empty education entry
    }));
  };

  const removeEducation = (index) => {
    setFormData((prevData) => {
      if (prevData.education.length === 1) return prevData;

      return {
        ...prevData,
        education: prevData.education.filter((_, i) => i !== index),
      };
    });
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  console.log('active', activeStep);

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  console.log(formData);

  const isNextDisabled = () => {
    const categoryId = categories[activeStep].id; // Get current category ID
    const requiredFields = categories[activeStep].required || [];

    if (activeStep === 0) {
      // Personal Info: Check required fields in an object
      return requiredFields.some((field) => !formData[categoryId]?.[field]);
    }

    if (activeStep === 1) {
      // Education: Ensure at least one entry exists & all required fields are filled
      return (
        !Array.isArray(formData[categoryId]) || // Check if education array exists
        formData[categoryId].length === 0 || // Ensure at least one entry
        formData[categoryId].some(
          (edu) => requiredFields.some((field) => !edu[field]), // Ensure all required fields are filled
        )
      );
    }

    return false; // Default to not disabled
  };

  return (
    <Box sx={{ width: '90%', margin: 'auto', my: 4 }}>
      <Grid container spacing={3} direction={isSmallScreen ? 'column' : 'row'}>
        {/* Left Panel - Form */}
        <Grid item xs={12} md={6}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {categories.map((category) => (
              <Step key={category.label}>
                <StepLabel>{category.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 2 && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: '12px',
                background: 'rgba(0, 159, 253, 0.2)', // Lighter background
                border: '3px solid transparent', // Transparent border
                backgroundImage:
                  'linear-gradient(135deg, rgba(0, 160, 253, 0), rgba(42, 42, 114, 0)), linear-gradient(135deg,rgba(42, 42, 114, 0.8),rgba(0, 160, 253, 0.7))', // Layered background
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box', // Ensures the border has the gradient
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'left',
                }}
              >
                {suggestedSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onClick={() => handleAddSuggestedSkill(skill)}
                    variant="outlined"
                    sx={{
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      color: '#fff',
                      fontWeight: '500',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(8px)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            {/* Step 0: Personal Info */}
            {activeStep === 0 &&
              categories[activeStep].fields.map((field) => (
                <TextField
                  key={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  value={formData.personalInfo?.[field] ?? ''}
                  required={categories[activeStep].required.includes(field)}
                />
              ))}

            {/* Step 1: Education */}
            {activeStep === 1 && (
              <>
                {formData.education?.map((edu, index) => (
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
                    {categories[activeStep].fields.map((field) =>
                      field === 'current' ? (
                        <FormControlLabel
                          key={field}
                          control={
                            <Checkbox
                              name={field}
                              checked={edu[field] || false}
                              onChange={(e) => handleChange(e, index)}
                            />
                          }
                          label="Currently Studying"
                        />
                      ) : (
                        <TextField
                          key={field}
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          name={field}
                          fullWidth
                          margin="normal"
                          onChange={(e) => handleChange(e, index)}
                          value={edu[field] ?? ''}
                          required={categories[activeStep].required.includes(
                            field,
                          )}
                          disabled={field === 'endDate' && edu.current}
                        />
                      ),
                    )}

                    {/* Remove Education Entry (Disabled if only 1 entry remains) */}
                    {formData.education.length > 1 && (
                      <Typography
                        onClick={() => removeEducation(index)}
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
                  onClick={addEducation}
                  sx={{ mt: 2 }}
                >
                  Add Education
                </Button>
              </>
            )}

            {/* Step 2: Skills */}
            {activeStep === 2 && (
              <>
                <TextField
                  label="Add Skill"
                  fullWidth
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  margin="normal"
                />
                <Button
                  onClick={handleAddSkill}
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  Add Skill
                </Button>

                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
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
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="contained"
            >
              Previous
            </Button>
            {activeStep < categories.length - 1 ? (
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={isNextDisabled()}
              >
                Next
              </Button>
            ) : (
              <PDFDownloadLink
                document={<ResumePreview formData={formData} />}
                fileName={`${formData.personalInfo.name}_resume.pdf`}
              >
                {({ loading }) => (
                  <Button variant="contained" color="success">
                    {loading ? 'Generating PDF...' : 'Download as PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </Box>
        </Grid>

        {/* Right Panel - Resume Preview */}
        <Grid item xs={12} md={6}>
          <PDFViewer width="100%" height="500">
            {memoizedResume}
          </PDFViewer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumeComponent;
