"use client";

import Image from 'next/image'; 
import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Header({ theme, toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/'},
    { label: 'property', href: "/#properties"},
    { label: 'About us', href: "/#about-us"},
    { label: 'Contact us', href: "/#contact"},
  ];

  return (
    <header className="sticky top-0 z-50 bg-[rgb(var(--color-background))]/95 backdrop-blur border-b border-[rgb(var(--color-border))]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Image
              src="/icon/home_app_logo.svg"
              alt="Global Living Exchange Logo"
              width={35}
              height={35}
            />
            <span className="text-[rgb(var(--color-primary))] font-semibold text-xl md:text-2xl">
              Global Living Exchange
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link
              href="/login"
              className="text-base md:text-lg text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
              >
              Log in
            </Link>
            <Link 
              href="/signup"
              className="px-6 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-full hover:opacity-90 transition-opacity text-base md:text-lg font-medium">
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgb(var(--color-border))]">
            <div className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col space-y-2 border-t border-[rgb(var(--color-border))]">
                <button className="text-[rgb(var(--color-foreground))] hover:text-[rgb(var(--color-primary))] transition-colors text-left">
                  Log in
                </button>
                <button className="px-6 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-full hover:opacity-90 transition-opacity">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
