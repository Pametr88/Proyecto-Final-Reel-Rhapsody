import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext.js';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../../img/Logo.png";
import Logout from './Logout.jsx';
import "../../styles/secondNavbar.css";
import defaultAvatar from "../../img/defaultAvatar.png";

const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const handlerEdit = async (currentUser) => {
        navigate("/CustUser", { state: { currentUser: currentUser } });
    }

    return (
        <>
            <nav className="main-nav">

                <div className="d-flex justify-content-center align-items-center">
                    <Link to={"/"}>
                        <img src={Logo} className="logo" />
                    </Link>

                    <h2 className="nav-title">Reel Rhapsody</h2>
                </div>
                {store.currentUser ?
                
                    <div className='logouser-drop'>
                        <div className='me-4'>
                        <h5>Welcome {store.currentUser.full_name}</h5>
                        </div>
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
                                    <li><Link to={"/viewBigList"}>Pending Popcorn</Link></li>
                                    <li><Link to="/demo">Actors</Link></li>
                                    {store.currentUser.admin && (
                                    <li><Link to="/listUsers">All Users</Link></li>
                                    )}
                                    <hr />
                                    <li>
                                        <Logout />
                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div>
                            <button className='user-btn' onClick={() => handlerEdit(store.currentUser)}>
                                <img className="w-100 h-100 rounded-circle" src={store.currentUser?.avatar ? store.currentUser.avatar : defaultAvatar} alt="" />
                            </button>
                        </div>
                        
                    </div>

                    :

                    <div className="nav-butons">

                        <Link to="/login">

                            <button type="button" className="btn btn-nav info-buton">Log In</button>

                        </Link>

                        <Link to="/signup">

                            <button type="button" className="btn btn-nav button-right info-buton">Sign Up</button>

                        </Link>

                    </div>

                }
            </nav>
        </>
    );
};

export default Navbar;