"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Link from "@mui/material/Link";
import { Box, Button, Container, styled } from "@mui/material";
import AccountModal from "@/components/organism/AccountModal";
import AppLogo from "@/playground_assets/logos/main logo.png";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { useActions, useAppSelector } from "@/store/hooks";
// import { isUserLoggedIn } from "@/utils/userUtils";  this was declared multiple times on line 70

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const NavWrapper = styled(Container)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "0.9rem",
  "@media (min-width: 481px) and (max-width: 767px)": {
    width: "auto",
  },
  "@media (min-width: 320px) and (max-width: 480px)": {
    width: "auto",
  },
});

const MenuWrapper = styled(Menu)({
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
  "& a": {
    color: "white",
    textDecoration: "none",
  },
});

const LargeMenuWrapper = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
  "& a": {
    color: "white",
    padding: "0px 20px",
    textDecoration: "none",
  },
  "@media (min-width: 481px) and (max-width: 767px)": {
    display: "none",
  },
  "@media (min-width: 320px) and (max-width: 480px)": {
    display: "none",
  },
});

const AccountWrapper = styled(Box)({
  display: "flex",
  "& a": {
    color: "#ddd",
    padding: "0px 20px",
  },
  "@media (min-width: 481px) and (max-width: 767px)": {
    "& a": {
      padding: "0px 0px",
    },
  },
  "@media (min-width: 320px) and (max-width: 480px)": {
    "& a": {
      padding: "0px 0px",
    },
  },
});

const ButtonWrapper = styled(Button)({
  borderRadius: "2.5rem",
  padding: "0.1rem 0.4rem",
  fontSize: "0.8rem",
  backgroundImage: "linear-gradient(to bottom, teal, #0f3d93)",
  backgroundColor: "teal",
  color: "#fff",
  margin: "0px 5px",
});

export default function Nav() {
  const isUserLoggedIn = useAppSelector((state) => state.userInfo.isLoggedIn);
  const userName = useAppSelector((state) => state.userInfo.userName);
  const { openAccountModal, closeAccountModal } = useActions();
  // pages to be routed
  const pages = ["Help", "Board Game", "About", "Contact"];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  // open navigation menu
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  // close navigation menu
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <NavWrapper>
        <Toolbar
          sx={{
            justifyContent: { xs: "space-evenly" },
            width: "100%",
          }}
          disableGutters
        >
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Image
              src={AppLogo}
              alt="callit"
              width={100}
              height={40}
              priority
            />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <MenuWrapper
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link
                    href="#"
                    textAlign="center"
                    color={"#000000"}
                    style={{
                      color: "#000000",
                    }}
                  >
                    {page}
                  </Link>
                </MenuItem>
              ))}
            </MenuWrapper>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Image
              src={AppLogo}
              alt="callit"
              width={100}
              height={40}
              style={{
                width: "15vw",
              }}
              priority
            />
          </Typography>
          <LargeMenuWrapper
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            {pages.map((page) => (
              <Link
                href="#"
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Link>
            ))}
          </LargeMenuWrapper>

          <Box sx={{ flexGrow: 0 }}>
            <ClickAwayListener onClickAway={() => closeAccountModal()}>
              <Box sx={{ position: "relative" }}>
                <AccountWrapper>
                  {isUserLoggedIn ? (
                    <ButtonWrapper
                      variant="contained"
                      onClick={() => {
                        openAccountModal("logout");
                      }}
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      {userName}
                    </ButtonWrapper>
                  ) : (
                    <>
                      <ButtonWrapper
                        variant="contained"
                        onClick={() => {
                          openAccountModal("login");
                        }}
                      >
                        Login
                      </ButtonWrapper>
                      <ButtonWrapper
                        variant="contained"
                        onClick={() => {
                          openAccountModal("register");
                        }}
                      >
                        Register
                      </ButtonWrapper>
                    </>
                  )}
                </AccountWrapper>
                <AccountModal />
              </Box>
            </ClickAwayListener>
          </Box>
        </Toolbar>
      </NavWrapper>{" "}
    </AppBar>
  );
}
