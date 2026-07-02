import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
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

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const priority = searchParams.get('priority') || '';
  const status = searchParams.get('status') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt:desc';

  const handleParamChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page to 1 when search or filter changes
    newParams.delete('page');
    setSearchParams(newParams);

    // If user is on a different page, route them back to dashboard with the queries
    if (window.location.pathname !== '/') {
      navigate(`/?${newParams.toString()}`);
    }
  };

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
    // Clear filters and go home
    setSearchParams({});
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

        {/* Middle: Airbnb style Interactive Search Pill */}
        {isAuthenticated && (
          <div className="search-pill">
            <div className="search-pill-item">
              <input
                type="text"
                className="search-pill-input"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => handleParamChange('search', e.target.value)}
              />
            </div>
            
            <div className="search-pill-item">
              <select
                className="search-pill-select"
                value={priority}
                onChange={(e) => handleParamChange('priority', e.target.value)}
              >
                <option value="">Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="search-pill-item">
              <select
                className="search-pill-select"
                value={status}
                onChange={(e) => handleParamChange('status', e.target.value)}
              >
                <option value="">Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="search-pill-item last">
              <select
                className="search-pill-select"
                value={sortBy}
                onChange={(e) => handleParamChange('sortBy', e.target.value)}
                style={{ minWidth: '85px' }}
              >
                <option value="createdAt:desc">Sort: Newest</option>
                <option value="dueDate:asc">Sort: Soonest</option>
                <option value="dueDate:desc">Sort: Latest</option>
                <option value="title:asc">Sort: A-Z</option>
              </select>
            </div>
            
            <button className="search-pill-btn" onClick={() => navigate('/')}>
              <Search size={14} />
            </button>
          </div>
        )}

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
                {isAuthenticated && user?.profileImage ? (
                  <img 
                    src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`} 
                    alt={user.name} 
                  />
                ) : isAuthenticated && user?.name ? (
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
