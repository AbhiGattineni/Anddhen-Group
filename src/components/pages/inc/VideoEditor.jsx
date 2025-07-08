import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  Tooltip,
  Button,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MicIcon from '@mui/icons-material/Mic';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
// import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';

const SIDEBAR_TOOLS = [
  { label: 'Uploads', icon: <UploadFileIcon /> },
  { label: 'Text', icon: <TextFormatIcon /> },
  { label: 'Captions', icon: <SubtitlesIcon /> },
  { label: 'AI', icon: <AutoAwesomeIcon /> },
  { label: 'Record', icon: <MicIcon /> },
  { label: 'Videos', icon: <VideoLibraryIcon /> },
  { label: 'Audios', icon: <AudiotrackIcon /> },
  { label: 'Photos', icon: <PhotoLibraryIcon /> },
  { label: 'Subtitles', icon: <SubtitlesIcon /> },
];

const RESOLUTIONS = [
  { label: 'Reels', width: 1080, height: 1920 },
  { label: 'Shorts', width: 1080, height: 1920 },
  { label: 'YouTube', width: 1920, height: 1080 },
  { label: 'Custom', width: null, height: null },
];

const TRACK_COLORS = {
  video: '#a259ff',
  audio: '#43a047',
  subtitles: '#2196f3',
};
const TRACK_ICONS = {
  video: <VideoLibraryIcon sx={{ fontSize: 20, mr: 1 }} />,
  audio: <MusicNoteIcon sx={{ fontSize: 20, mr: 1 }} />,
  subtitles: <SubtitlesIcon sx={{ fontSize: 20, mr: 1 }} />,
};

const MIN_CLIP_DURATION = 0.5; // seconds
const ZOOM_LEVELS = [0.5, 1, 2, 4];

