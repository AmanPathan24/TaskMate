import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, User, Sun, Moon, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, token, logout } = useContext(AuthContext);
  const isAuthenticated = !!token;

  // Toggle theme (Dark Mode bonus)
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  // Set theme on initial load
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="header-wrapper">
      <div className="container header-container">
        {/* Left: Brand Logo */}
        <div className="header-logo" onClick={handleLogoClick}>
          <img src="/TaskMate Logo.png" alt="TaskMate Logo" className="header-logo-img" />
          <span>TaskMate</span>
        </div>

        {/* Middle: Airbnb style Mock Search Pill */}
        <div className="search-pill">
          <span className="search-pill-item">Search tasks</span>
          <span className="search-pill-item muted">Priority</span>
          <span className="search-pill-item muted">Status</span>
          <button className="search-pill-btn">
            <Search size={14} />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="header-actions">
          <button
            className="dark-mode-toggle"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="profile-dropdown-wrapper" ref={dropdownRef}>
            <div className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <Menu size={18} className="profile-trigger-menu" />
              <div className="profile-avatar">
                {isAuthenticated && user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User size={18} />
                )}
              </div>
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                {isAuthenticated ? (
                  <>
                    <div style={{ padding: '8px 16px', fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Hello, {user?.name || 'Student'}
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/" className="dropdown-link" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-action logout" onClick={handleLogout}>
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-link" style={{ fontWeight: '600' }} onClick={() => setDropdownOpen(false)}>
                      Log In
                    </Link>
                    <Link to="/register" className="dropdown-link" onClick={() => setDropdownOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
