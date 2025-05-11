import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

function ProductCard({ product }) {
  const [menu, setMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const openMenu = (event) => setMenu(event.currentTarget);
  const closeMenu = () => setMenu(null);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
        transition: "transform 0.2s ease-in-out",
        transform: isHovered ? "translateY(-5px)" : "none",
      }}
    >
      {/* Product Image */}
      <VuiBox
        sx={{
          position: "relative",
          paddingTop: "75%", // 4:3 aspect ratio
          overflow: "hidden",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </VuiBox>

      {/* Product Info */}
      <VuiBox p={3}>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <VuiTypography variant="h5" fontWeight="bold" color="white">
            {product.name}
          </VuiTypography>
          <IconButton
            size="small"
            onClick={openMenu}
            sx={{ color: "white" }}
          >
            <Icon>more_vert</Icon>
          </IconButton>
        </VuiBox>

        <VuiTypography variant="body2" color="text" mb={2}>
          {product.description}
        </VuiTypography>

        <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          <VuiTypography variant="h6" fontWeight="bold" color="white">
            ${product.price.toFixed(2)}
          </VuiTypography>
          <VuiButton
            variant="contained"
            color="info"
            size="small"
          >
            Add to Cart
          </VuiButton>
        </VuiBox>
      </VuiBox>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={menu}
        open={Boolean(menu)}
        onClose={closeMenu}
        sx={{ zIndex: 9999 }}
      >
        <MenuItem onClick={closeMenu}>Add to Wishlist</MenuItem>
        <MenuItem onClick={closeMenu}>Share</MenuItem>
        <MenuItem onClick={closeMenu}>View Details</MenuItem>
      </Menu>
    </Card>
  );
}

export default ProductCard; 