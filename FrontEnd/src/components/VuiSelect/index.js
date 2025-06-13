import { forwardRef } from "react";
import PropTypes from "prop-types";
import { Select } from "@mui/material";

const VuiSelect = forwardRef(({ error, success, disabled, ...rest }, ref) => {
  return (
    <Select
      {...rest}
      ref={ref}
      sx={{
        height: "37px",
        width: "100%",
        "& .MuiOutlinedInput-notchedOutline": {
          border: "2px solid",
          borderColor: error ? "red" : "rgba(226, 232, 240, 0.3)",
        },
        "& .MuiSelect-icon": {
          color: "white",
        },
        "& .MuiSelect-select": {
          color: "white",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: error ? "red" : "info.main",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: error ? "red" : "rgba(226, 232, 240, 0.5)",
        },
        "&.Mui-disabled": {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(226, 232, 240, 0.3)",
          },
          "& .MuiSelect-select": {
            color: "rgba(255, 255, 255, 0.5)",
          },
          "& .MuiSelect-icon": {
            color: "rgba(255, 255, 255, 0.5)",
          },
        },
        ...rest.sx,
      }}
    />
  );
});

// Setting default values for the props of VuiSelect
VuiSelect.defaultProps = {
  error: false,
  success: false,
  disabled: false,
};

// Typechecking props for the VuiSelect
VuiSelect.propTypes = {
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default VuiSelect;
