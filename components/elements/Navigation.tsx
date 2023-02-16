import React from "react";
import styles from "../../styles/components/Nav.module.css";
import Link from "next/link";

interface Props {
  design?: boolean;
  onSubmit?: () => void;
}
const Navigation: React.FC<Props> = ({ design }) => {
  const navs = [
    { label: "new address", path: "new-address" },
    { label: "progress", path: "progress" },
    { label: "locations", path: "locations" },
    { label: "design", path: "design" },
    { label: "submit", path: "submit" },
  ];
  return (
    <>
      <nav>
        <ul className={styles.nav}>
          {navs.map((nav, index) => {
            return !design ? (
              nav.path === "design" ? null : (
                <li key={index}>
                  <Link
                    href={{
                      pathname: `/${
                        nav.path === "new-address" ? "homePage" : nav.path
                      }`,
                    }}
                  >
                    {nav.label}
                  </Link>

                  <div className={styles.borderBottom}></div>
                </li>
              )
            ) : (
              <li key={index}>
                <a href={`/${nav.path}`}>{nav.label}</a>
                <div className={styles.borderBottom}></div>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
