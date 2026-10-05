import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Fade,
  Alert,
  Grid,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { sendEmail } from '../templates/emailService';
import { subscribeProducts, reportIssue } from 'src/services/jira/jiraBoard';
import './Home.css';

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  email: '',
  message: '',
  company: '',
  product: '',
  issueType: 'bug',
  priority: 'medium',
  title: '',
};

// Customer-facing labels -> Jira board ticket types / priorities.
const ISSUE_TYPES = [
  { value: 'bug', label: 'Bug / something is broken' },
  { value: 'story', label: 'Feature request' },
  { value: 'task', label: 'Question / support' },
];
const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'highest', label: 'Urgent — blocking our work' },
];

const inputSx = { borderRadius: '10px', fontSize: '0.95rem' };

function Contact() {
  const [mode, setMode] = useState('enquiry');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState([]);

  // Products/clients are managed under Roles & Access -> Products.
  useEffect(() => subscribeProducts(setProducts), []);
  const activeProducts = useMemo(() => products.filter(p => p.active !== false), [products]);
  const isIssue = mode === 'issue' && activeProducts.length > 0;

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    if (!formData.phone) {
      if (!isIssue) newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    if (isIssue) {
      if (!formData.product) newErrors.product = 'Choose the product or client';
      if (!formData.title.trim()) newErrors.title = 'Give the issue a short title';
    }

    if (!formData.message) {
      newErrors.message = isIssue ? 'Describe the issue' : 'Message is required';
    } else if (formData.message.length < 5) {
      newErrors.message = 'Message is too short';
    }
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (isIssue) {
        const product = activeProducts.find(p => p.id === formData.product)?.name || '';
        const key = await reportIssue({
          product,
          type: formData.issueType,
          priority: formData.priority,
          title: formData.title.trim().slice(0, 200),
          description: formData.message.trim().slice(0, 5000),
          contact: {
            name: formData.fullName.trim().slice(0, 100),
            email: formData.email.trim().slice(0, 200),
            phone: formData.phone.trim().slice(0, 20),
            company: formData.company.trim().slice(0, 100),
          },
        });
        sendEmail('Issue Report', {
          ticket: key,
          product,
          type: ISSUE_TYPES.find(t => t.value === formData.issueType)?.label,
          priority: PRIORITIES.find(p => p.value === formData.priority)?.label,
          title: formData.title,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          description: formData.message,
        });
        setToast({
          type: 'success',
          text: `Thanks! Your issue was logged as ${key}. Our team will pick it up shortly — quote ${key} if you contact us about it.`,
        });
      } else {
        await sendEmail('Contact Us Form', {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        });
        setToast({ type: 'success', text: 'Your message has been sent successfully!' });
      }
      setFormData(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      setToast({ type: 'error', text: 'Something went wrong, please try again!' });
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (id, value) => {
    setFormData(prevData => ({ ...prevData, [id]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [id]: '' }));
    if (toast.text) setToast({ type: '', text: '' });
  };

  const handleChange = e => setField(e.target.id, e.target.value);

  const switchMode = (_e, next) => {
    if (!next) return;
    setMode(next);
    setErrors({});
    setToast({ type: '', text: '' });
  };

  const field = (id, label, { hint, ...extra } = {}) => (
    <TextField
      fullWidth
      id={id}
      label={label}
      variant="outlined"
      value={formData[id]}
      onChange={handleChange}
      sx={{ mb: 2.5 }}
      InputProps={{ sx: inputSx }}
      {...extra}
      error={!!errors[id]}
      helperText={errors[id] || hint}
    />
  );

  const select = (id, label, options) => (
    <TextField
      select
      fullWidth
      id={id}
      label={label}
      value={formData[id]}
      onChange={e => setField(id, e.target.value)}
      error={!!errors[id]}
      helperText={errors[id]}
      sx={{ mb: 2.5 }}
      InputProps={{ sx: inputSx }}
    >
      {options.map(o => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-intro-section">
        <Container maxWidth="lg">
          <Fade in timeout={800}>
            <Box className="hero-intro-content" sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  mb: 2.5,
                  color: '#1a1a1a',
                  letterSpacing: '-0.03em',
                }}
              >
                Contact Us
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  color: '#666',
                  lineHeight: 1.7,
                  maxWidth: '700px',
                  mx: 'auto',
                }}
              >
                Get in touch with us. We&apos;d love to hear from you and answer any questions you
                may have.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Fade in timeout={1000}>
                <Card
                  className="cta-card-modern"
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: '16px',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 3,
                        textAlign: 'center',
                        fontSize: { xs: '1.35rem', md: '1.5rem' },
                      }}
                    >
                      {isIssue ? 'Report an Issue' : 'Send us a Message'}
                    </Typography>
                    {activeProducts.length > 0 && (
                      <ToggleButtonGroup
                        value={mode}
                        exclusive
                        fullWidth
                        onChange={switchMode}
                        color="primary"
                        sx={{ mb: 3 }}
                      >
                        <ToggleButton
                          value="enquiry"
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          General enquiry
                        </ToggleButton>
                        <ToggleButton value="issue" sx={{ textTransform: 'none', fontWeight: 600 }}>
                          Report an issue
                        </ToggleButton>
                      </ToggleButtonGroup>
                    )}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                      {isIssue &&
                        select(
                          'product',
                          'Product / Client',
                          activeProducts.map(p => ({ value: p.id, label: p.name }))
                        )}
                      {field('fullName', 'Full Name')}
                      {field('email', 'Email Address', { type: 'email' })}
                      {field('phone', isIssue ? 'Phone Number (optional)' : 'Phone Number', {
                        type: 'tel',
                      })}
                      {isIssue && field('company', 'Company (optional)')}
                      {isIssue && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            {select('issueType', 'Issue type', ISSUE_TYPES)}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {select('priority', 'Priority', PRIORITIES)}
                          </Grid>
                        </Grid>
                      )}
                      {isIssue && field('title', 'Issue title', { inputProps: { maxLength: 200 } })}
                      {field('message', isIssue ? 'Describe the issue' : 'Message', {
                        multiline: true,
                        rows: 5,
                        hint: isIssue
                          ? 'What happened, what you expected, and steps to reproduce it.'
                          : undefined,
                      })}
                      {toast.text && (
                        <Alert severity={toast.type || 'info'} sx={{ mb: 3, borderRadius: '12px' }}>
                          {toast.text}
                        </Alert>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        endIcon={<Send />}
                        className="primary-cta-btn"
                        disabled={submitting}
                        sx={{
                          py: 1.25,
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: '10px',
                          mt: 2,
                        }}
                      >
                        {submitting ? 'Sending…' : isIssue ? 'Submit Issue' : 'Send Message'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </section>
    </div>
  );
}

export default Contact;
