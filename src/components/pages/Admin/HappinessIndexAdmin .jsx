import React from 'react';
import { useFetchData } from '../../../react-query/useFetchApis'; // Adjust the import based on your project structure
import {
  CircularProgress,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const HappinessIndexList = () => {
  const { data, isLoading, error } = useFetchData(
    'happinessIndex',
    '/happiness-index/',
  );

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Alert severity="error">Failed to load happiness indexes.</Alert>;
  if (!data || data.length === 0)
    return <Alert severity="info">No happiness index records found.</Alert>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Employee Happiness Index
      </Typography>
      <List>
        {data.map((index) => (
          <ListItem key={index.id}>
            <ListItemText
              primary={`Employee: ${index.employee_name} (Score: ${index.score})`}
              secondary={index.description || 'No additional comments'}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default HappinessIndexList;
