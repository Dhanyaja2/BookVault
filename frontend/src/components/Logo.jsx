import React from "react";
// import { BookOpen } from "lucide-react";
import { LibraryBig } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center">
      <LibraryBig className="size-15" />
      <h1 className="itim-regular text-4xl font-bold ">BookVault</h1>
    </div>
  );
};

export default Logo;
