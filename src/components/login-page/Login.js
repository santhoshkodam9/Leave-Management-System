import './Login.css';
import React, { Component } from "react";
import loginRegisterService from "../../services/login-register-service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const usernamePattern = /^[a-zA-Z0-9]+$/;
const validation = ({ error, ...rest }) => {
    let checkValidation = false;
    Object.values(error).forEach(val => {
        if (val.length > 0) {
            checkValidation = false
        } else {
            checkValidation = true
        }
    });
    Object.values(rest).forEach(val => {
        if (val === null) {
            checkValidation = false
        } else {
            checkValidation = true
        }
    });
    return checkValidation;
};

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            error: {
                username: '',
                password: '',
            }
        }
    }
    onFormSubmit = async (event) => {
        event.preventDefault();
        let error = { ...this.state.error };
        var username = document.querySelector("[name=username]").value;
        var password = document.querySelector("[name=password]").value;
        if (!username) {
            error.username = "Username Required";
            this.setState({
                error,
                [username]: username
            })
        }
        if (!password) {
            error.password = "Password Required";
            this.setState({
                error,
                [password]: password
            })
        }
        var allFields = username === '' || password === '';
        var errorsLength = document.querySelectorAll(".invalid-feedback").length;
        if (validation(this.state) && !allFields && errorsLength === 0) {
            let loginObj = {
                "username": username,
                "password": password
            }
            loginRegisterService.login(loginObj).then((res) => {
                console.log(res);
                let loggedData = res;
                if (loggedData.data.loginMessage === "Login Success") {
                    toast.success("Login Success", {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                    sessionStorage.setItem("username", this.state.username);
                    sessionStorage.setItem("userId", loggedData.data.userId);
                    let role = loggedData.data.role;
                    if (role === "EMPLOYEE") {
                        window.location.href = "http://localhost:3000/employee/dashboard";
                    } else if (role === "HR") {
                        window.location.href = "http://localhost:3000/hr/dashboard";
                    } else {
                        window.location.href = "http://localhost:3000/manager/dashboard";
                    }
                } else if (loggedData.data.loginMessage === "Invalid Password") {
                    toast.error("Invalid Password", {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                } else {
                    toast.error("Invalid UserName", {
                        position: toast.POSITION.BOTTOM_CENTER
                    });
                }
            }).catch(err => {
                console.log(err);
                toast.error("Not added something went wrong", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            });
        } else {
            console.log("Error occured");
            toast.error("Credentials & Fields are Invalid", {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
    };
    formObject = event => {
        event.preventDefault();

        const { name, value } = event.target;
        let error = { ...this.state.error };

        switch (name) {
            case "username":
                error.username = value.length === 0 ? "User Name Required" : !value.match(usernamePattern) ? "Enter Valid UserName inlcludes only letters & Digits" : "";
                break;
            case "password":
                error.password = value.length === 0 ? "Password Required" : value.length < 5 ? "Password should be minimum 5 characters" : "";
                break;
            default:
                break;
        }
        this.setState({
            error,
            [name]: value
        })
    };

    render() {

        const { error } = this.state;

        return (
            <>
                <div className="login-container">
                    <form className="login-form" onSubmit={this.onFormSubmit} noValidate>
                        <h2 className='login-heading'>Login Page</h2>
                        <div className="form-group ">
                            <label className="mb-2"><strong>User Name</strong></label>
                            <input required type="text" name="username" className={error.username.length > 0 ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.username.length > 0 && (
                                <span className="invalid-feedback">{error.username}</span>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-2"><strong>Password</strong></label>
                            <input required type="text" name="password" className={error.password.length > 0 ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.password.length > 0 && (
                                <span className="invalid-feedback">{error.password}</span>
                            )}
                        </div>

                        <div className="d-grid mt-3">
                            <button type="submit" className="btn btn-block btn-primary">Submit</button>
                        </div> <br />
                    </form>
                    <ToastContainer />
                </div>

            </>
        );
    }
}