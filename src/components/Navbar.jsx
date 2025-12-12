import { useState, useEffect } from "react";
import { navLinks } from "../constants/Abt";
import JoinBtn from "./JoinBtn";
import Hamburger from "./Hamburger";
import { useMediaQuery } from "react-responsive";
import { Link, Link as RouterLink } from "react-router-dom";
import User from "./User";

const Navbar = ({ user }) => {
  const isMedScreen = useMediaQuery({ minWidth: 770, maxWidth: 1500 });
  const isSmallScreen = useMediaQuery({ maxWidth: 769 });
  const isHam = useMediaQuery({ maxWidth: 1501 });
  const [scrolled, setScrolled] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (hash) => {
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <header
      className={`navbar ${scrolled ? "scrolled pb-[10px]" : "not-scrolled"} ${
        isSmallScreen
          ? `py-[10px] px-5 mt-0 h-[60px]`
          : isMedScreen
          ? `pt-[30px] px-[50px] mt-0 `
          : `py-5 px-5 mt-0 `
      }`}
    >
      <div className={`inner `}>
        <Link to="/" onClick={() => scrollToSection("hero")}>
          <div
            className={`logo ${
              isSmallScreen ? `text-[25px]` : isMedScreen ? `text-[40px]` : ``
            }`}
          >
            <div className="flex items-center ml-[20px]">Zimer</div>
          </div>
        </Link>

        {isMedScreen ? null : (
          <nav className="desktop">
            <ul>
              {navLinks.map(({ link, name }) => (
                <li key={name} className="group px-5">
                  {link === "#rooms" ? (
                    <RouterLink to="/search">
                      <span className="text-[22px]">{name}</span>
                      <span className="underline" />
                    </RouterLink>
                  ) : (
                    <Link to="/" onClick={() => scrollToSection(link)}>
                      <span className="text-[22px]">{name}</span>
                      <span className="underline" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
        {isHam ? (
          <div
            className="h-[22px] w-[22px]"
            onClick={() => setShowHamburger(true)}
          >
            <img src="/images/menu.png" alt="menu" />
          </div>
        ) : user ? (
          <>
            <User imgPath={user.profilePicture} user={user} />
          </>
        ) : (
          <JoinBtn />
        )}
        <Hamburger
          show={showHamburger}
          onClose={() => setShowHamburger(false)}
        />
      </div>
    </header>
  );
};

export default Navbar;
