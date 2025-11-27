import React from "react";

const Footer = () => {
  return (
    <footer className="mt-20 py-6 text-center text-gray-800 text-sm border-t border-black/10">
      <p>
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">BookVault</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
