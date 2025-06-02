import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  useMediaQuery,
} from '@mui/material';
import { useFetchData } from 'src/react-query/useFetchApis';

// Component for handling global filter
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <TextField
    value={globalFilter || ''}
    onChange={e => setGlobalFilter(e.target.value)}
    label="Search"
    variant="outlined"
    size="small"
    margin="normal"
    sx={{ marginBottom: '16px' }}
  />
);

GlobalFilter.propTypes = {
  globalFilter: PropTypes.string,
  setGlobalFilter: PropTypes.func.isRequired,
};

const FilterComponent = ({ filter, handleProgramChange, states }) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '16px',
      }}
    >
      <RadioGroup
        row
        value={filter.selectedProgram}
        onChange={handleProgramChange('selectedProgram')}
      >
        <FormControlLabel value="all" control={<Radio />} label="All" />
        <FormControlLabel value="ug" control={<Radio />} label="Undergraduate" />
        <FormControlLabel value="grad" control={<Radio />} label="Graduate" />
      </RadioGroup>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <TextField
          label="GRE Score"
          variant="outlined"
          size="small"
          type="number"
          value={filter.greScore}
          onChange={handleProgramChange('greScore')}
          fullWidth={isSmallScreen}
        />

        <TextField
          label="TOEFL Score"
          variant="outlined"
          size="small"
          type="number"
          value={filter.toeflScore}
          onChange={handleProgramChange('toeflScore')}
          fullWidth={isSmallScreen}
        />

        <TextField
          label="IELTS Score"
          variant="outlined"
          size="small"
          type="number"
          value={filter.ieltsScore}
          onChange={handleProgramChange('ieltsScore')}
          fullWidth={isSmallScreen}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <Select
          value={filter.collegeType}
          onChange={handleProgramChange('collegeType')}
          displayEmpty
          variant="outlined"
          size="small"
          fullWidth={isSmallScreen}
        >
          <MenuItem value="">
            <em>College Type</em>
          </MenuItem>
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
        </Select>

        <TextField
          label="Fall Deadline"
          variant="outlined"
          size="small"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filter.fallDeadline}
          onChange={handleProgramChange('fallDeadline')}
          fullWidth={isSmallScreen}
        />

        <TextField
          label="Spring Deadline"
          variant="outlined"
          size="small"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filter.springDeadline}
          onChange={handleProgramChange('springDeadline')}
          fullWidth={isSmallScreen}
        />
      </Box>

      <Select
        value={filter.state}
        onChange={handleProgramChange('state')}
        displayEmpty
        variant="outlined"
        size="small"
        fullWidth
      >
        <MenuItem value="">
          <em>Select State</em>
        </MenuItem>
        {states?.map(state => (
          <MenuItem key={state} value={state}>
            {state}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

FilterComponent.propTypes = {
  filter: PropTypes.shape({
    selectedProgram: PropTypes.string.isRequired,
    greScore: PropTypes.string.isRequired,
    toeflScore: PropTypes.string.isRequired,
    ieltsScore: PropTypes.string.isRequired,
    collegeType: PropTypes.string.isRequired,
    springDeadline: PropTypes.string.isRequired,
    fallDeadline: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }).isRequired,
  handleProgramChange: PropTypes.func.isRequired,
  states: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function Row({ row, filter }) {
  const [open, setOpen] = React.useState(false);
  const categorizedData = {
    'General Information': {
      'Website Link': row.website_link,
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'ug'
        ? {
            'International UG Link': row.international_UG_link,
            'Application UG Link': row.application_UG_link,
          }
        : {}),
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'grad'
        ? {
            'International Graduation Link': row.international_graduation_link,
            'Application Graduation Link': row.application_graduation_link,
          }
        : {}),
    },
    'Application Fees': {
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'ug'
        ? {
            'Application UG Fee': row.application_UG_fee,
            'Application UG Fee Link': row.application_UG_fee_link,
          }
        : {}),
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'grad'
        ? {
            'Application Graduation Fee': row.application_graduation_fee,
            'Application Graduation Fee Link': row.application_graduation_fee_link,
          }
        : {}),
    },
    'Standardized Test Scores': {
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'ug'
        ? {
            'TOEFL UG Score': row.toefl_UG_score,
            'TOEFL UG Score Link': row.toefl_UG_score_link,
            'IELTS UG Score': row.ielts_ug_score,
            'IELTS UG Score Link': row.ielts_ug_score_link,
          }
        : {}),
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'grad'
        ? {
            'TOEFL Graduation Score': row.toefl_graduation_score,
            'TOEFL Graduation Score Link': row.toefl_graduation_score_link,
            'IELTS Graduation Score': row.ielts_graduation_score,
            'IELTS Graduation Score Link': row.ielts_graduation_score_link,
          }
        : {}),
      'GRE Score': row.gre_score,
      'GRE Score Link': row.gre_score_link,
    },
    'Application Deadlines': {
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'ug'
        ? {
            'Fall Deadline UG': row.fall_deadline_UG,
            'Spring Deadline UG': row.spring_deadline_UG,
            'Spring Deadline UG Link': row.spring_deadline_UG_link,
            'Fall Deadline UG Link': row.fall_deadline_UG_link,
          }
        : {}),
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'grad'
        ? {
            'Fall Deadline Graduation': row.fall_deadline_graduation,
            'Fall Deadline Graduation Link': row.fall_deadline_graduation_link,
            'Spring Deadline Graduation': row.spring_deadline_graduation,
            'Spring Deadline Graduation Link': row.spring_deadline_graduation_link,
          }
        : {}),
    },
    'Contact Information': {
      'College Type': row.public_private,
      'College Email': row.college_email,
      'College Email Link': row.college_email_link,
      'College Phone': row.college_phone,
      'College Phone Link': row.college_phone_link,
      'International Students Affairs Email': row.international_person_email,
      'International Students Affairs Links': row.international_person_email_link,
      'College Location': row.state,
    },
    'Course Offerings': {
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'ug'
        ? {
            'UG Courses': row.UG_courses,
          }
        : {}),
      ...(filter.selectedProgram === 'all' || filter.selectedProgram === 'grad'
        ? {
            'Graduation Courses': row.graduation_courses,
          }
        : {}),
    },
  };
  return (
    <>
      <TableRow
        sx={{
          '& > *': { borderBottom: 'unset' },
          '&:hover': { backgroundColor: '#f5f5f5' },
        }}
      >
        <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
          {row.college_name}
        </TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              transition: 'transform 0.3s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {Object.entries(categorizedData).map(([category, details]) => (
                <Box key={category} sx={{ marginBottom: 2 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ position: 'relative', fontWeight: 'bold' }}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '5%',
                        height: '2px',
                        backgroundColor: '#f76c2d',
                      }}
                    />
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                  >
                    <Box
                      flex={1}
                      pr={1}
                      sx={{
                        display: { xs: 'block', md: 'flex' },
                        flexDirection: { md: 'column' },
                      }}
                    >
                      <ul
                        style={{
                          margin: 0,
                        }}
                      >
                        {Object.entries(details)
                          .slice(0, Math.ceil(Object.entries(details).length / 2))
                          .map(([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong>{' '}
                              {key.includes('Link') ? (
                                value ? (
                                  <a href={value} target="_blank" rel="noopener noreferrer">
                                    Link
                                  </a>
                                ) : (
                                  'No Link Available'
                                )
                              ) : (
                                value
                              )}
                            </li>
                          ))}
                      </ul>
                    </Box>
                    <Box
                      flex={1}
                      pl={1}
                      sx={{
                        display: { xs: 'block', md: 'flex' },
                        flexDirection: { md: 'column' },
                        p: 0,
                      }}
                    >
                      <ul>
                        {Object.entries(details)
                          .slice(Math.ceil(Object.entries(details).length / 2))
                          .map(([key, value]) => (
                            <li key={key}>
                              <strong>{key}:</strong>{' '}
                              {key.includes('Link') ? (
                                value ? (
                                  <a href={value} target="_blank" rel="noopener noreferrer">
                                    Link
                                  </a>
                                ) : (
                                  'No Link Available'
                                )
                              ) : (
                                value
                              )}
                            </li>
                          ))}
                      </ul>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    college_name: PropTypes.string.isRequired,
    website_link: PropTypes.string,
    international_UG_link: PropTypes.string,
    international_graduation_link: PropTypes.string,
    application_UG_link: PropTypes.string,
    application_graduation_link: PropTypes.string,
    application_UG_fee: PropTypes.string,
    application_graduation_fee: PropTypes.string,
    application_UG_fee_link: PropTypes.string,
    application_graduation_fee_link: PropTypes.string,
    gre_score: PropTypes.string,
    toefl_UG_score: PropTypes.string,
    toefl_graduation_score: PropTypes.string,
    ielts_ug_score: PropTypes.string,
    ielts_graduation_score: PropTypes.string,
    gre_score_link: PropTypes.string,
    toefl_UG_score_link: PropTypes.string,
    toefl_graduation_score_link: PropTypes.string,
    ielts_ug_score_link: PropTypes.string,
    ielts_graduation_score_link: PropTypes.string,
    fall_deadline_UG: PropTypes.string,
    fall_deadline_graduation: PropTypes.string,
    fall_deadline_graduation_link: PropTypes.string,
    spring_deadline_UG: PropTypes.string,
    spring_deadline_graduation: PropTypes.string,
    spring_deadline_graduation_link: PropTypes.string,
    spring_deadline_UG_link: PropTypes.string,
    fall_deadline_UG_link: PropTypes.string,
    public_private: PropTypes.string,
    college_email: PropTypes.string,
    college_email_link: PropTypes.string,
    college_phone: PropTypes.string,
    college_phone_link: PropTypes.string,
    international_person_email: PropTypes.string,
    international_person_email_link: PropTypes.string,
    UG_courses: PropTypes.string,
    graduation_courses: PropTypes.string,
    state: PropTypes.string,
  }).isRequired,
  filter: PropTypes.shape({
    selectedProgram: PropTypes.string.isRequired,
    greScore: PropTypes.string.isRequired,
    toeflScore: PropTypes.string.isRequired,
    ieltsScore: PropTypes.string.isRequired,
    collegeType: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }).isRequired,
};
export const ViewCollege = () => {
  const { data = [], isLoading, error } = useFetchData('colleges', `/colleges/all/`);
  const [globalFilter, setGlobalFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalStates, setTotalStates] = useState([]);

  const [filter, setFilter] = useState({
    selectedProgram: 'all',
    greScore: '',
    toeflScore: '',
    ieltsScore: '',
    collegeType: '',
    fallDeadline: '',
    springDeadline: '',
    state: '',
  });
  const [editFilter, setEditFilter] = useState({ ...filter });

  useEffect(() => {
    if (data.length > 0) {
      const seenStates = new Set();
      const orderedUniqueStates = [];

      data.forEach(college => {
        if (college.state && !seenStates.has(college.state)) {
          seenStates.add(college.state);
          orderedUniqueStates.push(college.state);
        }
      });

      setTotalStates(orderedUniqueStates);
    }
  }, [data]);

  const handleProgramChange = key => e => {
    setEditFilter(prevFilter => ({ ...prevFilter, [key]: e.target.value }));
  };

  const applyFilters = () => {
    setFilter(editFilter);
  };

  const resetFilters = () => {
    const initialFilter = {
      selectedProgram: 'all',
      greScore: '',
      toeflScore: '',
      ieltsScore: '',
      collegeType: '',
      fallDeadline: '',
      springDeadline: '',
      state: '',
    };
    setGlobalFilter('');
    setEditFilter(initialFilter);
    setFilter(initialFilter);
  };

  const filteredData = useMemo(() => {
    return (
      data?.filter(college => {
        const matchesCollege = college.college_name
          ? college.college_name.toLowerCase().includes(globalFilter.toLowerCase())
          : false;

        const matchesGRE =
          !filter.greScore || parseInt(college.gre_score, 10) <= parseInt(filter.greScore, 10);

        const matchesTOEFL =
          !filter.toeflScore ||
          Math.min(
            parseInt(college.toefl_graduation_score, 10) || Infinity,
            parseInt(college.toefl_UG_score, 10) || Infinity
          ) <= parseInt(filter.toeflScore, 10);

        const matchesIELTS =
          !filter.ieltsScore ||
          Math.min(
            parseInt(college.ielts_graduation_score, 10) || Infinity,
            parseInt(college.ielts_ug_score, 10) || Infinity
          ) <= parseInt(filter.ieltsScore, 10);

        const matchesCollegeType =
          !filter.collegeType ||
          college.public_private?.toLowerCase() === filter.collegeType.toLowerCase();

        const matchesState =
          !filter.state ||
          (college.state && college.state.toLowerCase() === filter.state.toLowerCase());

        const minFallDeadline = new Date(
          Math.min(
            new Date(college.fall_deadline_UG || '9999-12-31'),
            new Date(college.fall_deadline_graduation || '9999-12-31')
          )
        );
        const minSpringDeadline = new Date(
          Math.min(
            new Date(college.spring_deadline_UG || '9999-12-31'),
            new Date(college.spring_deadline_graduation || '9999-12-31')
          )
        );
        const selectedFallDeadline = filter.fallDeadline
          ? new Date(filter.fallDeadline)
          : new Date('9999-12-31');
        const selectedSpringDeadline = filter.springDeadline
          ? new Date(filter.springDeadline)
          : new Date('9999-12-31');

        const matchesFallDeadline = minFallDeadline <= selectedFallDeadline;
        const matchesSpringDeadline = minSpringDeadline <= selectedSpringDeadline;

        return (
          matchesCollege &&
          matchesGRE &&
          matchesTOEFL &&
          matchesIELTS &&
          matchesCollegeType &&
          matchesState &&
          matchesFallDeadline &&
          matchesSpringDeadline
        );
      }) || []
    );
  }, [data, filter, globalFilter]);

  const paginatedData = useMemo(() => {
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Handle network errors
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', padding: '16px', color: 'error.main' }}>
        <Typography variant="h6">
          Error: {error.message || 'Failed to fetch data. Please try again later.'}
        </Typography>
      </Box>
    );
  }

  // Handle no records
  if (!isLoading && filteredData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', padding: '16px' }}>
        <Typography variant="h6">No records to display.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <FilterComponent
        filter={editFilter}
        handleProgramChange={handleProgramChange}
        states={totalStates}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={applyFilters}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={e => (e.target.style.backgroundColor = '#115293')}
          onMouseOut={e => (e.target.style.backgroundColor = '#1976d2')}
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e0e0e0',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={e => (e.target.style.backgroundColor = '#bdbdbd')}
          onMouseOut={e => (e.target.style.backgroundColor = '#e0e0e0')}
        >
          Reset Filters
        </button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <TableContainer component={Paper}>
          <Box p={3} textAlign="center">
            <Typography color="error">
              Network error: Unable to load data. Please check your internet connection.
            </Typography>
          </Box>
        </TableContainer>
      ) : filteredData.length === 0 ? (
        <TableContainer component={Paper}>
          <Box p={3} textAlign="center">
            <Typography>No fields to show matching your criteria.</Typography>
          </Box>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {paginatedData.map(row => (
                <Row key={row.id} row={row} filter={filter} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!isLoading && !error && filteredData.length > 0 && (
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={event => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      )}
    </Box>
  );
};
