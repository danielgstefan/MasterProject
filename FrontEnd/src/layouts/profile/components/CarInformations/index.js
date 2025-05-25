import React, { useState, useEffect } from "react";
import {
	Card,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Grid
} from "@mui/material";
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	ArrowBackIosNew,
	ArrowForwardIos,
	Close as CloseIcon
} from "@mui/icons-material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import colors from "assets/theme/base/colors";
import CarService from "services/CarService";
import AuthService from "services/AuthService";

const CarInformations = () => {
	const { info } = colors;

	const [cars, setCars] = useState([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [editingCar, setEditingCar] = useState(null);
	const [formData, setFormData] = useState({
		alias: "",
		brand: "",
		model: "",
		horsePower: "",
		torque: "",
		bio: "",
		photoUrl: ""
	});
	const [selectedFile, setSelectedFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

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
			if (err.response?.status === 401) {
				setCars([]);
				setError(null);
			} else {
				setError("Failed to load cars.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleOpenDialog = (car = null) => {
		if (car) {
			setEditingCar(car);
			setFormData({
				alias: car.alias || "",
				brand: car.brand || "",
				model: car.model || "",
				horsePower: car.horsePower || "",
				torque: car.torque || "",
				bio: car.bio || "",
				photoUrl: car.photoUrl || ""
			});
			setImagePreview(car.photoUrl || null);
		} else {
			setEditingCar(null);
			setFormData({ alias: "", brand: "", model: "", horsePower: "", torque: "", bio: "", photoUrl: "" });
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
			[name]: ["horsePower", "torque"].includes(name) ? (value ? parseInt(value) : "") : value
		});
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async () => {
		try {
			if (!formData.alias) {
				setError("Alias is required");
				return;
			}
			let photoUrl = formData.photoUrl;
			if (selectedFile) {
				const uploadResponse = await CarService.uploadCarImage(selectedFile);
				photoUrl = `http://localhost:8081${uploadResponse.data.message}`;
			}
			const carData = { ...formData, photoUrl };
			if (editingCar) {
				await CarService.updateCar(editingCar.id, carData);
			} else {
				await CarService.createCar(carData);
			}
			await fetchCars();
			handleCloseDialog();
		} catch (err) {
			setError("Save failed. Try again.");
		}
	};

	const handleDeleteCar = async (id) => {
		if (window.confirm("Are you sure you want to delete this car?")) {
			await CarService.deleteCar(id);
			const updatedCars = cars.filter((car) => car.id !== id);
			setCars(updatedCars);

			// Ajustează indexul activ dacă e cazul
			if (activeIndex >= updatedCars.length) {
				setActiveIndex(Math.max(0, updatedCars.length - 1));
			}
		}
	};

	const user = AuthService.getCurrentUser();
	const currentCar = cars[activeIndex] || null;


	return (
		<Card sx={{ width: "100%" }}>
			<VuiBox p={3}>
				<VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
					<VuiTypography variant="lg" color="white" fontWeight="bold">
						Car Information
					</VuiTypography>
					<VuiButton variant="contained" color="info" onClick={() => handleOpenDialog()} startIcon={<AddIcon />}>
						Add Car
					</VuiButton>
				</VuiBox>
				<VuiTypography color="text" mb={2}>
					{user ? `Hello, ${user.firstName} ${user.lastName}! Manage your cars here.` : "Please log in."}
				</VuiTypography>

				{loading ? (
					<VuiTypography>Loading...</VuiTypography>
				) : error ? (
					<VuiTypography color="error">{error}</VuiTypography>
				) : cars.length === 0 ? (
					<VuiTypography>You don't have any cars yet.</VuiTypography>
				) : (
					<VuiBox
						position="relative"
						width="100%"
						sx={{ display: "flex", justifyContent: "center" }}
					>
						{}
						<IconButton
							onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : cars.length - 1))}
							sx={{
								position: "absolute",
								top: "50%",
								left: 0,
								transform: "translateY(-50%)",
								zIndex: 10,
								backgroundColor: "rgba(0, 123, 255, 0.35)", // un albastru deschis, transparent
								"&:hover": { backgroundColor: "rgba(0, 123, 255, 0.3)" }
							}}
						>
							<ArrowBackIosNew sx={{ color: "white" }} />
						</IconButton>

						{}
						<VuiBox
							sx={{
								display: "flex",
								flexDirection: { xs: "column", sm: "row" },
								alignItems: "flex-start",
								gap: 3,
								width: "100%",
								maxWidth: "100%",
    				background: "rgba(0, 0, 0, 0)",
								backdropFilter: "blur(10px)",
								borderRadius: "20px",
								padding: "20px",
								border: "1px solid rgba(255, 255, 255, 0.125)",
								flexWrap: "nowrap",
								justifyContent: "space-between"
							}}
						>
							{}
							{currentCar?.photoUrl && (
								<VuiBox
									component="img"
									src={currentCar.photoUrl}
									alt={currentCar.alias}
									sx={{
										width: { xs: "100%", sm: "400px", md: "480px" },
										height: { xs: "240px", sm: "280px", md: "320px" },
										maxWidth: { xs: "100%", sm: "50%", md: "40%" },
										borderRadius: "10px",
										objectFit: "cover",
										flexShrink: 0
									}}
								/>
							)}

							{}
							<VuiBox sx={{ 
								flex: 1, 
								width: "100%", 
								maxWidth: { xs: "100%", sm: "calc(100% - 200px)", md: "calc(100% - 300px)", lg: "calc(100% - 520px)" },
								ml: { xs: 0, sm: 2 },
								mt: { xs: 2, sm: 0 }
							}}>
								<VuiTypography variant="lg" color="white" fontWeight="bold" mb={1}>
									{currentCar?.alias}
								</VuiTypography>
								<VuiTypography color="text" mb={1}>
									{currentCar?.brand} {currentCar?.model}
								</VuiTypography>
								{currentCar?.horsePower && (
									<VuiTypography color="white" mb={0.5}>
										Horsepower: {currentCar.horsePower} HP
									</VuiTypography>
								)}
								{currentCar?.torque && (
									<VuiTypography color="white" mb={0.5}>
										Torque: {currentCar.torque} Nm
									</VuiTypography>
								)}
								{currentCar?.bio && (
									<VuiTypography color="white" mb={1}>
										Bio: {currentCar.bio}
									</VuiTypography>
								)}
								<VuiBox mt={2}>
									<IconButton onClick={() => handleOpenDialog(currentCar)}>
										<EditIcon sx={{ color: info.main }} />
									</IconButton>
									<IconButton onClick={() => handleDeleteCar(currentCar.id)}>
										<DeleteIcon sx={{ color: info.main }} />
									</IconButton>
								</VuiBox>
							</VuiBox>
						</VuiBox>

						{}
						<IconButton
							onClick={() => setActiveIndex((prev) => (prev + 1) % cars.length)}
							sx={{
								position: "absolute",
								top: "50%",
								right: 0,
								transform: "translateY(-50%)",
								zIndex: 10,
								backgroundColor: "rgba(0, 123, 255, 0.35)", // un albastru deschis, transparent
								"&:hover": { backgroundColor: "rgba(0, 123, 255, 0.3)" }
							}}
						>
							<ArrowForwardIos sx={{ color: "white" }} />
						</IconButton>
					</VuiBox>
				)}

				<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
					<DialogTitle>
						<VuiBox display="flex" justifyContent="space-between">
							<VuiTypography>{editingCar ? "Edit Car" : "Add New Car"}</VuiTypography>
							<IconButton onClick={handleCloseDialog}><CloseIcon /></IconButton>
						</VuiBox>
					</DialogTitle>
					<DialogContent>
						<Grid container spacing={2}>
							{[
								{ label: "Alias", name: "alias" },
								{ label: "Brand", name: "brand" },
								{ label: "Model and Year", name: "model" },
								{ label: "Horsepower", name: "horsePower", type: "number" },
								{ label: "Torque", name: "torque", type: "number" },
								{ label: "Bio", name: "bio", multiline: true, rows: 3 }
							].map((field) => (
								<Grid item xs={12} md={6} key={field.name}>
									<VuiTypography>{field.label}</VuiTypography>
									<VuiInput
										name={field.name}
										value={formData[field.name]}
										onChange={handleInputChange}
										fullWidth
										type={field.type || "text"}
										multiline={field.multiline || false}
										rows={field.rows || undefined}
									/>
								</Grid>
							))}

							<Grid item xs={12}>
								<VuiTypography>Photo</VuiTypography>
								<VuiBox onClick={() => document.getElementById("car-photo-input").click()} sx={{ border: "1px dashed", p: 2, cursor: "pointer" }}>
									<input
										id="car-photo-input"
										type="file"
										accept="image/*"
										hidden
										onChange={handleFileChange}
									/>
									{imagePreview ? (
										<VuiBox component="img" src={imagePreview} alt="Preview" sx={{ width: "100%", maxHeight: "200px" }} />
									) : (
										<VuiTypography>Click to upload</VuiTypography>
									)}
								</VuiBox>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<VuiButton onClick={handleCloseDialog} color="error">Cancel</VuiButton>
						<VuiButton onClick={handleSubmit} color="info">{editingCar ? "Update" : "Add"} Car</VuiButton>
					</DialogActions>
				</Dialog>
			</VuiBox>
		</Card>
	);
};

export default CarInformations;
