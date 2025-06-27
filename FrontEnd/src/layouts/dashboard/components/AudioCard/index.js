import React, { useState, useRef, useEffect } from 'react';
import { Card, Stack, Button, TextField, IconButton, Slider } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import { FaEllipsisH, FaPlay, FaPause, FaUpload, FaTrash, FaStepBackward, FaUndo } from 'react-icons/fa';
import { fetchAudioFiles } from 'services/audioService';
import axiosInstance from 'services/axiosInstance';
import AuthService from 'services/AuthService';

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

	const isAdmin = AuthService.getCurrentUser()?.roles?.includes('ROLE_ADMIN') || false;

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
				height: 'auto',
				background: 'rgba(0,0,0,0)',
				backdropFilter: 'blur(10px)',
				border: '1px solid rgba(255, 255, 255, 0.125)'
			}}>
			<VuiBox>
				<VuiBox
					display='flex'
					alignItems='center'
					justifyContent='space-beetween'
					sx={{ width: '100%' }}
					mb='24px'>
					<VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
						Audio Library
					</VuiTypography>
					{isAdmin && (
						<VuiBox
							display='flex'
							justifyContent='center'
							alignItems='center'
							bgColor='#22234B'
							sx={{ width: '37px', height: '37px', cursor: 'pointer', borderRadius: '12px' }}>
							<FaEllipsisH color={info?.main || "#0075ff"} size='18px' />
						</VuiBox>
					)}
				</VuiBox>

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
							<VuiBox display='flex' alignItems='center' mb={2}>
								<IconButton
									onClick={() => togglePlay(audio.id)}
									sx={{ color: playing === audio.id ? info?.main : 'white' }}
								>
									{playing === audio.id ? <FaPause /> : <FaPlay />}
								</IconButton>
								{editingTitle === audio.id ? (
									<TextField
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
										size="small"
										sx={{
											flex: 1,
											mx: 1,
											'& .MuiOutlinedInput-root': {
												color: 'white',
												'& fieldset': {
													borderColor: 'rgba(255, 255, 255, 0.3)',
												},
											},
										}}
									/>
								) : (
									<VuiTypography
										variant='button'
										color='white'
										fontWeight='regular'
										sx={{ flex: 1, mx: 2 }}
									>
										{audio.title || audio.originalName}
									</VuiTypography>
								)}
								{isAdmin && (
									<>
										{editingTitle === audio.id ? (
											<VuiBox>
												<Button
													variant="contained"
													color="success"
													size="small"
													onClick={() => saveTitle(audio.id)}
													sx={{ mr: 1 }}
												>
													Save
												</Button>
												<Button
													variant="contained"
													color="error"
													size="small"
													onClick={cancelEditTitle}
												>
													Cancel
												</Button>
											</VuiBox>
										) : (
											<IconButton
												onClick={() => handleDelete(audio.id)}
												sx={{ color: 'white' }}
											>
												<FaTrash />
											</IconButton>
										)}
									</>
								)}
							</VuiBox>
							<VuiBox display='flex' alignItems='center'>
								<VuiTypography variant='caption' color='text' sx={{ width: '50px' }}>
									{formatTime(currentTime[audio.id] || 0)}
								</VuiTypography>
								<Slider
									value={currentTime[audio.id] || 0}
									max={duration[audio.id] || 0}
									onChange={(e, value) => handleSliderChange(audio.id, value)}
									sx={{
										mx: 2,
										color: info?.main || "#0075ff",
										'& .MuiSlider-thumb': {
											width: 8,
											height: 8,
											transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
											'&:hover, &.Mui-focusVisible': {
												boxShadow: 'none',
											},
										},
									}}
								/>
								<VuiTypography variant='caption' color='text' sx={{ width: '50px' }}>
									{formatTime(duration[audio.id] || 0)}
								</VuiTypography>
								<IconButton
									onClick={() => handleRestart(audio.id)}
									sx={{ color: 'white', ml: 1 }}
								>
									<FaUndo />
								</IconButton>
							</VuiBox>
							<audio
								ref={(element) => audioRefs.current[audio.id] = element}
								src={API_BASE + audio.url}
								onTimeUpdate={() => handleTimeUpdate(audio.id)}
								onLoadedMetadata={() => {
									setDuration(prev => ({ ...prev, [audio.id]: audioRefs.current[audio.id].duration }));
									// Set initial position if available
									if (audio.lastPosition && audio.lastPosition > 0) {
										audioRefs.current[audio.id].currentTime = audio.lastPosition;
										setCurrentTime(prev => ({ ...prev, [audio.id]: audio.lastPosition }));
									}
								}}
								onEnded={() => {
									setPlaying(null);
									// Reset position to 0 when ended
									savePosition(audio.id, 0);
								}}
							/>
						</VuiBox>
					))}
				</Stack>

				{isAdmin && (
					<VuiBox display='flex' flexDirection='column' mt={4}>
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
				)}
			</VuiBox>
		</Card>
	);
}

export default AudioCard;
