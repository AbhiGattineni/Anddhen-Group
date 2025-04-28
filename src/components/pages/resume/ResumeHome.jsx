import React, { useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ResumeComponent from './ResumeComponent';
import axios from 'axios';
import { fetchAi } from './AISuggestions';

const ResumeHome = () => {
  const theme = useTheme();
  const [showResumeComponent, setShowResumeComponent] = useState(false);
  const [parsed, setParsed] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleGetStartedClick = () => {
    setShowResumeComponent(true);
  };

  // If `showResumeComponent` is true, render ResumeComponent, otherwise render welcome content
  if (showResumeComponent) {
    return <ResumeComponent resume_data={parsed} />;
  }

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);

      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/parse-resume/`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );

        const resume_data = await fetchAi(
          `Given the following resume text:

${res.data}

Extract the following fields in valid JSON format:

{{
  "personalInfo": {{
    "name": "",
    "email": "",
    "phone": "",
    "address": "",
    "gitHub_Link": "",
    "linkedIn_Link": "",
    "portfolio_Link": ""
  }},
  "education": [
    {{
      "college_Name": "",
      "degree": "",
      "field": "",
      "gpa_Score": "",
      "start_Date": "",
      "end_Date": "",
      "location": "",
      "current": false
    }}
  ],
  "experience": [
    {{
      "company_Name": "",
      "role": "",
      "location": "",
      "start_Date": "",
      "end_Date": "",
      "description": "",
      "skills": [],
      "newSkill": "",
      "current": false
    }}
  ],
  "projects": [
    {{
      "title": "",
      "project_Link": "",
      "description": ""
    }}
  ],
  "skills": ["", "", ""],
  "categorialSkills": {{
    "Languages": ["", "", ""]
  }}
}}
Note: In categorialSkills skills are added in categorially(like Languages, Frameworks, Tools, Databases, etc) anf for description analyze and complete relevant description
Only return valid JSON. Do not add explanations.`,
        );
        setParsed(resume_data);
        console.log(resume_data);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        my: 5,
        px: { xs: 2, md: 5 },
        width: '100%',
      }}
    >
      {/* Left Content - Resume Builder Text and Description */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 4, md: 0 },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          Get Started with Your Resume
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: theme.palette.text.secondary,
          }}
        >
          Choose from a variety of fixed, professional templates and let our
          AI-powered resume builder help you create a standout resume in
          minutes. Customize your details, optimize for the job you want, and
          let AI take care of the formatting and suggestions to make your resume
          shine.
        </Typography>

        {/* Button Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-start' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontSize: '1rem',
              padding: '10px 20px',
              borderRadius: '50px',
              textAlign: 'center',
              boxShadow: 3,
              width: { xs: '100%', sm: 'auto' },
            }}
            onClick={handleGetStartedClick}
          >
            Start Building
          </Button>

          <Button
            variant="outlined"
            component="label"
            sx={{
              fontSize: '1rem',
              padding: '10px 20px',
              borderRadius: '50px',
              textAlign: 'center',
              width: { xs: '100%', sm: 'auto' },
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            }}
          >
            Upload Resume
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              hidden
              onChange={handleResumeUpload}
            />
          </Button>
        </Box>

        {/* Description for Upload Button */}
        <Typography
          sx={{
            mt: 2,
            fontSize: { xs: '0.9rem', md: '1rem' },
            color: theme.palette.text.secondary,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Already have a resume? Upload your existing document, and our AI will
          help you refine and optimize it for the job you want. Supported file
          formats: PDF, DOC, DOCX.
        </Typography>
      </Box>

      {/* Right Side - Image of Sample Template */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          sx={{
            width: '80%',
            maxWidth: 500,
            borderRadius: '10px',
            boxShadow: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src="/assets/images/resume template.jpg"
            alt="Resume Template"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ResumeHome;
