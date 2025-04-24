import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">DialHunter</Link>
        {/* Simple text search icon for now */}
        <div className="search-icon">🔍</div>
        {/* We can add Link to search page later */}
      </nav>
    </header>
  );
};

export default Header; 