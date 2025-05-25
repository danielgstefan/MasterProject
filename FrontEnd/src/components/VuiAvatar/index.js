

import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for VuiAvatar
import VuiAvatarRoot from "components/VuiAvatar/VuiAvatarRoot";

const VuiAvatar = forwardRef(({ bgColor, size, shadow, ...rest }, ref) => (
  <VuiAvatarRoot ref={ref} ownerState={{ shadow, bgColor, size }} {...rest} />
));

// Setting default values for the props of VuiAvatar
VuiAvatar.defaultProps = {
  bgColor: "rgba(0, 0, 0, 0)",
  size: "md",
  shadow: "none",
};

// Typechecking props for the VuiAvatar
VuiAvatar.propTypes = {
  bgColor: PropTypes.oneOf([
    "rgba(0, 0, 0, 0)",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"]),
  shadow: PropTypes.oneOf(["none", "xs", "sm", "md", "lg", "xl", "xxl", "inset"]),
};

export default VuiAvatar;
