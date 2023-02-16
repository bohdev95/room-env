import React from "react";
import Navigation from "./Navigation";

interface Props {
  design?: boolean;
  children: JSX.Element;
}
const Layout: React.FC<Props> = ({ design, children }) => {
  return (
    <>
      <Navigation design={design} />
      {children}
    </>
  );
};

export default Layout;
