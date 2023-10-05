import { NavLink } from 'react-router-dom';
import React, { Component } from "react";
import employeeService from "../../services/employee-service";
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

export class Employee extends Component {

    constructor(props) {
        super(props)
        this.state = {
            employeeName: '',
            managerId: '',
            hrld: '',
            gender: '',
            annualLeave: 20,
            paternityLeave: 5,
            maternityLeave: 10,
            error: {
                employeeName: '',
                managerId: '',
                hrld: '',
                gender: '',
                annualLeave: '',
                paternityLeave: '',
                maternityLeave: ''
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
        var employeeName = document.querySelector("[name=employeeName]").value;
        var managerId = document.querySelector("[name=managerId]").value;
        var hrld = document.querySelector("[name=hrld]").value;
        var gender = document.querySelector("[name=gender]").value;
        if (!employeeName) {
            error.employeeName = "employeeName Required";
            this.setState({
                error,
                [employeeName]: employeeName
            });
        }
        if (!managerId) {
            error.managerId = "managerId Required";
            this.setState({
                error,
                [managerId]: managerId
            });
        }
        if (!hrld) {
            error.hrld = "hrld Required";
            this.setState({
                error,
                [hrld]: hrld
            });
        }
        if (!gender) {
            error.gender = "gender Required";
            this.setState({
                error,
                [gender]: gender
            });
        }

        var allFields = employeeName === '' || managerId === '' || hrld === '' || gender === '';
        if (validation(this.state) && !allFields) {
            let empObj = {
                "employeeName": employeeName,
                "managerId": managerId,
                "hrld": hrld,
                "gender": gender,
                "annualLeave": this.state.annualLeave,
                "paternityLeave": this.state.paternityLeave,
                "maternityLeave": this.state.maternityLeave
            }
            employeeService.saveEmployee(empObj).then((res) => {
                console.log(res);
                toast.success("Employee Added Successfully", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
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
            case "employeeName":
                error.employeeName = value.length === 0 ? "employeeName Required" : "";
                break;
            case "managerId":
                error.managerId = value === "" ? "managerId Required" : "";
                break;
            case "hrld":
                error.hrld = value === "" ? "hrld Required" : "";
                break;
            case "gender":
                error.gender = value.length === 0 ? "gender Required" : "";
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
                    <NavLink to="/register" className={({ isActive }) => (isActive ? "link-active" : "link")} > <img src={process.env.PUBLIC_URL + "/assets/chevron-left-solid.svg"} className="left-arrow" alt="logo" /> Back</NavLink>
                </span>
                <div className="add-form-container">
                    <form className="add-form" onSubmit={this.onFormSubmit} noValidate>
                        <h1 className='add-form-head'>ADD EMPLOYEE DETAILS</h1>

                        <div className="form-group ">
                            <label className="mb-2">EMPLOYEE NAME</label>
                            <input required type="text" name="employeeName" className={error.employeeName.length > 0 ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.employeeName.length > 0 && (
                                <span className="invalid-feedback">{error.employeeName}</span>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-2">ManagerId</label>
                            <input required type="number" name="managerId" id="managerId" className={error.managerId !== "" ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.managerId !== "" && (
                                <span className="invalid-feedback">{error.managerId}</span>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-2">HrId</label>
                            <input required type="number" name="hrld" id="hrld" className={error.hrld !== "" ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.hrld !== "" && (
                                <span className="invalid-feedback">{error.hrld}</span>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-2">GENDER</label>
                            <select required name="gender" id="gender" onChange={this.formObject} className={error.gender.length > 0 ? "is-invalid form-control" : "form-control"}>
                                <option value="">Choose Gender...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {error.gender.length > 0 && (
                                <span className="invalid-feedback">{error.gender}</span>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-2">ANNUAL LEAVE</label>
                            <input disabled required type="number" name="annualLeave" value={this.state.annualLeave} className={error.annualLeave.length > 0 ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.annualLeave.length > 0 && (
                                <span className="invalid-feedback">{error.annualLeave}</span>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-2">PATERNITY LEAVE</label>
                            <input disabled required type="number" name="paternityLeave" value={this.state.paternityLeave} className={error.paternityLeave.length > 0 ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.paternityLeave.length > 0 && (
                                <span className="invalid-feedback">{error.paternityLeave}</span>
                            )}
                        </div>

                        <div className="form-group mb-3">
                            <label className="mb-2">MATERNITY LEAVE</label>
                            <input disabled required type="number" name="maternityLeave" value={this.state.maternityLeave} className={error.maternityLeave.length > 0 ? "is-invalid form-control" : "form-control"} onChange={this.formObject} />
                            {error.maternityLeave.length > 0 && (
                                <span className="invalid-feedback">{error.maternityLeave}</span>
                            )}
                        </div>

                        <div className="d-grid mt-3">
                            <button type="submit" className="btn btn-block btn-primary" style={{ width: "100%" }} >Add Employee</button>
                        </div>
                    </form>
                    <ToastContainer />
                </div>
            </>
        );
    }
}