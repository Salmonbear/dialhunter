import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} DialHunter. Your marketplace for time.<br />DialHunter Ltd - UK Based</p>
        <nav className="footer-nav">
          <Link href="/about">About</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="social-icons">
          {/* Replace with actual icons/links later */}
          <Link href="#">f</Link>
          <Link href="#">i</Link>
          <Link href="#">t</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 