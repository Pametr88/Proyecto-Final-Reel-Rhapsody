import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext.js';
import { Link } from 'react-router-dom';
import Logo from "../../img/Logo.png";
import Logout from './Logout.jsx';
import "../../styles/secondNavbar.css";

const SecondNavbar = () => {
    const {store, actions} = useContext(Context);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    return (
        <>
            <nav className="main-nav">
                <div className="nav-container">
                    <Link to={"/home"}>
                        <img src={Logo} className="logo" />
                    </Link>
                    <h2>Reel Rhapsody</h2>
                </div>
                {store.currentUser &&
                <div className='cont-btns'>
                    <div className="dropdown">
                        <button
                            className={`dropdown-btn dropdown-toggle ${isDropdownOpen ? 'active' : ''}`}
                            type="button"
                            onClick={toggleDropdown}
                        >
                            MENU&nbsp;
                        </button>
                        <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} onBlur={closeDropdown}>
                            <li></li>
                            <li><Link to="/demo">Actors</Link></li>
                            <li></li>
                            <hr />
                            <li>
                                <Logout />
                            </li>
                        </ul>
                    </div>                     
                    <div>
                    <button className='user-btn'>
                        {store.currentUser.full_name}
                    </button>
                    </div>                                       
                </div>
                }
            </nav>
        </>
    );
};

export default SecondNavbar;