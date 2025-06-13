import React, { useState, useRef, useEffect } from 'react';
import { Card, Stack, Button, TextField, IconButton, Slider } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import { FaEllipsisH, FaPlay, FaPause, FaUpload, FaTrash, FaStepBackward, FaUndo } from 'react-icons/fa';
import { fetchAudioFiles } from 'services/audioService';
import axiosInstance from 'services/axiosInstance';
const API_BASE = 'http://localhost:8081'; // Adjust if backend runs elsewhere

const formatTime = (timeInSeconds) => {
	if (isNaN(timeInSeconds)) return '0:00';
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = Math.floor(timeInSeconds % 60);
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function AudioCard() {
	const { info = {} } = colors || {};
	const [audioFiles, setAudioFiles] = useState([]);
	const [newTitle, setNewTitle] = useState('');
	const [editingTitle, setEditingTitle] = useState(null);
	const [editTitle, setEditTitle] = useState('');
	const [uploading, setUploading] = useState(false);
	const [playing, setPlaying] = useState(null);
	const [currentTime, setCurrentTime] = useState({});
	const [duration, setDuration] = useState({});
	const audioRefs = useRef({});

	// Fetch audios from backend
	useEffect(() => {
		fetchAudioFiles()
			.then(res => setAudioFiles(Array.isArray(res.data) ? res.data : []))
			.catch(() => setAudioFiles([]));
	}, []);

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (file && file.type.startsWith('audio/')) {
			setUploading(true);
			const formData = new FormData();
			formData.append('file', file);
			if (newTitle && newTitle.trim() !== '') {
				formData.append('title', newTitle);
			}
			try {
				const res = await axiosInstance.post(`/audio/upload`, formData);
				if (res.status === 200) {
					setAudioFiles(prev => [...prev, res.data]);
					setNewTitle('');
				}
			} finally {
				setUploading(false);
			}
		}
	};

	const handleDelete = async (id) => {
		await axiosInstance.delete(`/audio/${id}`);
		setAudioFiles(prev => prev.filter(a => a.id !== id));
		if (editingTitle === id) {
			setEditingTitle(null);
		}
	};

	const startEditTitle = (id, currentTitle) => {
		setEditingTitle(id);
		setEditTitle(currentTitle || '');
	};

	const cancelEditTitle = () => {
		setEditingTitle(null);
		setEditTitle('');
	};

	const saveTitle = async (id) => {
		if (editTitle.trim() === '') return;

		try {
			const res = await axiosInstance.put(`/audio/${id}/title`, {
				title: editTitle
			});

			if (res.status === 200) {
				setAudioFiles(prev =>
					prev.map(audio => audio.id === id ? res.data : audio)
				);
				setEditingTitle(null);
				setEditTitle('');
			}
		} catch (error) {
			console.error('Error updating title:', error);
		}
	};

	const savePosition = async (id, position) => {
		try {
			await axiosInstance.put(`/audio/${id}/position`, {
				position: Math.floor(position)
			});
		} catch (error) {
			console.error('Error saving position:', error);
		}
	};

	// Set up time update listeners for audio elements
	useEffect(() => {
		const timeUpdateListeners = {};

		// Clean up function to remove listeners when component unmounts
		return () => {
			Object.keys(timeUpdateListeners).forEach(id => {
				if (audioRefs.current[id]) {
					audioRefs.current[id].removeEventListener('timeupdate', timeUpdateListeners[id]);
				}
			});
		};
	}, []);

	// Function to restart audio from beginning
	const handleRestart = (id) => {
		const audioElement = audioRefs.current[id];
		if (audioElement) {
			audioElement.currentTime = 0;
			if (playing !== id) {
				// Pause any currently playing audio
				if (playing !== null && audioRefs.current[playing]) {
					audioRefs.current[playing].pause();
				}
				audioElement.play();
				setPlaying(id);
			}
		}
	};

	// Function to rewind audio by 10 seconds
	const handleRewind = (id) => {
		const audioElement = audioRefs.current[id];
		if (audioElement) {
			audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
		}
	};

	// Function to handle slider change
	const handleSliderChange = (id, newValue) => {
		const audioElement = audioRefs.current[id];
		if (audioElement) {
			audioElement.currentTime = newValue;
			setCurrentTime(prev => ({ ...prev, [id]: newValue }));
		}
	};

	// Function to handle time update
	const handleTimeUpdate = (id) => {
		const audioElement = audioRefs.current[id];
		if (audioElement) {
			const newTime = audioElement.currentTime;
			setCurrentTime(prev => ({ ...prev, [id]: newTime }));
			if (!duration[id] && audioElement.duration) {
				setDuration(prev => ({ ...prev, [id]: audioElement.duration }));
			}
		}
	};

	const togglePlay = (id) => {
		const audioElement = audioRefs.current[id];

		if (playing === id) {
			audioElement.pause();
			// Save position when pausing
			savePosition(id, audioElement.currentTime);
			setPlaying(null);
		} else {
			// Pause any currently playing audio
			if (playing !== null && audioRefs.current[playing]) {
				const playingElement = audioRefs.current[playing];
				playingElement.pause();
				// Save position of previously playing audio
				savePosition(playing, playingElement.currentTime);
			}

			audioElement.play();
			setPlaying(id);
		}
	};

	return (
		<Card
			sx={{
				height: '100%',
				background: 'rgba(0,0,0,0)',
				backdropFilter: 'blur(10px)',
				border: '1px solid rgba(255, 255, 255, 0.125)'
			}}>
			<VuiBox sx={{ width: '100%' }}>
				<VuiBox
					display='flex'
					alignItems='center'
					justifyContent='space-beetween'
					sx={{ width: '100%' }}
					mb='40px'>
					<VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
						Audio Library
					</VuiTypography>
					<VuiBox
						display='flex'
						justifyContent='center'
						alignItems='center'
						bgColor='#22234B'
						sx={{ width: '37px', height: '37px', cursor: 'pointer', borderRadius: '12px' }}>
						<FaEllipsisH color={info?.main || "#0075ff"} size='18px' />
					</VuiBox>
				</VuiBox>

				<VuiBox mb={3}>
					<VuiBox>
						{audioFiles.length === 0 ? (
							<VuiTypography color='text' variant='button' fontWeight='regular' textAlign='center' display='block'>
								No audio files yet. Upload your first audio file!
							</VuiTypography>
						) : (
							<Stack spacing={2}>
								{audioFiles.map((audio) => (
									<VuiBox
										key={audio.id}
										display='flex'
										flexDirection='column'
										p={2}
										sx={{
											background: 'rgba(34, 35, 75, 0.5)',
											borderRadius: '15px',
											border: '1px solid rgba(255, 255, 255, 0.125)',
										}}
									>
										<VuiBox display='flex' alignItems='center' mb={1}>
											<IconButton
												onClick={() => togglePlay(audio.id)}
												sx={{ color: info?.main || "#0075ff", mr: 1 }}
											>
												{playing === audio.id ? <FaPause /> : <FaPlay />}
											</IconButton>
											<VuiBox flexGrow={1}>
												{editingTitle === audio.id ? (
													<TextField
														value={editTitle}
														onChange={(e) => setEditTitle(e.target.value)}
														variant="standard"
														size="small"
														fullWidth
														autoFocus
														onKeyPress={(e) => {
															if (e.key === 'Enter') {
																saveTitle(audio.id);
															}
														}}
														InputProps={{
															endAdornment: (
																<>
																	<IconButton 
																		size="small" 
																		onClick={() => saveTitle(audio.id)}
																		sx={{ color: 'success.main' }}
																	>
																		✓
																	</IconButton>
																	<IconButton 
																		size="small" 
																		onClick={cancelEditTitle}
																		sx={{ color: 'error.main' }}
																	>
																		✕
																	</IconButton>
																</>
															),
															sx: { color: 'white' }
														}}
													/>
												) : (
													<VuiTypography 
														color='white' 
														variant='button' 
														fontWeight='bold'
														onClick={() => startEditTitle(audio.id, audio.title)}
														sx={{ cursor: 'pointer' }}
													>
														{audio.title || audio.originalName}
													</VuiTypography>
												)}
											</VuiBox>
											<IconButton
												onClick={() => handleDelete(audio.id)}
												sx={{ color: 'error.main' }}
											>
												<FaTrash size="14px" />
											</IconButton>
										</VuiBox>

										<VuiBox display='flex' alignItems='center' width='100%' mb={1}>
											<Slider
												value={currentTime[audio.id] || 0}
												max={duration[audio.id] || 100}
												onChange={(_, newValue) => handleSliderChange(audio.id, newValue)}
												aria-labelledby="audio-slider"
												sx={{
 												color: info?.main || "#0075ff",
													height: 4,
													'& .MuiSlider-thumb': {
														width: 12,
														height: 12,
														transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
														'&:hover, &.Mui-focusVisible': {
 														boxShadow: `0px 0px 0px 8px ${info?.main || "#0075ff"}33`,
														},
													},
												}}
											/>
										</VuiBox>

										<VuiBox display='flex' alignItems='center'>
											<VuiTypography color='text' variant='caption' mr={1}>
												{formatTime(currentTime[audio.id] || 0)}
											</VuiTypography>
											<VuiBox flexGrow={1} />
											<VuiTypography color='text' variant='caption'>
												{formatTime(duration[audio.id] || 0)}
											</VuiTypography>
										</VuiBox>

										<VuiBox display='flex' justifyContent='center' mt={1}>
											<IconButton
												onClick={() => handleRewind(audio.id)}
												sx={{ color: info?.main || "#0075ff", mx: 1 }}
											>
												<FaStepBackward size="14px" />
											</IconButton>
											<IconButton
												onClick={() => handleRestart(audio.id)}
												sx={{ color: info?.main || "#0075ff", mx: 1 }}
											>
												<FaUndo size="14px" />
											</IconButton>
										</VuiBox>

										<audio
											ref={(el) => {
												if (el) {
													audioRefs.current[audio.id] = el;
													el.addEventListener('timeupdate', () => handleTimeUpdate(audio.id));
													el.addEventListener('loadedmetadata', () => {
														setDuration(prev => ({ ...prev, [audio.id]: el.duration }));
														// Set initial position if available
														if (audio.lastPosition && audio.lastPosition > 0) {
															el.currentTime = audio.lastPosition;
															setCurrentTime(prev => ({ ...prev, [audio.id]: audio.lastPosition }));
														}
													});
												}
											}}
											src={API_BASE + audio.url}
											onEnded={() => {
												setPlaying(null);
												// Reset position to 0 when ended
												savePosition(audio.id, 0);
											}}
										/>
									</VuiBox>
								))}
							</Stack>
						)}
					</VuiBox>
				</VuiBox>
				<VuiBox display='flex' flexDirection='column' mt={4} mb={2}>
					<TextField
						label="Audio Title"
						variant="outlined"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						sx={{
							mb: 2,
							'& .MuiOutlinedInput-root': {
								color: 'white',
								'& fieldset': {
									borderColor: 'rgba(255, 255, 255, 0.3)',
								},
								'&:hover fieldset': {
									borderColor: 'rgba(255, 255, 255, 0.5)',
								},
								'&.Mui-focused fieldset': {
									borderColor: info?.main || "#0075ff",
								},
							},
							'& .MuiInputLabel-root': {
								color: 'rgba(255, 255, 255, 0.7)',
							},
						}}
					/>
					<Button
						variant="contained"
						component="label"
						startIcon={<FaUpload />}
						sx={{
							bgcolor: info?.main || "#0075ff",
							'&:hover': {
								bgcolor: info?.dark || "#0062d6",
							},
						}}
						disabled={uploading}
					>
						Upload Audio
						<input
							type="file"
							accept="audio/*"
							hidden
							onChange={handleFileUpload}
						/>
					</Button>
				</VuiBox>
			</VuiBox>
		</Card>
	);
}

export default AudioCard;
