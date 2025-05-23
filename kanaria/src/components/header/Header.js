import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../../contexts/index";
import UseActiveForms from "../../contexts/UseActiveForms";

import "./Header.css";
import Logo from "../../images/Logo_site.svg";
import { Role } from "../../models/enums";

const Header = () => {
    const { currentUser, logout, hasRole } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const shopDropdownRef = useRef(null);
    const location = useLocation();
    const { hasActiveForms, loading: loadingForms } = UseActiveForms();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
                setShopDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isSuperAdmin = () => {
        return hasRole(Role.SUPER_ADMIN);
    };

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/");
    };

    const getUserInitials = () => {
        if (!currentUser || !currentUser.email) return "U";
        return currentUser.email.charAt(0).toUpperCase();
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleShopDropdown = () => {
        setShopDropdownOpen(!shopDropdownOpen);
    };


    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <Link to={"/"} className={location.pathname === "/" ? "active" : ""}>
                        <img id="logoKanaria" src={Logo} alt="KanariaTeam" />
                    </Link>

                </div>
                <nav className="navbar">
                    <ul>

                        {!currentUser && (<li><Link to={"/"} className={`liens ${location.pathname === "/" ? "active" : ""}`}>Accueil</Link></li>)}
                        {!currentUser && (<li><Link to={"/roster"} className={`liens ${location.pathname === "/roster" ? "active" : ""}`}>Roster</Link></li>)}
                        {!currentUser && (<li><Link to={"/kanaria"} className={`liens ${location.pathname === "/kanaria" ? "active" : ""}`}>Kanaria</Link></li>)}
                        {!currentUser && (<li><Link to={"/news"} className={`liens ${location.pathname === "/news" ? "active" : ""}`}>Actualités</Link></li>)}
                        {!currentUser && (<li><Link to={"/contact"} className={`liens ${location.pathname === "/contact" ? "active" : ""}`}>Contact</Link></li>)}
                        {!currentUser && (<li><Link to={"/shop"} className={`liens ${location.pathname === "/shop" ? "active" : ""}`}>Boutique</Link></li>)}
                        {/* Formulaires publics - visible si des formulaires actifs existent */}
                        {!loadingForms && hasActiveForms && !currentUser && (
                            <li>
                                <Link to={"/forms"} className={`liens ${location.pathname === "/forms" ? "active" : ""}`}>
                                    Formulaires
                                </Link>
                            </li>
                        )}

                        {/* Menu Admin - visible pour ADMIN et SUPER_ADMIN */}
                        {currentUser && (
                            <li><Link to={"/admin/forms-list"} className={`liens ${location.pathname.includes("/admin/form") ? "active" : ""}`}>Formulaires</Link></li>
                        )}


                        {/* Menu boutique avec dropdown */}
                        {currentUser && (
                            <li className="dropdown-nav-item" ref={shopDropdownRef}>
                                <Link
                                    className={`dropdown-nav-btn liens ${location.pathname.includes('/shop') ? "active" : ""}`}
                                    onClick={toggleShopDropdown}
                                >
                                    Boutique <FaChevronDown className={`dropdown-icon ${shopDropdownOpen ? "open" : ""}`} />
                                </Link>
                                {shopDropdownOpen && (
                                    <ul className="dropdown-nav-menu">

                                        <li>
                                            <Link to="/admin/shop/products" className={location.pathname.includes('/admin/shop/products') ? 'active' : ''}
                                                onClick={toggleShopDropdown}
                                            >
                                                Produits
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/admin/shop/categories" className={location.pathname.includes('/admin/shop/categories') ? 'active' : ''}
                                                onClick={toggleShopDropdown}
                                            >
                                                Catégories
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        )}


                        {currentUser && (
                            <li><Link to={"/admin/news"} className={`liens ${location.pathname === "/admin/news" ? "active" : ""}`}>Actualité</Link></li>
                        )}

                        {/* Lien Comptes - visible uniquement pour SUPER_ADMIN */}
                        {currentUser && isSuperAdmin() && (
                            <li><Link to={"/admin/accounts"} className={`liens ${location.pathname === "/admin/accounts" ? "active" : ""}`}>Comptes</Link></li>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Section utilisateur avec dropdown */}
            <div className="user-section" ref={dropdownRef}>
                {currentUser ? (
                    <>
                        <div className="user-avatar" onClick={toggleDropdown}>
                            <div className="avatar-circle">{getUserInitials()}</div>
                        </div>
                        {dropdownOpen && (
                            <div className="user-dropdown">
                                <div className="dropdown-header">
                                    <div className="user-greeting">Bonjour,</div>
                                    <div className="user-email">{currentUser.email}</div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <ul className="d-menu">
                                    <li>
                                        <Link to="/profile" className="dropdown-item">
                                            <FaUser /> Mon profil
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/settings" className="dropdown-item">
                                            <FaCog /> Paramètres
                                        </Link>
                                    </li>
                                    <div className="dropdown-divider"></div>
                                    <li>
                                        <button onClick={handleLogout} className="logout-item dropdown-item ">
                                            <FaSignOutAlt /> Se déconnecter
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/admin/auth" className="login-btn">
                            Admin
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;