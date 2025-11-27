import React from "react";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="flex w-[120px] h-[50px] justify-center items-center rounded-3xl bg-[#aca8a8] text-black font-bold hover:bg-[#868484] text-lg inter cursor-pointer"
      onClick={() => navigate("/login")}
    >
      Login
    </button>
  );
};

export default LoginButton;
