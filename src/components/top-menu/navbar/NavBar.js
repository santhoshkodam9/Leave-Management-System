import React, { useEffect, useState } from 'react'
import '../TopMenu.css';
import { NavLink } from "react-router-dom";

export const NavBar = (props) => {
    const [loginStatus, setLoginStatus] = useState(false);
    const [username, setUsername] = useState("");

    var navItem;
    useEffect(() => {
        var user = sessionStorage.getItem("username");
        setUsername(user);
        if (user !== "" && user !== null && user !== undefined) {
            setLoginStatus(true);
        } else {
            setLoginStatus(false);
        }
    }, []);

    function logout() {
        sessionStorage.removeItem("username");
        setLoginStatus(false);
        window.location.href = "http://localhost:3000/login";
    }

    if (props.item.type === "login") {
        navItem = (!loginStatus && <li data-testid="nav-element"> <NavLink to={props.item?.path} className="nav-link" > {props.item.title} </NavLink></li>);
    } else if (props.item.type === "signup") {
        navItem = (!loginStatus && <li data-testid="nav-element"> <NavLink to={props.item?.path} className="nav-link"  > {props.item.title} </NavLink></li>);
    }
    else if (props.item.type === "linkProfile") {
        navItem = (loginStatus && <li data-testid="nav-element"> {username} <img src={process.env.PUBLIC_URL + props.item.image} className="profile-icon" alt="logo" /></li>)
    } else {
        navItem = (loginStatus && <li data-testid="nav-element">
            <a onClick={logout} href="/" className="nav-link" ><i className="fa fa-sign-out" aria-hidden="true"></i>{props.item.title}</a></li>)
    }

    return (<>
        {navItem}
    </>)
}
