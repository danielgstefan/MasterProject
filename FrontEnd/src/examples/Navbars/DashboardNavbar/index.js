import { useState, useEffect } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";

// MUI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";

// Vision UI components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Styles
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Context & assets
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { useAuth } from "../../../context/AuthContext";
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";

function DashboardNavbar({ absolute, light, isMini }) {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [notifMenuAnchorEl, setNotifMenuAnchorEl] = useState(null);

  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  const handleUserMenuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  const handleNotifMenuOpen = (event) => setNotifMenuAnchorEl(event.currentTarget);
  const handleNotifMenuClose = () => setNotifMenuAnchorEl(null);

  const handleLogout = () => {
    logout();
    history.push("/authentication/sign-in");
  };

  return (
      <AppBar
          position={absolute ? "absolute" : navbarType}
          color="inherit"
          sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
      >
        <Toolbar sx={(theme) => navbarContainer(theme)}>
          <VuiBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
            <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          </VuiBox>
          {!isMini && (
              <VuiBox sx={(theme) => navbarRow(theme, { isMini })}>
                <VuiBox pr={1}>
                  <VuiInput
                      placeholder="Type here..."
                      icon={{ component: "search", direction: "left" }}
                      sx={({ breakpoints }) => ({
                        [breakpoints.down("sm")]: { maxWidth: "80px" },
                        [breakpoints.only("sm")]: { maxWidth: "80px" },
                        backgroundColor: "info.main !important",
                      })}
                  />
                </VuiBox>
                <VuiBox color={light ? "white" : "inherit"}>
                  {user ? (
                      <>
                        <IconButton size="small" color="inherit" onClick={handleUserMenuOpen}>
                          <Icon>account_circle</Icon>
                          <VuiTypography
                              variant="button"
                              fontWeight="medium"
                              color={light ? "white" : "dark"}
                              ml={1}
                          >
                            {user.username}
                          </VuiTypography>
                        </IconButton>
                        <Menu
                            anchorEl={userMenuAnchorEl}
                            open={Boolean(userMenuAnchorEl)}
                            onClose={handleUserMenuClose}
                        >
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                      </>
                  ) : (
                      <Link to="/authentication/sign-in">
                        <IconButton size="small" color="inherit">
                          <Icon>account_circle</Icon>
                          <VuiTypography
                              variant="button"
                              fontWeight="medium"
                              color={light ? "white" : "dark"}
                          >
                            Sign In
                          </VuiTypography>
                        </IconButton>
                      </Link>
                  )}
                  <IconButton
                      size="small"
                      color="inherit"
                      sx={navbarMobileMenu}
                      onClick={handleMiniSidenav}
                  >
                    <Icon className={"text-white"}>{miniSidenav ? "menu_open" : "menu"}</Icon>
                  </IconButton>
                  <IconButton
                      size="small"
                      color="inherit"
                      sx={navbarIconButton}
                      onClick={handleConfiguratorOpen}
                  >
                    <Icon>settings</Icon>
                  </IconButton>
                  <IconButton
                      size="small"
                      color="inherit"
                      sx={navbarIconButton}
                      aria-controls="notification-menu"
                      aria-haspopup="true"
                      onClick={handleNotifMenuOpen}
                  >
                    <Icon className={light ? "text-white" : "text-dark"}>notifications</Icon>
                  </IconButton>
                  <Menu
                      anchorEl={notifMenuAnchorEl}
                      open={Boolean(notifMenuAnchorEl)}
                      onClose={handleNotifMenuClose}
                      sx={{ mt: 2 }}
                  >
                    <NotificationItem
                        image={<img src={team2} alt="person" />}
                        title={["New message", "from Laur"]}
                        date="13 minutes ago"
                        onClick={handleNotifMenuClose}
                    />
                    <NotificationItem
                        image={<img src={logoSpotify} alt="person" />}
                        title={["New album", "by Travis Scott"]}
                        date="1 day"
                        onClick={handleNotifMenuClose}
                    />
                    <NotificationItem
                        color="text"
                        image={
                          <Icon fontSize="small" sx={{ color: ({ palette: { white } }) => white.main }}>
                            payment
                          </Icon>
                        }
                        title={["", "Payment successfully completed"]}
                        date="2 days"
                        onClick={handleNotifMenuClose}
                    />
                  </Menu>
                </VuiBox>
              </VuiBox>
          )}
        </Toolbar>
      </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
