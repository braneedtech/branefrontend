import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import branenew from '../../assets/braneignitelogo.svg'
// Import Bootstrap Icons CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = ({ homepage_header }) => {
    const { nav_links, brane_logo } = homepage_header;
    const navigate = useNavigate();
    const login = () => {
        navigate("/login");
    }
    const signup = () => {
        navigate("/signup")
    }

    // const [toggleNavMenu, setToggleNavMenu] = useState(false)

    // const onToggle = () => {
    //     setToggleNavMenu(!toggleNavMenu)
    // }

    const [toggleNavMenu, setToggleNavMenu] = useState(false);

    const onToggle = () => {
        setToggleNavMenu(!toggleNavMenu);
    };

    const closeMenu = () => {
        setToggleNavMenu(false);
    };




    const returnRoute = (index) => {
        let route;
        switch (index) {
            case 0:
                route = "/";
                break;
            case 1:
                route = "/aboutus"
                break;
            case 2:
                route = "/contactus"
                break;
            case 3:
                route = "/"
                break;
            case 4:
                route = "/"
                break;
            default:
                route = ""
        }
        return route
    }
    return (
        <>
            <section className="homepage__header">
                <section className="homepage__header__section">
                    <article className="homepage__header__section__img">
                        <img src={brane_logo} alt="logo" />
                    </article>
                    <article className="homepage__header__section__menu">
                        <ul>
                            {
                                nav_links.map((element, index) => {
                                    return (<li key={index}>
                                        <Link to={returnRoute(index)} key={index}>{element}</Link>
                                    </li>)
                                })
                            }
                        </ul>
                    </article>
                    <article className="homepage__header__section__buttons">
                        <button className="loginbutton" onClick={login}>Login</button>
                        <button onClick={signup}>Sign Up</button>
                    </article>
                    <div className='homepage__header__section__Hamburger'>
                        <button onClick={() => onToggle()}>
                            <i className="bi bi-list"></i>
                        </button>
                        {
                            toggleNavMenu && (
                                <div className='toggledropdown'>
                                    <div className="close">
                                        <button className="close-button" onClick={closeMenu}>
                                    <i className="bi bi-x"></i>
                                </button>
                                </div>

                                    <ul>
                                        {
                                            nav_links.map((element, index) => {
                                                return (<li key={index}>
                                                    <Link to={returnRoute(index)} key={index}>{element}</Link>
                                                </li>)
                                            })
                                        }

                                    </ul>
                                    <div className='dropdown-btns'>
                                        {/* <button>
                                            Singup
                                        </button> */}
                                        <button className="loginbutton" onClick={login}>Login</button>
                                        <button onClick={signup}>Sign Up</button>

                                        {/* <button>Login</button> */}
                                    </div>
                                </div>
                            )
                        }
                    </div>

                </section>
            </section>

        </>
    )
}
export default Header;