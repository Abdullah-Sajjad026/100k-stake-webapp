"use client";
import Image from "next/image";
import {MenuIcon} from "lucide-react";
import Drawer from "react-modern-drawer";
import ASSETS from "../assets";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";


const Header = () => {
  // A header that becomes fixed to the top of the screen when the user scrolls past it.
  // Transparent glassed effect with a shadow.
  return (
    <header
      className="fixed top-0 left-0 right-0 z-10 shadow-md py-2 h-16
    bg-white bg-opacity-80 backdrop-filter backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ease-in-out"
    >
      <div className="container flex justify-between items-center ">
        <div className="flex items-center gap-2">
          <Image src={ASSETS.logo1x} alt="Logo" width={80} height={80}/>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden xl:inline">
            <NavBar/>
          </div>
          <span className="xl:hidden">
            <NavDrawer/>
          </span>
          <w3m-button/>
        </div>
      </div>
    </header>
  );
};

const NavBar = () => {
  const pathname = usePathname();

  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Pools",
      href: "/pools",
    },
    {
      name: "Supporting Networks & Staking Assets",
      href: "/networks",
    },
    {
      name: "Team",
      href: "/team",
    },
    {
      name: "Referral",
      href: "/referral",
    },
    {
      name: "Analytics",
      href: "/analytics/overview",
    },
    {
      name: "Swap",
      href: "/swap",
    },
    {
      name: "Audit",
      href: "/audit",
    },
    {
      name: "FAQ",
      href: "/faqs",
    },
  ];
  // A nav component using tailwind classes, nextjs link component with above links in array looping
  // that shows links in flex row while above lg endpoint and in column with consistent spacing on below screens
  return (
    <nav className="flex xl:flex-row gap-4 flex-col xl:items-center">
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.name}
          className={pathname.startsWith(link.href) ? "font-bold" : ""}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

const NavDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <MenuIcon
        className="cursor-pointer hover:scale-105 transition-transform ease-in duration-75"
        onClick={() => setIsOpen((prev) => !prev)}
      />
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='right'

      >
        <div className="p-4 bg-accent h-full">
          <NavBar/>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
