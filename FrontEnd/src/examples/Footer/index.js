// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

function Footer() {
  return (
    <VuiBox
      component="footer"
      sx={{
        width: "100%",
        position: "relative",
        bottom: 0,
        mt: "auto",
        backgroundColor: "transparent",
      }}
    >
      <VuiBox
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems="center"
        px={3}
        py={2}
      >
        <VuiBox item="true" xs={12} sx={{ textAlign: "center" }}>
          <VuiTypography
            variant="button"
            sx={{ textAlign: "center", fontWeight: "400 !important" }}
            color="white"
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
          </VuiTypography>
        </VuiBox>
        <VuiBox item="true" xs={10}>
          <VuiBox display="flex" justifyContent="center" flexWrap="wrap" mb={{ xs: 2, lg: 0 }}>
            <VuiBox mr={{ xs: "20px", lg: "46px" }}>
              <VuiTypography
                component="a"
                href="https://www.creative-tim.com/templates"
                variant="body2"
                color="white"
              >
                Marketplace
              </VuiTypography>
            </VuiBox>
            <VuiBox mr={{ xs: "20px", lg: "46px" }}>
              <VuiTypography
                component="a"
                href="https://www.creative-tim.com/blog"
                variant="body2"
                color="white"
              >
                Blog
              </VuiTypography>
            </VuiBox>
            <VuiBox>
              <VuiTypography
                component="a"
                href="https://www.creative-tim.com/license"
                variant="body2"
                color="white"
              >
                License
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
}

export default Footer;
