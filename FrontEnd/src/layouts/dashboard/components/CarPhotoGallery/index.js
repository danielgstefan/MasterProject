import React, { useState, useEffect } from 'react';
import { Card, Stack, Button, TextField, IconButton, Grid } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import { FaEllipsisH, FaUpload, FaTrash, FaEdit } from 'react-icons/fa';
import { fetchCarPhotos, uploadCarPhoto, updateCarPhotoTitle, deleteCarPhoto } from 'services/carPhotoService';
import axiosInstance from 'services/axiosInstance';
const API_BASE = 'http://localhost:8081'; // Adjust if backend runs elsewhere

function CarPhotoGallery() {
	const { info = {} } = colors || {};
	const [carPhotos, setCarPhotos] = useState([]);
	const [newTitle, setNewTitle] = useState('');
	const [editingPhoto, setEditingPhoto] = useState(null);
	const [editTitle, setEditTitle] = useState('');
	const [uploading, setUploading] = useState(false);

	// Fetch photos from backend
	useEffect(() => {
		fetchCarPhotos()
			.then(res => setCarPhotos(Array.isArray(res.data) ? res.data : []))
			.catch(() => setCarPhotos([]));
	}, []);

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
			setUploading(true);
			try {
				const res = await uploadCarPhoto(file, newTitle);
				if (res.status === 200) {
					setCarPhotos(prev => [...prev, res.data]);
					setNewTitle('');
				}
			} finally {
				setUploading(false);
			}
		}
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this photo?')) {
			await deleteCarPhoto(id);
			setCarPhotos(prev => prev.filter(photo => photo.id !== id));
			if (editingPhoto === id) {
				setEditingPhoto(null);
			}
		}
	};

	const startEditPhoto = (id, currentTitle) => {
		setEditingPhoto(id);
		setEditTitle(currentTitle || '');
	};

	const cancelEditPhoto = () => {
		setEditingPhoto(null);
		setEditTitle('');
	};

	const savePhoto = async (id) => {
		if (editTitle.trim() === '') return;

		try {
			// Update title
			await updateCarPhotoTitle(id, editTitle);

			// Refresh the photo list
			const res = await fetchCarPhotos();
			setCarPhotos(Array.isArray(res.data) ? res.data : []);

			setEditingPhoto(null);
			setEditTitle('');
		} catch (error) {
			console.error('Error updating photo:', error);
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
			<VuiBox sx={{ width: '100%' }}>
				<VuiBox
					display='flex'
					alignItems='center'
					justifyContent='space-beetween'
					sx={{ width: '100%' }}
					mb='40px'>
					<VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
						Car Photo Gallery
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
						{carPhotos.length === 0 ? (
							<VuiTypography color='text' variant='button' fontWeight='regular' textAlign='center' display='block'>
								No car photos yet. Upload your first car photo!
							</VuiTypography>
						) : (
							<Grid container spacing={2}>
								{carPhotos.map((photo) => (
									<Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={photo.id}>
										<VuiBox
											display='flex'
											flexDirection='column'
											p={2}
											sx={{
												background: 'rgba(34, 35, 75, 0.5)',
												borderRadius: '15px',
												border: '1px solid rgba(255, 255, 255, 0.125)',
											}}
										>
											{editingPhoto === photo.id ? (
												<>
													<TextField
														label="Title"
														value={editTitle}
														onChange={(e) => setEditTitle(e.target.value)}
														variant="outlined"
														size="small"
														fullWidth
														sx={{
															mb: 2,
															'& .MuiOutlinedInput-root': {
																color: 'white',
																'& fieldset': {
																	borderColor: 'rgba(255, 255, 255, 0.3)',
																},
															},
															'& .MuiInputLabel-root': {
																color: 'rgba(255, 255, 255, 0.7)',
															},
														}}
													/>
													<VuiBox display="flex" justifyContent="space-between">
														<Button 
															variant="contained" 
															color="success" 
															onClick={() => savePhoto(photo.id)}
														>
															Save
														</Button>
														<Button 
															variant="contained" 
															color="error" 
															onClick={cancelEditPhoto}
														>
															Cancel
														</Button>
													</VuiBox>
												</>
											) : (
												<>
													<VuiBox mb={2} sx={{ position: 'relative' }}>
														<img 
															src={API_BASE + photo.url} 
															alt={photo.title || photo.originalName}
															style={{ 
																width: '100%', 
																height: '150px', 
																objectFit: 'cover',
																borderRadius: '10px'
															}}
														/>
														<VuiBox 
															sx={{ 
																position: 'absolute', 
																top: '10px', 
																right: '10px',
																display: 'flex',
																gap: '5px'
															}}
														>
															<IconButton
																onClick={() => startEditPhoto(photo.id, photo.title)}
																sx={{ 
																	color: 'white',
																	backgroundColor: 'rgba(0, 0, 0, 0.5)',
																	'&:hover': {
																		backgroundColor: 'rgba(0, 0, 0, 0.7)',
																	}
																}}
																size="small"
															>
																<FaEdit size="14px" />
															</IconButton>
															<IconButton
																onClick={() => handleDelete(photo.id)}
																sx={{ 
																	color: 'white',
																	backgroundColor: 'rgba(255, 0, 0, 0.5)',
																	'&:hover': {
																		backgroundColor: 'rgba(255, 0, 0, 0.7)',
																	}
																}}
																size="small"
															>
																<FaTrash size="14px" />
															</IconButton>
														</VuiBox>
													</VuiBox>
													<VuiTypography 
														color='white' 
														variant='button' 
														fontWeight='bold'
													>
														{photo.title || photo.originalName}
													</VuiTypography>
												</>
											)}
										</VuiBox>
									</Grid>
								))}
							</Grid>
						)}
					</VuiBox>
					<VuiBox display='flex' flexDirection='column' mb={2} mt={4}>
						<TextField
							label="Photo Title"
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
							Upload Photo
							<input
								type="file"
								accept="image/*"
								hidden
								onChange={handleFileUpload}
							/>
						</Button>
					</VuiBox>
				</VuiBox>
			</VuiBox>
		</Card>
	);
}

export default CarPhotoGallery;
