import React, { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ConfirmationDialog from 'src/components/organisms/Modal/ConfirmationDialog';

const ExtensionView = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newWord, setNewWord] = useState('');
  const [newColor, setNewColor] = useState('');
  const [colorError, setColorError] = useState('');
  const [wordError, setWordError] = useState('');
  const [saving, setSaving] = useState(false);

  // Confirmation dialog states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchDefaultWords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/default-words/`);
      const data = await response.json();
      setWords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching default words:', error);
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultWords();
  }, []);

  const handleOpen = (index = null) => {
    if (index !== null) {
      setNewWord(words[index].word);
      setNewColor(words[index].color);
      setEditIndex(index);
    } else {
      setNewWord('');
      setNewColor('');
      setEditIndex(null);
    }
    setColorError('');
    setWordError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewWord('');
    setNewColor('');
    setColorError('');
    setWordError('');
    setEditIndex(null);
  };

  const isValidHex = hex => /^#([0-9A-F]{6})$/i.test(hex);

  const sendFullDataToBackend = async updatedWords => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/default-words/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWords),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setWords(Array.isArray(data) ? data : updatedWords);
    } catch (error) {
      console.error('Error syncing words:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!newWord.trim()) {
      setWordError('Word cannot be empty');
      return;
    }
    if (!isValidHex(newColor)) {
      setColorError('Please enter a valid hex color code (e.g. #ff0000)');
      return;
    }

    const trimmedWord = newWord.trim();
    const trimmedColor = newColor.trim();

    let updatedWords;
    if (editIndex !== null) {
      updatedWords = words.map((w, i) =>
        i === editIndex ? { word: trimmedWord, color: trimmedColor } : w
      );
    } else {
      updatedWords = [...words, { word: trimmedWord, color: trimmedColor }];
    }

    await sendFullDataToBackend(updatedWords);
    handleClose();
  };

  const confirmDelete = index => {
    setDeleteIndex(index);
    setShowConfirmation(true);
  };

  const handleDeleteLink = async () => {
    setDeleteLoading(true);
    const updatedWords = words.filter((_, i) => i !== deleteIndex);
    try {
      await sendFullDataToBackend(updatedWords);
      setShowConfirmation(false);
    } catch (error) {
      // optionally handle error here
    } finally {
      setDeleteLoading(false);
      setDeleteIndex(null);
    }
  };

  const colorSuggestions = [
    { name: 'Red', hex: '#ff0000' },
    { name: 'Orange', hex: '#ffa500' },
    { name: 'Green', hex: '#00ff00' },
    { name: 'Thick Orange', hex: '#ff8c00' }, // New color
  ];

  const getCategoryByColor = color => {
    switch (color.toLowerCase()) {
      case '#ff8c00':
        return 'STAFFING';
      case '#ffa500':
        return 'CONSULTING';
      case '#ff0000':
        return 'FILTER';
      case '#00ff00':
        return 'CHECK IN';
      default:
        return 'OTHER';
    }
  };

  const categorizedWords = words.reduce((acc, wordObj) => {
    const category = getCategoryByColor(wordObj.color);
    if (!acc[category]) acc[category] = [];
    acc[category].push(wordObj);
    return acc;
  }, {});

  return (
    <div className="container mt-5">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          🎯 Highlighted Words
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()} disabled={saving}>
          + Add Word
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {Object.keys(categorizedWords).length > 0 ? (
            Object.keys(categorizedWords).map(category => (
              <Box key={category} mb={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {category}
                </Typography>
                <div className="row">
                  {categorizedWords[category].map((item, index) => (
                    <div key={`${item.word}-${index}`} className="col-md-4 mb-4">
                      <div
                        className="shadow-sm p-3 rounded d-flex justify-content-between align-items-center"
                        style={{
                          backgroundColor: item.color,
                          color: '#fff',
                          fontWeight: 500,
                          borderRadius: '12px',
                          minHeight: '70px',
                        }}
                      >
                        <span>{item.word}</span>
                        <Box>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() =>
                                handleOpen(
                                  words.findIndex(
                                    w => w.word === item.word && w.color === item.color
                                  )
                                )
                              }
                              size="small"
                              disabled={saving}
                              sx={{ color: '#fff' }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() =>
                                confirmDelete(
                                  words.findIndex(
                                    w => w.word === item.word && w.color === item.color
                                  )
                                )
                              }
                              size="small"
                              disabled={saving}
                              sx={{ color: '#fff' }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </div>
                    </div>
                  ))}
                </div>
              </Box>
            ))
          ) : (
            <Typography>No words found.</Typography>
          )}
        </>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? 'Edit Word' : 'Add New Word'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Word"
            fullWidth
            margin="dense"
            value={newWord}
            onChange={e => setNewWord(e.target.value)}
            error={!!wordError}
            helperText={wordError}
            disabled={saving}
          />
          <TextField
            label="Hex Color Code (e.g. #ff0000)"
            fullWidth
            margin="dense"
            value={newColor}
            onChange={e => setNewColor(e.target.value)}
            error={!!colorError}
            helperText={colorError}
            disabled={saving}
          />

          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Suggested Colors:
            </Typography>
            {colorSuggestions.map(color => (
              <Chip
                key={color.hex}
                label={`${color.name} (${color.hex})`}
                onClick={() => setNewColor(color.hex)}
                style={{
                  backgroundColor: color.hex,
                  color: '#fff',
                  marginRight: 8,
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
                disabled={saving}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        title="Confirmation"
        show={showConfirmation}
        isLoading={deleteLoading}
        message="Are you sure you want to delete this word?"
        onConfirm={handleDeleteLink}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
};

export default ExtensionView;
