import React, { useMemo, useState } from 'react';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  useMediaQuery,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import ResumePreview from './ResumePreview';
import { fetchAi } from './AISuggestions';
import PersonalInfo from './resumesteps/PersonalInfo';
import Education from './resumesteps/Education';
import Experience from './resumesteps/Experience';
import Skills from './resumesteps/Skills';
import { categories } from 'src/dataconfig';
import Projects from './resumesteps/Projects';
import Additional from './resumesteps/Additional';

const ResumeComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    education: [{}],
    experience: [{}],
    projects: [{}],
    skills: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [suggestedSkills, setSuggestedSkills] = useState([]);

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

  const handleNext = async () => {
    if (activeStep === 3 && suggestedSkills?.length === 0) {
      const experienceDescriptions = formData.experience
        ?.map((exp) => exp.description)
        .filter(Boolean)
        .join(', ');

      const projectDescriptions = formData.projects
        ?.map((proj) => proj.description)
        .filter(Boolean)
        .join(', ');

      try {
        const skills = await fetchAi(
          `Give some suggested skill languages (top 10) for the user based on the experience: ${experienceDescriptions}, and projects: ${projectDescriptions}. Only give skills as numbered points without any description.`,
        );

        const skillList = skills
          .split('\n')
          .map((skill) => skill.replace(/^\d+\.\s*/, '').trim());

        setSuggestedSkills(skillList);
      } catch (error) {
        console.error('Error fetching AI skills:', error);
      }
    }

    setActiveStep((prev) => prev + 1);
  };

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
      } else if (activeStep === 1 || activeStep === 2 || activeStep === 3) {
        const existingArray = Array.isArray(prevData[categoryId])
          ? [...prevData[categoryId]]
          : [];

        if (index !== null) {
          existingArray[index] = {
            ...existingArray[index],
            [name]: type === 'checkbox' ? checked : value,
          };

          // If "current" is checked for this entry, set "end_Date" to "Present"
          if (name === 'current') {
            if (checked) {
              existingArray[index].end_Date = 'Present';
            } else {
              existingArray[index].end_Date = ''; // Allow the user to enter an end date again
            }
          }
        }
        values = existingArray;
      } else if (activeStep === 4) {
        values = [...prevData[categoryId], value];
      }
      return { ...prevData, [categoryId]: values };
    });
  };

  const addFieldEntry = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [...(prevData[field] || []), {}], // Add a new empty entry to the specified field
    }));
  };

  const removeFieldEntry = (field, index) => {
    setFormData((prevData) => {
      if (prevData[field].length === 1) return prevData; // Prevent removing the last entry

      return {
        ...prevData,
        [field]: prevData[field].filter((_, i) => i !== index),
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

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addAdditional = () => {
    setFormData((prevData) => {
      const categoryId = categories[activeStep].id;
      const existingArray = Array.isArray(prevData[categoryId])
        ? [...prevData[categoryId]]
        : [];

      existingArray.push({ section_Name: '', entries: [] }); // Add a new section

      return { ...prevData, [categoryId]: existingArray };
    });
  };

  const removeAdditional = (sectionIndex) => {
    setFormData((prevData) => {
      const categoryId = categories[activeStep].id;
      return {
        ...prevData,
        [categoryId]: prevData[categoryId].filter((_, i) => i !== sectionIndex),
      };
    });
  };

  const isNextDisabled = () => {
    const categoryId = categories[activeStep].id; // Get current category ID
    const requiredFields = categories[activeStep].required || [];

    if (activeStep === 0) {
      // Personal Info: Check required fields in an object
      return requiredFields.some((field) => !formData[categoryId]?.[field]);
    }

    if (activeStep === 1 || activeStep === 2 || activeStep === 3) {
      return (
        !Array.isArray(formData[categoryId]) || // Check if education array exists
        formData[categoryId].length === 0 || // Ensure at least one entry
        formData[categoryId].some(
          (step) => requiredFields.some((field) => !step[field]), // Ensure all required fields are filled
        )
      );
    }

    if (activeStep === 4) {
      return !('categorialSkills' in formData);
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

          {activeStep === 4 && (
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
            {activeStep === 0 && (
              <PersonalInfo
                categories={categories}
                handleChange={handleChange}
                formData={formData}
              />
            )}

            {/* Step 1: Education */}
            {activeStep === 1 && (
              <Education
                categories={categories}
                handleChange={handleChange}
                formData={formData}
                removeEducation={removeFieldEntry}
                addEducation={addFieldEntry}
              />
            )}

            {/* Step 1: Experience */}
            {activeStep === 2 && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'right',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'gray',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      margin: 2,
                      fontStyle: 'italic',
                      display: 'inline-block',
                    }}
                    onClick={() => setActiveStep((prev) => prev + 1)}
                  >
                    Skip Experience(if no experience)
                  </Typography>
                </Box>
                <Experience
                  categories={categories}
                  handleChange={handleChange}
                  formData={formData}
                  removeExperience={removeFieldEntry}
                  addExperience={addFieldEntry}
                />
              </>
            )}

            {/* Step 1: Education */}
            {activeStep === 3 && (
              <Projects
                categories={categories}
                handleChange={handleChange}
                formData={formData}
                removeProjects={removeFieldEntry}
                addProjects={addFieldEntry}
              />
            )}

            {/* Step 2: Skills */}
            {activeStep === 4 && (
              <Skills
                skillInput={skillInput}
                setSkillInput={setSkillInput}
                handleAddSkill={handleAddSkill}
                formData={formData}
                handleRemoveSkill={handleRemoveSkill}
                setFormData={setFormData}
              />
            )}

            {activeStep === 5 && (
              <Additional
                categories={categories}
                formData={formData}
                removeAdditional={removeAdditional}
                addAdditional={addAdditional}
                setFormData={setFormData}
              />
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
