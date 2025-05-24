/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useState, useEffect } from 'react';
import { Card, Stack, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import VuiInput from 'components/VuiInput';
import VuiButton from 'components/VuiButton';
import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import CarService from 'services/CarService';
import AuthService from 'services/AuthService';

const CarInformations = () => {
	const { gradients, info, dark } = colors;
	const { cardContent } = gradients;

	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [editingCar, setEditingCar] = useState(null);
	const [formData, setFormData] = useState({
		alias: '',
		brand: '',
		model: '',
		horsePower: '',
		torque: '',
		bio: '',
		photoUrl: ''
	});
	const [selectedFile, setSelectedFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	// Fetch cars on component mount
	useEffect(() => {
		fetchCars();
	}, []);

	const fetchCars = async () => {
		setLoading(true);
		try {
			const response = await CarService.getUserCars();
			setCars(response.data);
			setError(null);
		} catch (err) {
			console.error('Error fetching cars:', err);
			// If it's a 401 error, just set cars to empty array without showing error
			if (err.response && err.response.status === 401) {
				setCars([]);
				setError(null);
			} else {
				setError('Failed to load cars. Please try again later.');
			}
		} finally {
			setLoading(false);
		}
	};

	const handleOpenDialog = (car = null) => {
		if (car) {
			// Edit mode
			setEditingCar(car);
			setFormData({
				alias: car.alias || '',
				brand: car.brand || '',
				model: car.model || '',
				horsePower: car.horsePower || '',
				torque: car.torque || '',
				bio: car.bio || '',
				photoUrl: car.photoUrl || ''
			});
			setImagePreview(car.photoUrl || null);
		} else {
			// Add mode
			setEditingCar(null);
			setFormData({
				alias: '',
				brand: '',
				model: '',
				horsePower: '',
				torque: '',
				bio: '',
				photoUrl: ''
			});
			setImagePreview(null);
		}
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedFile(null);
		setImagePreview(null);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: name === 'horsePower' || name === 'torque' ? (value ? parseInt(value) : '') : value
		});
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			// Create a preview for the UI
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async () => {
		try {
			// Validate required fields
			if (!formData.alias) {
				setError('Car alias is required');
				return;
			}

			// Upload file if selected
			let photoUrl = formData.photoUrl;
			if (selectedFile) {
				try {
					const uploadResponse = await CarService.uploadCarImage(selectedFile);
					if (uploadResponse.data && uploadResponse.data.message) {
						// The server returns the file URL in the message field
						photoUrl = `http://localhost:8081${uploadResponse.data.message}`;
					}
				} catch (uploadErr) {
					console.error('Error uploading image:', uploadErr);
					// Handle 401 error specifically
					if (uploadErr.response && uploadErr.response.status === 401) {
						setError('Please log in to upload images.');
					} else {
						setError('Failed to upload image. Please try again.');
					}
					return;
				}
			}

			// Convert empty strings to null for numeric fields
			const carData = {
				...formData,
				photoUrl: photoUrl,
				horsePower: formData.horsePower === '' ? null : parseInt(formData.horsePower),
				torque: formData.torque === '' ? null : parseInt(formData.torque)
			};

			if (editingCar) {
				// Update existing car
				await CarService.updateCar(editingCar.id, carData);
			} else {
				// Create new car
				console.log("🔐 User:", AuthService.getCurrentUser());
				console.log("🔐 Token:", AuthService.getToken());
				await CarService.createCar(carData);
			}

			// Refresh car list
			fetchCars();
			handleCloseDialog();
		} catch (err) {
			console.error('Error saving car:', err);
			// Handle 401 error specifically
			if (err.response && err.response.status === 401) {
				setError('Please log in to save your car information.');
			} else {
				setError('Failed to save car. Please try again.');
			}
		}
	};

	const handleDeleteCar = async (id) => {
		if (window.confirm('Are you sure you want to delete this car?')) {
			try {
				await CarService.deleteCar(id);
				fetchCars();
			} catch (err) {
				console.error('Error deleting car:', err);
				// Handle 401 error specifically
				if (err.response && err.response.status === 401) {
					setError('Please log in to delete your car.');
				} else {
					setError('Failed to delete car. Please try again.');
				}
			}
		}
	};

	const user = AuthService.getCurrentUser();

	return (
		<Card sx={{ height: '100%' }}>
			<VuiBox display='flex' flexDirection='column' height='100%'>
				<VuiBox display='flex' justifyContent='space-between' alignItems='center' mb='10px'>
					<VuiTypography variant='lg' color='white' fontWeight='bold'>
						Car Information
					</VuiTypography>
					<VuiButton 
						variant='contained' 
						color='info' 
						onClick={() => handleOpenDialog()}
						startIcon={<AddIcon />}
					>
						Add Car
					</VuiButton>
				</VuiBox>

				<VuiTypography variant='button' color='text' fontWeight='regular' mb='20px'>
					{user ? `Hello, ${user.firstName} ${user.lastName}! Manage your cars here.` : 'Please log in to manage your cars.'}
				</VuiTypography>

				{loading ? (
					<VuiBox display='flex' justifyContent='center' alignItems='center' height='200px'>
						<CircularProgress color='info' />
					</VuiBox>
				) : error ? (
					<VuiBox display='flex' justifyContent='center' alignItems='center' height='200px'>
						<VuiTypography color='error' variant='button'>
							{error}
						</VuiTypography>
					</VuiBox>
				) : cars.length === 0 ? (
					<VuiBox display='flex' justifyContent='center' alignItems='center' height='200px'>
						<VuiTypography color='text' variant='button'>
							You don't have any cars yet. Click "Add Car" to get started.
						</VuiTypography>
					</VuiBox>
				) : (
					<Grid container spacing={3}>
						{cars.map((car) => (
							<Grid item xs={12} md={6} key={car.id}>
								<VuiBox
									sx={{
										background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
										borderRadius: '20px',
										padding: '20px',
										height: '100%',
										position: 'relative'
									}}
								>
									<VuiBox display='flex' justifyContent='flex-end' position='absolute' right='10px' top='10px'>
										<IconButton size='small' onClick={() => handleOpenDialog(car)}>
											<EditIcon sx={{ color: info.main }} />
										</IconButton>
										<IconButton size='small' onClick={() => handleDeleteCar(car.id)}>
											<DeleteIcon sx={{ color: info.main }} />
										</IconButton>
									</VuiBox>

									<Grid container spacing={2}>
										<Grid item xs={12} md={car.photoUrl ? 6 : 12}>
											<VuiTypography variant='lg' color='white' fontWeight='bold'>
												{car.alias}
											</VuiTypography>
											<VuiTypography variant='button' color='text' fontWeight='regular'>
												{car.brand} {car.model}
											</VuiTypography>

											<VuiBox mt={2}>
												{car.horsePower && (
													<VuiBox mb={1}>
														<VuiTypography variant='button' color='text' fontWeight='medium'>
															Horsepower
														</VuiTypography>
														<VuiTypography variant='button' color='white' fontWeight='bold'>
															{car.horsePower} HP
														</VuiTypography>
													</VuiBox>
												)}

												{car.torque && (
													<VuiBox mb={1}>
														<VuiTypography variant='button' color='text' fontWeight='medium'>
															Torque
														</VuiTypography>
														<VuiTypography variant='button' color='white' fontWeight='bold'>
															{car.torque} Nm
														</VuiTypography>
													</VuiBox>
												)}

												{car.bio && (
													<VuiBox mt={2}>
														<VuiTypography variant='button' color='text' fontWeight='medium'>
															Bio
														</VuiTypography>
														<VuiTypography variant='button' color='white'>
															{car.bio}
														</VuiTypography>
													</VuiBox>
												)}
											</VuiBox>
										</Grid>

										{car.photoUrl && (
											<Grid item xs={12} md={6}>
												<VuiBox
													component='img'
													src={car.photoUrl}
													alt={car.alias}
													sx={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														borderRadius: '10px',
														maxHeight: '200px'
													}}
												/>
											</Grid>
										)}
									</Grid>
								</VuiBox>
							</Grid>
						))}
					</Grid>
				)}

				{/* Add/Edit Car Dialog */}
				<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='md' fullWidth>
					<DialogTitle>
						<VuiBox display='flex' justifyContent='space-between' alignItems='center'>
							<VuiTypography variant='h6'>{editingCar ? 'Edit Car' : 'Add New Car'}</VuiTypography>
							<IconButton onClick={handleCloseDialog}>
								<CloseIcon />
							</IconButton>
						</VuiBox>
					</DialogTitle>
					<DialogContent>
						<VuiBox component='form' role='form' mt={2}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<VuiTypography variant='button' color='text' fontWeight='medium'>
										Car Alias (required)
									</VuiTypography>
									<VuiInput
										placeholder='My Awesome Car'
										name='alias'
										value={formData.alias}
										onChange={handleInputChange}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<VuiTypography variant='button' color='text' fontWeight='medium'>
										Brand
									</VuiTypography>
									<VuiInput
										placeholder='BMW'
										name='brand'
										value={formData.brand}
										onChange={handleInputChange}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<VuiTypography variant='button' color='text' fontWeight='medium'>
										Model
									</VuiTypography>
									<VuiInput
										placeholder='M3'
										name='model'
										value={formData.model}
										onChange={handleInputChange}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<VuiTypography variant='button' color='text' fontWeight='medium'>
										Horsepower
									</VuiTypography>
									<VuiInput
										placeholder='450'
										name='horsePower'
										value={formData.horsePower}
										onChange={handleInputChange}
										type='number'
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<VuiTypography variant='button' color='text' fontWeight='medium'>
										Torque (Nm)
									</VuiTypography>
									<VuiInput
										placeholder='550'
										name='torque'
										value={formData.torque}
										onChange={handleInputChange}
										type='number'
										fullWidth
									/>
								</Grid>
								<Grid item xs={12}>
									<VuiTypography variant='button' color='text' fontWeight='medium'>
										Bio
									</VuiTypography>
									<VuiInput
										placeholder='Tell us about your car...'
										name='bio'
										value={formData.bio}
										onChange={handleInputChange}
										multiline
										rows={4}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12}>
									<VuiTypography variant='button' color='text' fontWeight='medium'>
										Car Photo
									</VuiTypography>
									<VuiBox
										sx={{
											border: '1px dashed',
											borderColor: 'rgba(255, 255, 255, 0.2)',
											borderRadius: '10px',
											p: 2,
											textAlign: 'center',
											cursor: 'pointer',
											mt: 1
										}}
										onClick={() => document.getElementById('car-photo-input').click()}
									>
										<input
											id='car-photo-input'
											type='file'
											accept='image/*'
											style={{ display: 'none' }}
											onChange={handleFileChange}
										/>
										{imagePreview ? (
											<VuiBox
												component='img'
												src={imagePreview}
												alt='Car Preview'
												sx={{
													maxWidth: '100%',
													maxHeight: '200px',
													borderRadius: '10px'
												}}
											/>
										) : (
											<VuiTypography variant='button' color='text'>
												Click to upload a photo
											</VuiTypography>
										)}
									</VuiBox>
								</Grid>
							</Grid>
						</VuiBox>
					</DialogContent>
					<DialogActions>
						<VuiButton color='error' onClick={handleCloseDialog}>
							Cancel
						</VuiButton>
						<VuiButton color='info' onClick={handleSubmit}>
							{editingCar ? 'Update' : 'Add'} Car
						</VuiButton>
					</DialogActions>
				</Dialog>
			</VuiBox>
		</Card>
	);
};

export default CarInformations;
