

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
// Import the BMW logo image
import bmwLogo from "../../assets/images/bmwlogo.png";

function SimmmpleLogo({ size }) {
  return (
    <img
      src={bmwLogo}
      alt="BMW Logo"
      style={{ width: size, height: 'auto' }}
    />
  );
}
// Setting default values for the props of SimmmpleLogo
SimmmpleLogo.defaultProps = {
  color: "dark",
  size: "16px",
};

// Typechecking props for the SimmmpleLogo
SimmmpleLogo.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
    "white",
  ]),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SimmmpleLogo;
