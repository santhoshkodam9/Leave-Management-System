import { NavLink } from 'react-router-dom';
import React, { Component } from "react";
import loginRegisterService from "../../services/login-register-service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../cards/Form.css'

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

export class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            role: '',
            mobileNumber: 0,
            error: {
                username: '',
                password: '',
                role: '',
                mobileNumber: '',
            }
        }
    }
    componentDidMount() {
        setTimeout(topMenu, 1);
        function topMenu() {
            if (window.location.href.toString().includes("create") && document.querySelector(".add-btn")) {
                document.querySelector(".add-btn").style.display = "none";
            }
        }
    }
    componentWillUnmount() {
    }
    onFormSubmit = async (event) => {
        event.preventDefault();
        let error = { ...this.state.error };
        var username = document.querySelector("[name=username]").value;
        var password = document.querySelector("[name=password]").value;
        var role = document.querySelector("[name=role]").value;
        var mobileNumber = document.querySelector("[name=mobileNumber]").value;
        if (!username) {
            error.username = "User Name Required";
            this.setState({
                error,
                [username]: username
            });
        }
        if (!password) {
            error.password = "Password Required";
            this.setState({
                error,
                [password]: password
            });
        }
        if (!role) {
            error.role = "Role Required";
            this.setState({
                error,
                [role]: role
            });
        }
        if (!mobileNumber) {
            error.mobileNumber = "Mobile Number Required";
            this.setState({
                error,
                [mobileNumber]: mobileNumber
            });
        }

        var allFields = username === '' || password === '' || role === '' || mobileNumber === '';
        if (validation(this.state) && !allFields) {
            let regObj = {
                "username": username,
                "password": password,
                "role": role,
                "mobileNumber": mobileNumber
            }
            loginRegisterService.register(regObj).then((res) => {
                console.log(res);
                toast.success("Registered Successfully", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
                window.location.href = "http://localhost:3000/employee"
            }).catch(err => {
                console.log(err);
                toast.error("Something went wrong", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            });
        } else {
            console.log("Error occured");
            toast.error("Form Fields are Invalid", {
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
                let unamepattern = /^[a-zA-Z0-9_.]+$/;
                error.username = value.length === 0 ? "User Name Required" : !unamepattern.exec(value) ? "Only Alphbets & Numbers are allowed" : "";
                break;
            case "password":
                let passpattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
                error.password = value.length === 0 ? "Password Required" : value.length < 5 ? "Password should be min 5 char" : !passpattern.exec(value) ? "Password contain atleast 1 upper,lowercase, digit, special character" : "";
                break;
            case "role":
                error.role = value === "" ? "Role Required" : "";
                break;
            case "mobileNumber":
                error.mobileNumber = value.length === 0 ? "MobileNumber Required" : value.length !== 10 ? "MobileNumber should be exactly 10 digits" : "";
                break;
            default:
                break;
        }
        this.setState({
            error,
            [name]: value
        });
    };

    render() {
        const { error } = this.state;
        return (
            <>
                <span className='go-back-user'>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "link-active" : "link")} > <img src={process.env.PUBLIC_URL + "/assets/chevron-left-solid.svg"} className="left-arrow" alt="logo" /> Back</NavLink>
                </span>
                <div className="add-form-container">
                    <form className="add-form" onSubmit={this.onFormSubmit} noValidate>
                        <h1 className='add-form-head'>Register Details</h1>

                        <div className="form-group ">
                            <label className="mb-2">USER NAME</label>
                            <input required type="text" name="username" className={error.username.length > 0 ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.username.length > 0 && (
                                <span className="invalid-feedback">{error.username}</span>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-2">PASSWORD</label>
                            <input required type="url" name="password" id="password" className={error.password.length > 0 ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.password.length > 0 && (
                                <span className="invalid-feedback">{error.password}</span>
                            )}
                        </div>
                        <div className="form-group mb-3">
                            <label className="mb-2">ROLE</label>
                            <select required name="role" id="role" onChange={this.formObject} className={error.role.length > 0 ? "is-invalid form-control" : "form-control"}>
                                <option value="">Please select role...</option>
                                <option value="HR">HR</option>
                                <option value="MANAGER">MANAGER</option>
                                <option value="EMPLOYEE">EMPLOYEE</option>
                            </select>
                            {error.role.length > 0 && (
                                <span className="invalid-feedback">{error.role}</span>
                            )}
                        </div>
                        <div className="form-group mb-3">
                            <label className="mb-2">MOBILE NUMBER</label>
                            <input required type="number" name="mobileNumber" className={(error.mobileNumber.length > 0 && error.mobileNumber.length !== 10) ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {(error.mobileNumber.length > 0 && error.mobileNumber.length !== 10) && (
                                <span className="invalid-feedback">{error.mobileNumber}</span>
                            )}
                        </div>
                        <div className="d-grid mt-3">
                            <button type="submit" className="reg btn btn-block btn-primary" style={{ width: "100%" }} >Register & Continue</button>
                        </div>
                    </form>
                    <ToastContainer />
                </div>

            </>
        );
    }
}