const VideoEditor = () => {
  const [sidebarTool, setSidebarTool] = useState('Uploads');
  const [showSidebarPanel, setShowSidebarPanel] = useState(true);
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [customRes, setCustomRes] = useState({ width: 1080, height: 1920 });
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedAudios, setUploadedAudios] = useState([]);
  const [tracks, setTracks] = useState([
    { id: 0, type: 'video', name: 'Video', locked: false, muted: false, clips: [] },
    { id: 1, type: 'audio', name: 'Audio', locked: false, muted: false, clips: [] },
    { id: 2, type: 'subtitle', name: 'Subtitles', locked: false, muted: false, clips: [] },
  ]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(1);
  const timelineRef = useRef(null);
  const videoRef = useRef(null);
  const [dragging, setDragging] = useState(null); // {trackIdx, clipIdx, startX, startY, origStart, origEnd, origTrackIdx}
  const [dragOverTrack, setDragOverTrack] = useState(null); // Track index being dragged over
  const [timelineDuration, setTimelineDuration] = useState(60);
  const [timelineWidth, setTimelineWidth] = useState(timelineDuration * 50 * zoom);

  const scaledTimelineScale = 50 * zoom;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const prevTimelineWidth = useRef(timelineWidth);
  const userHasScrolled = useRef(false);

  // Listen for user scroll to pause auto-scroll
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const onScroll = () => {
      userHasScrolled.current = true;
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-scroll to end only when timelineWidth increases (new content)
  useEffect(() => {
    if (timelineRef.current && timelineWidth > prevTimelineWidth.current) {
      timelineRef.current.scrollLeft = timelineRef.current.scrollWidth;
      userHasScrolled.current = false; // reset so next user scroll disables auto-scroll again
    }
    prevTimelineWidth.current = timelineWidth;
  }, [timelineWidth]);

  // Center playhead after split/trim if out of view
  const centerPlayheadIfNeeded = () => {
    if (timelineRef.current) {
      const playheadPos = currentTime * scaledTimelineScale;
      const el = timelineRef.current;
      if (playheadPos < el.scrollLeft || playheadPos > el.scrollLeft + el.clientWidth) {
        el.scrollLeft = playheadPos - el.clientWidth / 2;
      }
    }
  };

  // Helper: get the max endTime across all tracks (or just video track)
  function getMaxTimelineEndTime(tracks) {
    // Only consider video track for playhead duration
    const videoTrack = tracks.find(t => t.type === 'video');
    if (!videoTrack || videoTrack.clips.length === 0) return 0;
    return Math.max(...videoTrack.clips.map(c => c.endTime));
  }

  // Helper to get the max end time across all tracks (used for timelineDuration)
  function getMaxEndTime(tracks) {
    const max = getMaxTimelineEndTime(tracks);
    return max > 0 ? Math.max(60, max) : 60;
  }

  const pushUndo = newTracks => {
    setUndoStack([...undoStack, [...tracks]]);
    setRedoStack([]);
    setTracks(newTracks);
    setTimelineDuration(getMaxEndTime(newTracks));
  };

  const undo = () => {
    if (undoStack.length > 0) {
      setRedoStack([[...tracks], ...redoStack]);
      setTracks(undoStack[undoStack.length - 1]);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      setUndoStack([...undoStack, [...tracks]]);
      setTracks(redoStack[0]);
      setRedoStack(redoStack.slice(1));
    }
  };

  const getSnappedTime = (time, trackIdx, clipIdx) => {
    const SNAP_DIST = 0.2;
    if (Math.abs(time - currentTime) < SNAP_DIST) return currentTime;
    for (let i = 0; i < tracks[trackIdx].clips.length; i++) {
      if (i !== clipIdx) {
        const clip = tracks[trackIdx].clips[i];
        if (Math.abs(time - clip.startTime) < SNAP_DIST) return clip.startTime;
        if (Math.abs(time - clip.endTime) < SNAP_DIST) return clip.endTime;
      }
    }
    for (const marker of markers) {
      if (Math.abs(time - marker.time) < SNAP_DIST) return marker.time;
    }
    return time;
  };

  const addMarker = () => {
    setMarkers([...markers, { time: currentTime, label: 'Marker' }]);
  };

  const moveMarker = (idx, newTime) => {
    setMarkers(markers => markers.map((m, i) => (i === idx ? { ...m, time: newTime } : m)));
  };

  const labelMarker = (idx, label) => {
    setMarkers(markers => markers.map((m, i) => (i === idx ? { ...m, label } : m)));
  };

  const onTrimMouseDown = (e, trackIdx, clipIdx, edge) => {
    e.stopPropagation();
    const clip = tracks[trackIdx].clips[clipIdx];
    const maxDuration = clip.file?.duration || clip.endTime - clip.startTime;
    setDragging({
      trackIdx,
      clipIdx,
      edge,
      startX: e.clientX,
      origStart: clip.startTime,
      origEnd: clip.endTime,
      maxDuration,
    });
  };

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = e => {
      const { trackIdx, clipIdx, edge, startX, origStart, origEnd, maxDuration } = dragging;
      const deltaPx = e.clientX - startX;
      const deltaSec = deltaPx / scaledTimelineScale;
      let newStart = origStart;
      let newEnd = origEnd;
      if (edge === 'left') {
        newStart = Math.max(0, Math.min(origStart + deltaSec, origEnd - MIN_CLIP_DURATION));
        // Don't allow trimming past original media in-point
        if (maxDuration) newStart = Math.max(newStart, origEnd - maxDuration);
        newStart = getSnappedTime(newStart, trackIdx, clipIdx);
      } else if (edge === 'right') {
        newEnd = Math.max(
          origStart + MIN_CLIP_DURATION,
          Math.min(origEnd + deltaSec, origStart + maxDuration)
        );
        newEnd = getSnappedTime(newEnd, trackIdx, clipIdx);
      }
      setTracks(tracks =>
        tracks.map((t, tIdx) =>
          tIdx === trackIdx
            ? {
                ...t,
                clips: t.clips.map((c, cIdx) =>
                  cIdx === clipIdx ? { ...c, startTime: newStart, endTime: newEnd } : c
                ),
              }
            : t
        )
      );
    };
    const onMouseUp = () => {
      setDragging(null);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, scaledTimelineScale]);

  const renderSidebar = () => (
    <Box
      sx={{
        width: 80,
        background: '#181A1B',
        height: '100%',
        pt: 2,
        borderRight: '1px solid #23272A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        position: 'sticky',
        top: 80,
        zIndex: 10,
      }}
    >
      {SIDEBAR_TOOLS.map(tool => (
        <Tooltip key={tool.label} title={tool.label} placement="right">
          <IconButton
            onClick={() => {
              setSidebarTool(tool.label);
              setShowSidebarPanel(true);
            }}
            sx={{
              color: sidebarTool === tool.label ? '#fff' : '#bbb',
              background:
                sidebarTool === tool.label
                  ? 'linear-gradient(135deg, #23272A 0%, #181A1B 100%)'
                  : 'none',
              mb: 1,
              borderRadius: 2,
              width: 48,
              height: 48,
              boxShadow: sidebarTool === tool.label ? 2 : 0,
              border: sidebarTool === tool.label ? '2px solid #a259ff' : 'none',
              '&:hover': {
                color: '#fff',
                background: 'linear-gradient(135deg, #23272A 0%, #23272A 100%)',
              },
            }}
          >
            {tool.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );

  const renderSidebarPanel = () => (
    <Box
      sx={{
        width: isMobile ? '100vw' : 380,
        background: '#23272A',
        height: '100%',
        borderRight: '1px solid #23272A',
        p: 0,
        display: showSidebarPanel ? 'flex' : 'none',
        flexDirection: 'column',
        transition: 'all 0.2s',
        boxShadow: 2,
        zIndex: 9,
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 56 : 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid #292929',
          background: '#23272A',
          zIndex: 2,
        }}
      >
        <Box sx={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{sidebarTool}</Box>
        <IconButton onClick={() => setShowSidebarPanel(false)} sx={{ color: '#bbb' }} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: 3,
          pb: 3,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-thumb': {
            background: '#333',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
        }}
      >
        {sidebarTool === 'Uploads' ? (
          <>
            <Button
              component="label"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 2,
                mb: 2,
                width: '100%',
                boxShadow: 1,
              }}
            >
              Upload Files
              <input
                type="file"
                accept="video/*,audio/*,text/*"
                hidden
                multiple
                onChange={e => {
                  const files = Array.from(e.target.files);
                  files.forEach(file => {
                    const url = URL.createObjectURL(file);
                    if (file.type.startsWith('video/')) {
                      const video = document.createElement('video');
                      video.src = url;
                      video.onloadedmetadata = async () => {
                        const thumbnails = await extractThumbnails(url, video.duration, 8);
                        setUploadedVideos(v => [
                          ...v,
                          { name: file.name, url, duration: video.duration, file, thumbnails },
                        ]);
                      };
                    } else if (file.type.startsWith('audio/')) {
                      const audio = document.createElement('audio');
                      audio.src = url;
                      audio.onloadedmetadata = () =>
                        setUploadedAudios(a => [
                          ...a,
                          { name: file.name, url, duration: audio.duration, file },
                        ]);
                    }
                  });
                  e.target.value = '';
                }}
              />
            </Button>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ color: '#64b5f6', fontWeight: 600, mb: 1, fontSize: 15 }}>Videos</Box>
              {uploadedVideos.map((vid, i) => (
                <Box
                  key={i}
                  draggable
                  onDragStart={e => {
                    const dragData = {
                      type: 'video',
                      file: {
                        name: vid.name,
                        url: vid.url,
                        duration: vid.duration,
                      },
                    };
                    console.log('Dragging video', dragData);
                    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: '#181A1B',
                    borderRadius: 2,
                    p: 1.5,
                    boxShadow: 3,
                    position: 'relative',
                    minHeight: 48,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <video
                    src={vid.url}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                    muted
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: 15,
                      }}
                    >
                      {vid.name}
                    </Box>
                    <Box sx={{ color: '#bbb', fontSize: 13 }}>
                      {new Date(vid.duration * 1000).toISOString().substr(11, 8)}
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{ color: '#bbb', position: 'absolute', right: 4, top: 4 }}
                    onClick={() => setUploadedVideos(v => v.filter((_, idx) => idx !== i))}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ color: '#43a047', fontWeight: 600, mb: 1, fontSize: 15 }}>Audios</Box>
              {uploadedAudios.map((aud, i) => (
                <Box
                  key={i}
                  draggable
                  onDragStart={e => {
                    const dragData = {
                      type: 'audio',
                      file: {
                        name: aud.name,
                        url: aud.url,
                        duration: aud.duration,
                      },
                    };
                    console.log('Dragging audio', dragData);
                    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: '#181A1B',
                    borderRadius: 2,
                    p: 1.5,
                    boxShadow: 3,
                    position: 'relative',
                    minHeight: 48,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <MusicNoteIcon sx={{ fontSize: 32, color: '#43a047' }} />
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: 15,
                      }}
                    >
                      {aud.name}
                    </Box>
                    <Box sx={{ color: '#bbb', fontSize: 13 }}>
                      {new Date(aud.duration * 1000).toISOString().substr(14, 5)}
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{ color: '#bbb', position: 'absolute', right: 4, top: 4 }}
                    onClick={() => setUploadedAudios(a => a.filter((_, idx) => idx !== i))}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </>
        ) : (
          <Box sx={{ color: '#bbb', fontSize: 15 }}>
            {sidebarTool === 'Text' && 'Add and style text overlays.'}
            {sidebarTool === 'Captions' && 'Manage captions and subtitles.'}
            {sidebarTool === 'AI' && 'AI-powered editing features coming soon.'}
            {sidebarTool === 'Record' && 'Record audio or video.'}
            {sidebarTool === 'Videos' && 'Browse and add video clips.'}
            {sidebarTool === 'Audios' && 'Browse and add audio tracks.'}
            {sidebarTool === 'Photos' && 'Browse and add photos.'}
            {sidebarTool === 'Subtitles' && 'Manage subtitle files.'}
          </Box>
        )}
      </Box>
    </Box>
  );

  const renderTopBar = () => (
    <AppBar position="static" sx={{ background: '#23272A', boxShadow: 2 }}>
      <Toolbar sx={{ minHeight: 56, px: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <AutoAwesomeIcon sx={{ color: '#a259ff', fontSize: 32, mr: 1 }} />
          <InputBase
            defaultValue="Untitled project"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              px: 1,
              borderRadius: 1,
              background: '#181A1B',
              width: 220,
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <FormControl
            variant="filled"
            sx={{ minWidth: 120, background: '#181A1B', borderRadius: 2 }}
            size="small"
          >
            <InputLabel sx={{ color: '#bbb' }}>Resolution</InputLabel>
            <Select
              value={resolution.label}
              label="Resolution"
              onChange={e => setResolution(RESOLUTIONS.find(r => r.label === e.target.value))}
              sx={{ color: '#fff', borderRadius: 2, fontWeight: 500 }}
              inputProps={{ sx: { color: '#fff' } }}
              MenuProps={{
                PaperProps: {
                  sx: { background: '#23272A', color: '#fff' },
                },
              }}
            >
              {RESOLUTIONS.map(r => (
                <MenuItem key={r.label} value={r.label} sx={{ color: '#fff' }}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {resolution.label === 'Custom' && (
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="W"
                type="number"
                value={customRes.width}
                onChange={e =>
                  setCustomRes({
                    ...customRes,
                    width: parseInt(e.target.value) || 1080,
                  })
                }
                sx={{
                  width: 70,
                  background: '#181A1B',
                  borderRadius: 2,
                  color: '#fff',
                }}
                size="small"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                  style: { color: '#bbb' },
                }}
                inputProps={{ style: { color: '#fff' } }}
              />
              <TextField
                label="H"
                type="number"
                value={customRes.height}
                onChange={e =>
                  setCustomRes({
                    ...customRes,
                    height: parseInt(e.target.value) || 1920,
                  })
                }
                sx={{
                  width: 70,
                  background: '#181A1B',
                  borderRadius: 2,
                  color: '#fff',
                }}
                size="small"
                variant="filled"
                InputLabelProps={{
                  shrink: true,
                  style: { color: '#bbb' },
                }}
                inputProps={{ style: { color: '#fff' } }}
              />
            </Stack>
          )}
          <Button
            variant="contained"
            sx={{
              ml: 2,
              background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
              color: '#fff',
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 1,
            }}
            onClick={() => alert('Export functionality coming soon!')}
          >
            Export
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );

  const getPreviewDimensions = () => {
    let w = 800,
      h = 450;
    if (resolution.label === 'Custom') {
      w = customRes.width || 800;
      h = customRes.height || 450;
    } else {
      w = resolution.width;
      h = resolution.height;
    }
    // Scale down if too large for preview area
    const maxW = 800,
      maxH = 450;
    const scale = Math.min(maxW / w, maxH / h, 1);
    return { width: Math.round(w * scale), height: Math.round(h * scale) };
  };

  const renderPreview = () => {
    const { width, height } = getPreviewDimensions();
    // Find the first video clip in the video track
    const videoTrack = tracks.find(t => t.type === 'video');
    const firstClip = videoTrack && videoTrack.clips.length > 0 ? videoTrack.clips[0] : null;
    return (
      <Box
        sx={{
          width: width,
          background: '#191B1F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: height,
          p: 0,
          position: 'relative',
          mb: 4,
          overflow: 'visible',
          border: '1.5px solidrgb(255, 255, 255)',
          borderRadius: 6,
        }}
      >
        <Box
          sx={{
            width,
            height,
            background: '#000',
            overflow: 'hidden',
            position: 'relative',
            mt: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgb(126, 126, 126)',
            borderRadius: 3,
            boxShadow: 'none',
            outline: 'none',
          }}
        >
          {firstClip ? (
            <video
              ref={videoRef}
              src={firstClip.file?.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                background: '#000',
                border: 'none',
                borderRadius: 0,
                boxShadow: 'none',
                outline: 'none',
              }}
              onLoadedMetadata={e => {
                const video = e.target;
                setTimelineDuration(Math.max(timelineDuration, video.duration));
              }}
            />
          ) : null}
        </Box>
      </Box>
    );
  };

  const renderBlockVisual = (clip, trackIdx) => {
    if (tracks[trackIdx].type === 'video') {
      // Just show the same image as in uploads (video file's url as poster)
      return (
        <img
          src={clip.file?.url || ''}
          alt={clip.label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 2,
            display: 'block',
          }}
        />
      );
    }
    if (tracks[trackIdx].type === 'audio') {
      return (
        <Box
          sx={{
            width: 48,
            height: 24,
            background: 'linear-gradient(90deg, #43a047 30%, #66bb6a 100%)',
            borderRadius: 2,
            mr: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MusicNoteIcon sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
      );
    }
    return (
      <Box
        sx={{
          width: 32,
          height: 32,
          background: TRACK_COLORS[tracks[trackIdx].type],
          borderRadius: 2,
          mr: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {TRACK_ICONS[tracks[trackIdx].type]}
      </Box>
    );
  };

  // Helper to format time for the timeline scale
  function formatTimelineTime(seconds, showHour) {
    const totalSeconds = Math.floor(seconds);
    const s = totalSeconds % 60;
    const m = Math.floor(totalSeconds / 60) % 60;
    const h = Math.floor(totalSeconds / 3600);
    if (showHour) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    } else {
      return `${String(m + h * 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }

  const renderTimeline = () => (
    <Box
      sx={{
        width: '100%',
        background: '#23272A',
        borderRadius: 3,
        boxShadow: 4,
        mt: 2,
        position: 'relative',
      }}
    >
      {/* Timeline Navbar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          background: '#23272A',
          px: 2,
          py: 1,
          width: '100%',
          left: 0,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          {/* Left: Undo/Redo, Split/Copy/Delete */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 2, flex: 1 }}>
            <Tooltip title="Undo">
              <span>
                <IconButton
                  size="small"
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  sx={{ color: undoStack.length === 0 ? '#888' : '#fff' }}
                >
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo">
              <span>
                <IconButton
                  size="small"
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  sx={{ color: redoStack.length === 0 ? '#888' : '#fff' }}
                >
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Split">
              <IconButton
                size="small"
                sx={{ color: '#fff' }}
                onClick={() => {
                  if (!selectedClip) return;
                  const { trackIdx, clipIdx } = selectedClip;
                  const clip = tracks[trackIdx].clips[clipIdx];
                  if (currentTime > clip.startTime && currentTime < clip.endTime) {
                    const originId = clip.originId || clip.id;
                    const left = {
                      ...clip,
                      endTime: currentTime,
                      id: Date.now() + Math.random(),
                      originId,
                    };
                    const right = {
                      ...clip,
                      startTime: currentTime,
                      id: Date.now() + Math.random(),
                      originId,
                    };
                    const newTracks = tracks.map((t, tIdx) =>
                      tIdx === trackIdx
                        ? {
                            ...t,
                            clips: [
                              ...t.clips.slice(0, clipIdx),
                              left,
                              right,
                              ...t.clips.slice(clipIdx + 1),
                            ],
                          }
                        : t
                    );
                    pushUndo(newTracks);
                    setTimeout(centerPlayheadIfNeeded, 0);
                  }
                }}
                disabled={
                  !selectedClip ||
                  (() => {
                    const { trackIdx, clipIdx } = selectedClip || {};
                    const clip = tracks[trackIdx]?.clips[clipIdx];
                    return !clip || currentTime <= clip?.startTime || currentTime >= clip?.endTime;
                  })()
                }
              >
                <ContentCutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy">
              <IconButton size="small" sx={{ color: '#fff' }}>
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                sx={{ color: '#fff' }}
                onClick={() => {
                  if (!selectedClip) return;
                  const { trackIdx, clipIdx } = selectedClip;
                  deleteClip(trackIdx, clipIdx);
                  setSelectedClip(null);
                }}
                disabled={!selectedClip}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          {/* Center: Play/Pause */}
          <Box sx={{ flex: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton
              sx={{ color: '#fff', mx: 1, background: '#23272A', borderRadius: 2, boxShadow: 1 }}
              onClick={() => {
                if (!isPlaying) {
                  // If playhead is not in any video clip, jump to first video clip
                  const firstStart = getFirstVideoClipStart(tracks);
                  if (!isTimeInAnyVideoClip(currentTime, tracks)) {
                    setCurrentTime(firstStart);
                    if (videoRef.current) videoRef.current.currentTime = firstStart;
                  }
                }
                setIsPlaying(p => !p);
              }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton
              sx={{ color: '#fff', mx: 1, background: '#23272A', borderRadius: 2, boxShadow: 1 }}
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.min(
                    videoRef.current.duration || 0,
                    videoRef.current.currentTime + 10
                  );
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
            >
              <FastForwardIcon />
            </IconButton>
          </Box>
          {/* Right: Zoom, Marker */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ ml: 2, flex: 1, justifyContent: 'flex-end' }}
          >
            <Tooltip title="Zoom Out">
              <span>
                <IconButton
                  size="small"
                  sx={{ color: zoom === ZOOM_LEVELS[0] ? '#888' : '#fff' }}
                  onClick={() => setZoom(z => Math.max(ZOOM_LEVELS[0], z / 2))}
                  disabled={zoom === ZOOM_LEVELS[0]}
                >
                  -
                </IconButton>
              </span>
            </Tooltip>
            <Box sx={{ color: '#fff', fontWeight: 500, minWidth: 60, textAlign: 'center' }}>
              Zoom: {zoom}x
            </Box>
            <Tooltip title="Zoom In">
              <span>
                <IconButton
                  size="small"
                  sx={{ color: zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1] ? '#888' : '#fff' }}
                  onClick={() => setZoom(z => Math.min(ZOOM_LEVELS[ZOOM_LEVELS.length - 1], z * 2))}
                  disabled={zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                >
                  +
                </IconButton>
              </span>
            </Tooltip>
            <Box sx={{ width: 16 }} />
            <Button onClick={addMarker} sx={{ color: '#a259ff', fontWeight: 600 }}>
              Add Marker
            </Button>
          </Stack>
        </Stack>
      </Box>
      {/* Timeline Scroll Area */}
      <Box sx={{ width: '100vw', maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
        <Box sx={{ width: timelineWidth }} ref={timelineRef}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 32,
              mb: 1,
              borderBottom: '1px solid #333',
            }}
          >
            {(() => {
              // Choose tick interval based on duration
              const showHour = timelineDuration >= 3600;
              const tickInterval = showHour ? 10 : 2; // 10s for >=1hr, 2s for <1hr
              const ticks = [];
              for (let t = 0; t <= timelineDuration; t += tickInterval) {
                ticks.push(
                  <Box
                    key={t}
                    sx={{
                      position: 'absolute',
                      left: t * scaledTimelineScale,
                      top: 0,
                      color: '#bbb',
                      fontSize: 12,
                      userSelect: 'none',
                      textAlign: 'center',
                    }}
                  >
                    {formatTimelineTime(t, showHour)}
                    <Box
                      sx={{
                        width: 1,
                        height: 32,
                        background: '#333',
                        mt: 0.5,
                        opacity: 0.3,
                      }}
                    />
                  </Box>
                );
              }
              return ticks;
            })()}
            {/* Playhead line and handle rendered last for top zIndex */}
            <Box
              sx={{
                position: 'absolute',
                left: currentTime * scaledTimelineScale - 1,
                top: 0,
                width: 2,
                height: '100%',
                background: '#fff',
                borderRadius: 1,
                zIndex: 100,
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: currentTime * scaledTimelineScale - 8,
                top: -10,
                width: 18,
                height: 18,
                background: '#fff',
                borderRadius: '50%',
                zIndex: 110,
                boxShadow: 2,
                border: '2px solid #23272A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
              }}
              onMouseDown={e => {
                e.preventDefault();
                const startX = e.clientX;
                const startCurrentTime = currentTime;
                const onMove = moveEvent => {
                  const delta = moveEvent.clientX - startX;
                  const newTime = Math.max(
                    0,
                    Math.min(startCurrentTime + delta / scaledTimelineScale, timelineDuration)
                  );
                  setCurrentTime(newTime);
                  if (videoRef.current) videoRef.current.currentTime = newTime;
                };
                const onUp = () => {
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <Box sx={{ width: 8, height: 8, background: '#fff', borderRadius: '50%' }} />
            </Box>
            {markers.map((m, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  left: m.time * scaledTimelineScale,
                  top: 0,
                  width: 2,
                  height: '100%',
                  background: '#a259ff',
                  borderRadius: 1,
                  zIndex: 9,
                  cursor: 'pointer',
                }}
                title={m.label}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('marker-idx', i);
                }}
                onDragEnd={e => {
                  const rect = timelineRef.current.getBoundingClientRect();
                  const dropX = e.clientX - rect.left;
                  const newTime = Math.max(
                    0,
                    Math.min(dropX / scaledTimelineScale, timelineDuration)
                  );
                  moveMarker(i, newTime);
                }}
                onDoubleClick={() => {
                  const label = prompt('Marker label:', m.label);
                  if (label !== null) labelMarker(i, label);
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
            {tracks.map((track, trackIdx) => {
              const isVideo = track.type === 'video';
              const trackHeight = isVideo ? 44 : 28;
              return (
                <Box
                  key={track.id}
                  sx={{
                    position: 'relative',
                    height: trackHeight,
                    display: 'flex',
                    alignItems: 'center',
                    background: dragOverTrack === trackIdx ? '#2a2d3a' : '#202124',
                    borderRadius: 2,
                    mb: 0.5,
                    boxShadow: dragOverTrack === trackIdx ? 6 : undefined,
                    border: dragOverTrack === trackIdx ? '2px dashed #a259ff' : undefined,
                    transition: 'all 0.15s',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 100,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#fff',
                      fontSize: 14,
                      pl: 1,
                      zIndex: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ color: track.locked ? '#a259ff' : '#bbb' }}
                      onClick={() => toggleTrackLock(trackIdx)}
                    >
                      {/* lock/unlock icon here */}
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: track.muted ? '#a259ff' : '#bbb' }}
                      onClick={() => toggleTrackMute(trackIdx)}
                    >
                      {/* mute/unmute icon here */}
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      position: 'relative',
                      height: trackHeight,
                    }}
                  >
                    {/* Drop overlay for drag-and-drop */}
                    <Box
                      className="timeline-drop-overlay"
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 20,
                        background:
                          dragOverTrack === trackIdx ? 'rgba(162,89,255,0.08)' : 'transparent',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#a259ff',
                        fontWeight: 'bold',
                        fontSize: 18,
                        letterSpacing: 1,
                        pointerEvents: dragOverTrack === trackIdx ? 'auto' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onDragOver={e => {
                        e.preventDefault();
                        setDragOverTrack(trackIdx);
                        console.log('onDragOver track', trackIdx);
                      }}
                      onDragLeave={e => {
                        setDragOverTrack(null);
                        console.log('onDragLeave track', trackIdx);
                      }}
                      onDrop={e => {
                        e.preventDefault();
                        const fileData = e.dataTransfer.getData('application/json');
                        if (fileData) {
                          // Try to add to the first compatible track at drop position
                          const data = JSON.parse(fileData);
                          const { type, file } = data;
                          let trackIdx = -1;
                          if (type === 'video')
                            trackIdx = tracks.findIndex(t => t.type === 'video');
                          else if (type === 'audio')
                            trackIdx = tracks.findIndex(t => t.type === 'audio');
                          else if (type === 'text')
                            trackIdx = tracks.findIndex(t => t.type === 'subtitle');
                          if (trackIdx !== -1) {
                            let startTime, endTime;
                            let fileToUse = file;
                            if (type === 'video') {
                              // Find the uploaded video by url or name
                              const uploaded = uploadedVideos.find(
                                v => v.url === file.url || v.name === file.name
                              );
                              if (uploaded) fileToUse = uploaded;
                              const existingClips = tracks[trackIdx].clips;
                              const lastEndTime = existingClips.length
                                ? Math.max(...existingClips.map(c => c.endTime))
                                : 0;
                              startTime = lastEndTime;
                              const duration = fileToUse.duration || 5;
                              endTime = startTime + duration;

                              // push clip, ensure thumbnails are copied
                              pushUndo(
                                tracks.map((t, i) =>
                                  i === trackIdx
                                    ? {
                                        ...t,
                                        clips: [
                                          ...t.clips,
                                          {
                                            id: Date.now() + Math.random(),
                                            file: fileToUse,
                                            type,
                                            source: fileToUse.name,
                                            startTime,
                                            endTime,
                                            thumbnails: fileToUse.thumbnails || [],
                                          },
                                        ].sort((a, b) => a.startTime - b.startTime),
                                      }
                                    : t
                                )
                              );
                            } else {
                              // For audio/subtitles, use drop position as before
                              const rect = timelineRef.current.getBoundingClientRect();
                              const dropX = e.clientX - rect.left;
                              const dropTime = (dropX / timelineWidth) * timelineDuration;
                              startTime = getSnappedTime(
                                dropTime,
                                trackIdx,
                                tracks[trackIdx].clips.length
                              );
                              const duration = file.duration || 5;
                              endTime = startTime + duration;
                            }
                            // Check for overlaps
                            const hasOverlap = tracks[trackIdx].clips.some(
                              clip => !(clip.endTime <= startTime || clip.startTime >= endTime)
                            );
                            if (!hasOverlap) {
                              pushUndo(
                                tracks.map((t, i) =>
                                  i === trackIdx
                                    ? {
                                        ...t,
                                        clips: [
                                          ...t.clips,
                                          {
                                            id: Date.now() + Math.random(),
                                            file: fileToUse,
                                            type,
                                            source: fileToUse.name,
                                            startTime,
                                            endTime,
                                            thumbnails: fileToUse.thumbnails || [],
                                          },
                                        ].sort((a, b) => a.startTime - b.startTime),
                                      }
                                    : t
                                )
                              );
                            }
                          }
                        }
                      }}
                    >
                      {dragOverTrack === trackIdx && 'Drop here'}
                    </Box>
                    {track.clips.map((clip, clipIdx) => (
                      <Box
                        key={clip.id}
                        sx={{
                          position: 'absolute',
                          left: clip.startTime * scaledTimelineScale,
                          width: (clip.endTime - clip.startTime) * scaledTimelineScale,
                          height: isVideo ? 36 : 20,
                          background: '#1976d2',
                          borderRadius: 2,
                          boxShadow: 3,
                          display: 'flex',
                          alignItems: 'center',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 14,
                          px: 2,
                          cursor: track.type === 'video' ? 'not-allowed' : 'pointer',
                          zIndex: 2,
                          transition: 'box-shadow 0.2s',
                          userSelect: 'none',
                          outline:
                            selectedClip &&
                            selectedClip.trackIdx === trackIdx &&
                            selectedClip.clipIdx === clipIdx
                              ? '3px solid #fff'
                              : 'none',
                          overflow: 'hidden',
                          gap: 1,
                          draggable: track.type !== 'video',
                        }}
                        onClick={() => setSelectedClip({ trackIdx, clipIdx })}
                        onDoubleClick={() => setSelectedClip({ trackIdx, clipIdx })}
                        onDragStart={e => {
                          e.dataTransfer.setData('clip', JSON.stringify({ trackIdx, clipIdx }));
                        }}
                      >
                        {renderBlockVisual(clip, trackIdx)}
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          {clip.source || clip.type}
                        </span>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: 8,
                            height: '100%',
                            cursor: 'ew-resize',
                            zIndex: 3,
                            background: 'transparent',
                          }}
                          onMouseDown={e => onTrimMouseDown(e, trackIdx, clipIdx, 'left')}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            width: 8,
                            height: '100%',
                            cursor: 'ew-resize',
                            zIndex: 3,
                            background: 'transparent',
                          }}
                          onMouseDown={e => onTrimMouseDown(e, trackIdx, clipIdx, 'right')}
                        />

                        {selectedClip &&
                          selectedClip.trackIdx === trackIdx &&
                          selectedClip.clipIdx === clipIdx && (
                            <Box
                              sx={{
                                position: 'absolute',
                                left: clip.startTime * scaledTimelineScale,
                                top: -38,
                                zIndex: 20,
                                display: 'flex',
                                gap: 1,
                                background: '#23272A',
                                borderRadius: 2,
                                boxShadow: 4,
                                px: 1,
                                py: 0.5,
                                alignItems: 'center',
                              }}
                            >
                              <Tooltip title="Split">
                                <IconButton
                                  size="small"
                                  sx={{ color: '#fff' }}
                                  onClick={e => {
                                    e.stopPropagation();
                                    // Split block at playhead
                                    const clip = tracks[trackIdx].clips[clipIdx];
                                    if (
                                      currentTime > clip.startTime &&
                                      currentTime < clip.endTime
                                    ) {
                                      const originId = clip.originId || clip.id;
                                      const left = {
                                        ...clip,
                                        endTime: currentTime,
                                        id: Date.now() + Math.random(),
                                        originId,
                                      };
                                      const right = {
                                        ...clip,
                                        startTime: currentTime,
                                        id: Date.now() + Math.random(),
                                        originId,
                                      };
                                      const newTracks = tracks.map((t, tIdx) =>
                                        tIdx === trackIdx
                                          ? {
                                              ...t,
                                              clips: [
                                                ...t.clips.slice(0, clipIdx),
                                                left,
                                                right,
                                                ...t.clips.slice(clipIdx + 1),
                                              ],
                                            }
                                          : t
                                      );
                                      pushUndo(newTracks);
                                      setTimeout(centerPlayheadIfNeeded, 0);
                                    }
                                  }}
                                >
                                  <ContentCutIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  sx={{ color: '#fff' }}
                                  onClick={e => {
                                    e.stopPropagation();
                                    deleteClip(trackIdx, clipIdx);
                                    setSelectedClip(null);
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const toggleTrackLock = idx => {
    setTracks(tracks => tracks.map((t, i) => (i === idx ? { ...t, locked: !t.locked } : t)));
  };

  const toggleTrackMute = idx => {
    setTracks(tracks => tracks.map((t, i) => (i === idx ? { ...t, muted: !t.muted } : t)));
  };

  const deleteClip = (trackIdx, clipIdx) => {
    setTracks(tracks =>
      tracks.map((track, idx) => {
        if (idx !== trackIdx) return track;
        const clips = [...track.clips];
        const deletedClip = clips[clipIdx];
        // Check if next clip is contiguous and from same origin
        const nextClip = clips[clipIdx + 1];
        if (
          nextClip &&
          deletedClip.originId &&
          nextClip.originId === deletedClip.originId &&
          Math.abs(nextClip.startTime - deletedClip.endTime) < 1e-6
        ) {
          // Ripple: shift all subsequent contiguous split clips left
          const shiftAmount = deletedClip.endTime - deletedClip.startTime;
          let i = clipIdx + 1;
          // Shift all contiguous clips with same originId
          while (
            i < clips.length &&
            clips[i].originId === deletedClip.originId &&
            (i === clipIdx + 1 || Math.abs(clips[i].startTime - clips[i - 1].endTime) < 1e-6)
          ) {
            clips[i] = {
              ...clips[i],
              startTime: clips[i].startTime - shiftAmount,
              endTime: clips[i].endTime - shiftAmount,
            };
            i++;
          }
          // Remove the deleted clip
          clips.splice(clipIdx, 1);
          return { ...track, clips };
        } else {
          // Normal delete (no ripple)
          return {
            ...track,
            clips: clips.filter((_, i) => i !== clipIdx),
          };
        }
      })
    );
  };

  // Helper: get the min startTime and max endTime of all video clips
  function getFirstVideoClipStart(tracks) {
    const videoTrack = tracks.find(t => t.type === 'video');
    if (!videoTrack || videoTrack.clips.length === 0) return 0;
    return Math.min(...videoTrack.clips.map(c => c.startTime));
  }
  function getLastVideoClipEnd(tracks) {
    const videoTrack = tracks.find(t => t.type === 'video');
    if (!videoTrack || videoTrack.clips.length === 0) return 0;
    return Math.max(...videoTrack.clips.map(c => c.endTime));
  }

  // Playback logic: when play is pressed, jump to first video clip if playhead is outside any clip
  const isTimeInAnyVideoClip = (time, tracks) => {
    const videoTrack = tracks.find(t => t.type === 'video');
    if (!videoTrack) return false;
    return videoTrack.clips.some(c => time >= c.startTime && time < c.endTime);
  };

  // sync playhead with video and control video playback from isPlaying
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Keep playhead in sync
    const handler = () => {
      // If currentTime exceeds the last valid endTime, stop playback
      const minStart = getFirstVideoClipStart(tracks);
      const maxEnd = getLastVideoClipEnd(tracks);
      if (video.currentTime < minStart) {
        setCurrentTime(minStart);
        video.currentTime = minStart;
        video.pause();
        setIsPlaying(false);
      } else if (video.currentTime >= maxEnd) {
        setIsPlaying(false);
        setCurrentTime(maxEnd);
        video.pause();
        video.currentTime = maxEnd;
      } else {
        setCurrentTime(video.currentTime);
      }
    };
    video.addEventListener('timeupdate', handler);
    // Control playback
    if (isPlaying) {
      const minStart = getFirstVideoClipStart(tracks);
      const maxEnd = getLastVideoClipEnd(tracks);
      if (video.currentTime < minStart) {
        setCurrentTime(minStart);
        video.currentTime = minStart;
      } else if (video.currentTime >= maxEnd) {
        setIsPlaying(false);
        setCurrentTime(maxEnd);
        video.pause();
        video.currentTime = maxEnd;
      } else {
        const playPromise = video.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
    return () => video.removeEventListener('timeupdate', handler);
  }, [isPlaying, tracks]);

  // Update timelineWidth when duration or zoom changes
  useEffect(() => {
    setTimelineWidth(timelineDuration * 50 * zoom);
  }, [timelineDuration, zoom]);

  // Utility: Extract thumbnails from a video file at regular intervals
  const extractThumbnails = (fileUrl, duration, count = 8) => {
    return new Promise(resolve => {
      const video = document.createElement('video');
      video.src = fileUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.currentTime = 0;
      const canvas = document.createElement('canvas');
      const thumbnails = [];
      let loaded = false;
      video.addEventListener('loadeddata', async () => {
        if (loaded) return;
        loaded = true;
        const interval = duration / count;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        for (let i = 0; i < count; i++) {
          video.currentTime = Math.min(duration - 0.1, i * interval);
          await new Promise(res => {
            video.onseeked = () => {
              canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
              thumbnails.push(canvas.toDataURL('image/jpeg', 0.7));
              res();
            };
          });
        }
        resolve(thumbnails);
      });
    });
  };

  // Sync thumbnails from uploadedVideos to timeline clips after upload/async extraction
  useEffect(() => {
    setTracks(tracks =>
      tracks.map(track => {
        if (track.type !== 'video') return track;
        return {
          ...track,
          clips: track.clips.map(clip => {
            if (clip.thumbnails && clip.thumbnails.length > 0) return clip;
            const match = uploadedVideos.find(v => v.url === clip.file?.url);
            if (match && match.thumbnails && match.thumbnails.length > 0) {
              return { ...clip, thumbnails: match.thumbnails };
            }
            return clip;
          }),
        };
      })
    );
  }, [uploadedVideos]);

  return (
    <Box sx={{ minHeight: '100vh', height: '100vh', background: '#181A1B', overflow: 'hidden' }}>
      {renderTopBar()}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: 'calc(100vh - 56px)',
          p: isMobile ? 0 : 2,
          gap: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{ minWidth: 80, maxWidth: 80, flex: '0 0 80px', height: '100%', overflow: 'hidden' }}
        >
          <Box sx={{ height: '100%', overflowY: 'auto' }}>{renderSidebar()}</Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            {showSidebarPanel && (
              <Box
                sx={{
                  minWidth: isMobile ? '100vw' : 380,
                  maxWidth: isMobile ? '100vw' : 380,
                  flex: isMobile ? '1 1 100vw' : '0 0 380px',
                  height: '100%',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ height: '100%', overflowY: 'auto' }}>{renderSidebarPanel()}</Box>
              </Box>
            )}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              {renderPreview()}
            </Box>
          </Box>
          <Box sx={{ width: '100%', flex: '0 0 auto', overflow: 'hidden' }}>
            <Box
              onDragOver={e => {
                e.preventDefault();
              }}
              onDrop={e => {
                e.preventDefault();
                const fileData = e.dataTransfer.getData('application/json');
                if (fileData) {
                  // Try to add to the first compatible track at drop position
                  const data = JSON.parse(fileData);
                  const { type, file } = data;
                  let trackIdx = -1;
                  if (type === 'video') trackIdx = tracks.findIndex(t => t.type === 'video');
                  else if (type === 'audio') trackIdx = tracks.findIndex(t => t.type === 'audio');
                  else if (type === 'text') trackIdx = tracks.findIndex(t => t.type === 'subtitle');
                  if (trackIdx !== -1) {
                    let startTime, endTime;
                    let fileToUse = file;
                    if (type === 'video') {
                      // Find the uploaded video by url or name
                      const uploaded = uploadedVideos.find(
                        v => v.url === file.url || v.name === file.name
                      );
                      if (uploaded) fileToUse = uploaded;
                      const existingClips = tracks[trackIdx].clips;
                      const lastEndTime = existingClips.length
                        ? Math.max(...existingClips.map(c => c.endTime))
                        : 0;
                      startTime = lastEndTime;
                      const duration = fileToUse.duration || 5;
                      endTime = startTime + duration;

                      // push clip, ensure thumbnails are copied
                      pushUndo(
                        tracks.map((t, i) =>
                          i === trackIdx
                            ? {
                                ...t,
                                clips: [
                                  ...t.clips,
                                  {
                                    id: Date.now() + Math.random(),
                                    file: fileToUse,
                                    type,
                                    source: fileToUse.name,
                                    startTime,
                                    endTime,
                                    thumbnails: fileToUse.thumbnails || [],
                                  },
                                ].sort((a, b) => a.startTime - b.startTime),
                              }
                            : t
                        )
                      );
                    } else {
                      // For audio/subtitles, use drop position as before
                      const rect = timelineRef.current.getBoundingClientRect();
                      const dropX = e.clientX - rect.left;
                      const dropTime = (dropX / timelineWidth) * timelineDuration;
                      startTime = getSnappedTime(dropTime, trackIdx, tracks[trackIdx].clips.length);
                      const duration = file.duration || 5;
                      endTime = startTime + duration;
                    }
                    // Check for overlaps
                    const hasOverlap = tracks[trackIdx].clips.some(
                      clip => !(clip.endTime <= startTime || clip.startTime >= endTime)
                    );
                    if (!hasOverlap) {
                      pushUndo(
                        tracks.map((t, i) =>
                          i === trackIdx
                            ? {
                                ...t,
                                clips: [
                                  ...t.clips,
                                  {
                                    id: Date.now() + Math.random(),
                                    file: fileToUse,
                                    type,
                                    source: fileToUse.name,
                                    startTime,
                                    endTime,
                                    thumbnails: fileToUse.thumbnails || [],
                                  },
                                ].sort((a, b) => a.startTime - b.startTime),
                              }
                            : t
                        )
                      );
                    }
                  }
                }
              }}
              sx={{ overflowX: 'auto', overflowY: 'hidden', maxHeight: 220 }}
            >
              {renderTimeline()}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoEditor;
