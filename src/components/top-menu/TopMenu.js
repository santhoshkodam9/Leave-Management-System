/* eslint-disable no-lone-blocks */
import React from 'react'
import './TopMenu.css';
import { NavBar } from './navbar/NavBar';
export const TopMenu = () => {

    const menudata =
        [
            {
                type: "login",
                title: "Login",
                path: "/login"
            },
            {
                type: "signup",
                title: "Sign Up",
                path: "/register"
            },
            {
                type: "linkProfile",
                title: "This Month",
                image: "/assets/profileimage.png"
            },
            {
                type: "button",
                title: "Logout",
            },

        ]
    return (<>
        <div className="banner">
            <div data-testid="navbar" className="navbar">
                <img src={process.env.PUBLIC_URL + "/assets/logo.jfif"} className="logo desktop-menu" alt="logo" />
                <ul className="desktop-menu" >
                    {
                        menudata.map((item, index) => <NavBar key={index} item={item} index={index} />)
                    }
                </ul>
            </div>
        </div>
    </>)

}
