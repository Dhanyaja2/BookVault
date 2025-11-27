import React from "react";
import Logo from "./Logo";
import LoginButton from "./LoginButton";

const Header = () => {
  return (
    <div className=" flex justify-between h-[100px] items-center">
      <Logo />
      <LoginButton />
    </div>
  );
};

export default Header;
