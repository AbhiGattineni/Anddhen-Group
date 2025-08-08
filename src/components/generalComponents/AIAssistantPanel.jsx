import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';

const AIAssistantPanel = ({ onSend, messages, loading, onClearChat }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1, color: '#a259ff', fontWeight: 700 }}>
          AI Assistant
        </Typography>
        <Button
          onClick={onClearChat}
          size="small"
          variant="outlined"
          sx={{ color: '#a259ff', borderColor: '#a259ff', ml: 1, textTransform: 'none' }}
        >
          Clear Chat
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          background: 'transparent',
          mb: 2,
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-thumb': {
            background: '#333',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#a259ff' : '#181A1B',
              color: '#fff',
              borderRadius: 2,
              px: 2,
              py: 1,
              maxWidth: '80%',
              wordBreak: 'break-word',
              boxShadow: 2,
            }}
          >
            {msg.content}
          </Box>
        ))}
        <div ref={messagesEndRef} />
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <CircularProgress size={24} sx={{ color: '#a259ff' }} />
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 'auto' }}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your command..."
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          sx={{
            background: '#181A1B',
            borderRadius: 2,
            input: { color: '#fff' },
            textarea: { color: '#fff' },
          }}
          InputProps={{
            endAdornment: (
              <Button
                onClick={handleSend}
                variant="contained"
                sx={{ ml: 1, background: '#a259ff', color: '#fff', fontWeight: 700 }}
              >
                Send
              </Button>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

AIAssistantPanel.propTypes = {
  onSend: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool,
  onClearChat: PropTypes.func.isRequired,
};

export default AIAssistantPanel;
