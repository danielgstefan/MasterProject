

// @mui material components
import Grid from "@mui/material/Grid";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

function Footer() {
  return (
    <VuiBox
      component="footer"
      py={6}
      sx={({ breakpoints }) => ({
        maxWidth: "450px",
        [breakpoints.down("xl")]: {
          maxWidth: "400px",
        },
      })}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <VuiTypography
            variant="button"
            sx={{ textAlign: "center", fontWeight: "400 !important" }}
            color="text"
          >
            @ 2025, Made with ❤️&nbsp;&nbsp;&nbsp; by{" "}
            <VuiTypography
                component="a"
                variant="button"
                href="https://www.linkedin.com/in/daniel-stefan-grosu-744b4b20b/"
                sx={{ textAlign: "center", fontWeight: "500 !important" }}
                color="white"
                mr="2px"
            >
              Grosu Daniel Stefan
            </VuiTypography>
            <VuiTypography
              ml="2px"
              mr="2px"
              component="a"
              variant="button"
              href="#"
              sx={{ textAlign: "center", fontWeight: "500 !important" }}
              color="text"
            >
            </VuiTypography>
          </VuiTypography>
        </Grid>

      </Grid>
    </VuiBox>
  );
}

export default Footer;
