import React, { useState } from 'react';
import PropTypes from 'prop-types'; // <-- Add this line
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAddData } from '../../../react-query/useFetchApis';
import { auth } from '../../../services/Authentication/firebase';

const smileys = [
  { value: 1, src: '/assets/images/11.png', label: 'Very Poor' },
  { value: 2, src: '/assets/images/22.png', label: 'Poor' },
  { value: 3, src: '/assets/images/33.png', label: 'Average' },
  { value: 4, src: '/assets/images/44.png', label: 'Happy' },
  { value: 5, src: '/assets/images/55.png', label: 'Very Happy' },
];

const HappinessIndex = ({ open, handleClose }) => {
  const [happinessScore, setHappinessScore] = useState(3);
  const [description, setDescription] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [submitError, setSubmitError] = useState(null);
  const user_id = auth.currentUser?.uid;

  const {
    mutate: submitHappiness,
    isLoading,
    error,
  } = useAddData('happiness-index', user_id ? `/happiness-index/add/${user_id}/` : null);

  const handleSubmit = () => {
    if (!user_id) {
      setSubmitError('User not authenticated. Please log in again.');
      return;
    }

    const data = {
      happiness_score: happinessScore,
      description: description,
    };

    setSubmitError(null);

    submitHappiness(data, {
      onSuccess: () => {
        handleClose();
        setHappinessScore(3);
        setDescription('');
      },
      onError: error => {
        setSubmitError(error.message || 'Failed to submit happiness index');
        console.error('Error submitting happiness index:', error);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          setSubmitError(null);
          handleClose();
        }
      }}
      fullWidth
      maxWidth="xs"
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: '#FFC300',
          borderRadius: '15px',
          padding: '10px',
          maxWidth: isMobile ? '90vw' : '400px',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        How happy do you feel today?
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', paddingBottom: 1 }}>
        {!user_id && (
          <div
            style={{
              color: 'red',
              backgroundColor: '#ffebee',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '16px',
            }}
          >
            Please log in to submit your happiness index.
          </div>
        )}

        <ToggleButtonGroup
          value={happinessScore}
          exclusive
          onChange={(event, newValue) => setHappinessScore(newValue || happinessScore)}
          sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}
          disabled={!user_id}
        >
          {smileys.map(({ value, src, label }) => (
            <ToggleButton
              key={value}
              value={value}
              sx={{
                border: 'none',
                padding: 0,
                '&.Mui-selected': { backgroundColor: 'transparent' },
                '&:hover': { backgroundColor: 'transparent' },
                opacity: !user_id ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  width: happinessScore === value ? 70 : 50,
                  height: happinessScore === value ? 70 : 50,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: happinessScore === value ? '0px 0px 10px rgba(0, 0, 0, 0.2)' : 'none',
                }}
              >
                <img
                  src={src}
                  alt={label}
                  style={{ width: '90%', height: '90%', borderRadius: '50%' }}
                />
              </div>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <TextField
          fullWidth
          label="Description (Optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          variant="outlined"
          margin="dense"
          disabled={!user_id}
          sx={{
            marginTop: 1,
            borderRadius: '20px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: '#fff',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', paddingBottom: 1, paddingTop: 0 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !user_id}
          sx={{
            backgroundColor: '#f76c2f',
            color: 'black',
            '&:hover': { backgroundColor: '#d95a26' },
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
      {(error || submitError) && (
        <div style={{ color: 'red', textAlign: 'center', padding: '0 16px 16px' }}>
          {error?.message || submitError}
        </div>
      )}
    </Dialog>
  );
};

// ✅ Add PropTypes for validation
HappinessIndex.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default HappinessIndex;
