"use client";

import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "DASHBOARD", href: "/dashboard" },
    { name: "HISTORY", href: "/history" },
    { name: "SCHEDULED", href: "/scheduled" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#000000] border-b border-[#FF5A00] border-opacity-30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[24px] md:px-[48px] flex items-center justify-between h-[80px]">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <Zap className="text-[#FF5A00]" size={32} strokeWidth={2.5} />
          <span className="font-heading font-extrabold uppercase tracking-tight text-white text-3xl">
            WriteAI
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[18px] uppercase font-medium transition-colors ${
                pathname === link.href ? "text-[#FF5A00]" : "text-white hover:text-[#FF5A00]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white hover:text-[#FF5A00] transition-colors h-[48px] w-[48px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF5A00]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[80px] bg-black z-40 flex flex-col items-center justify-center space-y-8 px-4 border-[24px] border-[#FF5A00] border-t-0 rounded-b-[24px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-3xl font-heading font-extrabold uppercase tracking-widest transition-colors ${
                pathname === link.href ? "text-[#FF5A00]" : "text-white hover:text-[#FF5A00]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
