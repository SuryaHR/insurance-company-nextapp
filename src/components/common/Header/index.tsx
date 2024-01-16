"use client";
import React, { useState } from "react";
import { RiSearch2Line } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";
import { logoutHandler } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { resetSessionState } from "@/reducers/Session/SessionSlice";
import NavStyle from "./headerStyle.module.scss";
import ProfileDetail from "./ProfileDetail";

const NavBarMenu = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const signoutHandle = () => {
    dispatch(resetSessionState());
    logoutHandler();
    router.replace("/login");
  };

  return (
    <div>
      <nav className={NavStyle.navbar}>
        {/* <div className={NavStyle.showNav}> */}
        <div className={NavStyle.companyName}>Evolution Insurance Company</div>
        <div className={NavStyle.searchBox}>
          <input type="text" placeholder="What can we help you find?" />
          <RiSearch2Line className={NavStyle.searchIcon} />
        </div>
        <ProfileDetail signoutHandle={signoutHandle} />
      </nav>
      <div className={NavStyle.toggleButton} onClick={toggleMenu}>
        <HiOutlineMenu />
      </div>
      <div className={`${NavStyle.menuItems} ${isMenuOpen ? NavStyle.show : ""}`}>
        <div className={NavStyle.calendarIcon}>Calendar Icon</div>
        <div className={NavStyle.helpText}>Help</div>
        <div className={NavStyle.signoutText} onClick={signoutHandle}>
          Sign Out
        </div>
      </div>
    </div>
  );
};

export default NavBarMenu;
