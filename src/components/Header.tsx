'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>DialHunter</Link>

      {/* Desktop Navigation & Search Icon */}
      <nav className={`${styles.navLinks} ${styles.navLinksDesktop}`}>
        <Link href="/brands">Brands</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/signin">Sign in</Link>
        <Link href="/signup">Sign up</Link>
        <div className={styles.searchIconDesktop}>🔍</div>
      </nav>

      {/* Hamburger Icon - Mobile */}
      <button className={styles.hamburger} onClick={toggleMenu}>
        {isMenuOpen ? '✕' : '☰'} {/* Simple X and Burger icons */}
      </button>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <Link href="/brands" onClick={toggleMenu}>Brands</Link>
          <Link href="/pricing" onClick={toggleMenu}>Pricing</Link>
          <Link href="/signin" onClick={toggleMenu}>Sign in</Link>
          <Link href="/signup" onClick={toggleMenu}>Sign up</Link>
          {/* We can add Link to search page later */}
          <Link href="/search" onClick={toggleMenu}>Search 🔍</Link>
        </nav>
      )}
    </header>
  );
};

export default Header; 