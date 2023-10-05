import { useEffect, useState } from "react";
import employeeService from "../../services/employee-service";
import "./EmployeeDashboard.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function EmployeeDashboard() {
  const [appliedStatus, setAppliedStatus] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [showLeaveMessage, setShowLeaveMessage] = useState("");
  const [empStatus, setEmpStatus] = useState([]);

  const [employeeDetails, setEmployeeDetails] = useState({
    employeeId: '',
    employeeName: "",
    managerId: 0,
    hrld: 0,
    gender: "",
    annualLeave: '',
    paternityLeave: '',
    maternityLeave: ''
  });
  const [leaveApplyDetails, setLeaveApplyDetails] = useState({
    empId: '',
    days: "",
    type: "",
    file: ""
  });

  const getData = async (empId) => {
    const { data } = await employeeService.getEmployeeById(empId);
    setEmployeeDetails({
      employeeId: data.employeeId,
      employeeName: data.employeeName,
      managerId: data.managerId,
      hrld: data.hrld,
      gender: data.gender,
      annualLeave: data.annualLeave,
      paternityLeave: data.paternityLeave,
      maternityLeave: data.maternityLeave
    });
    employeeService.getEmployeeStatus(empId).then((data1) => {
      setEmpStatus(data1.data);
    });
  };

  useEffect(() => {
    let empId = sessionStorage.getItem("userId");
    getData(empId);
    console.log(employeeDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  }, [appliedStatus]);

  async function showLeaveDetail(empId) {
    const { data } = await employeeService.getLeavesById(empId);
    setShowLeaveMessage(data);
    setShowLeave(true);
  }

  async function onFormSubmit(event) {
    setLeaveApplyDetails((prev) => ({
      ...prev,
      empId: employeeDetails.employeeId,
    }));

    const formData = new FormData();
    formData.append('empId', leaveApplyDetails.empId);
    formData.append('days', leaveApplyDetails.days);
    formData.append('type', leaveApplyDetails.type);
    formData.append('file', leaveApplyDetails.file, leaveApplyDetails.file.name);

    console.log(leaveApplyDetails)
    console.log(formData)
    const { data } = await employeeService.applyLeave(formData);
    console.log("leave applied");
    console.log(data);
    setAppliedStatus(true);
    toast.success("Applied Successfully! LeaveId:" + data.leaveId + "", {
      position: toast.POSITION.BOTTOM_CENTER
    });
  }

  function changeHandler(event) {
    if (event.target.name === 'file') {
      setLeaveApplyDetails((prev) => ({
        ...prev,
        [event.target.name]: event.target.files[0],
      }));
    } else {
      setLeaveApplyDetails((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    }
  }

  return (
    <div className="home-page-container">
      <div className="profile">
        <i className="fa fa-user" aria-hidden="true"></i>
      </div>
      <table>
        <tbody>
          <tr><td>Employee Name </td><td>{employeeDetails.employeeName}</td></tr>
          <tr><td>Employee Id </td><td>{employeeDetails.employeeId}</td></tr>
          <tr><td>Gender </td><td>{employeeDetails.gender}</td></tr>
          <tr><td>Manager Id </td><td>{employeeDetails.managerId}</td></tr>
          <tr><td>Hr Id </td><td>{employeeDetails.hrld}</td></tr>
        </tbody>
      </table>
      <div className="employee-buttons">
        <button type="submit" className="applyLeave btn btn-block btn-primary" data-toggle="modal" data-target="#myModal">Apply Leave</button>
        <button type="submit" className="showLeave btn btn-block btn-primary" onClick={() => showLeaveDetail(employeeDetails.employeeId)}>Show Leave Balance</button>
      </div>

      { showLeave &&
        <>
          <div className="alert alert-success alert-dismissible fade show show-leave" role="alert">
            <strong>{showLeaveMessage}</strong>
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setShowLeave(false)}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </>
      }

      <div className="emp-applications">
        <h3 style={{textAlign:"center"}}>Leave Application Records</h3> <br/>
        <table>
          <tbody>
            <tr><th>Leave Id</th> <th>LeaveType</th><th>No of Days</th><th>Status</th></tr>
            {
              empStatus.map((item , index) => {
              return <tr key={index}><td>{item.leaveId}</td><td>{item.leaveType}</td><td>{item.noOfDays}</td><td>{item.status}</td></tr>
              })
            }
            </tbody>
        </table>
      </div>

      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Leave Form</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>

            </div>
            <div className="modal-body">
              <form className="leave-form" noValidate>
                <div className="form-group ">
                  <label className="mb-2"><strong>Employee Id</strong></label>
                  <input disabled required type="text" name="empId" id="empId" value={employeeDetails.employeeId} className="form-control" onChange={changeHandler} />
                </div>
                <div className="form-group mb-3">
                  <select required name="type" id="type" onChange={changeHandler} className="form-control">
                    <option value="">Select Leave Type..</option>
                    <option value="AUNNAL_LEAVE">Annual Leave</option>
                    <option value="PATERNITY_LEAVE">Paternity Leave</option>
                    <option value="MATERNITY_LEAVE">Maternity Leave</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label className="mb-2"><strong>Days</strong></label>
                  <input required type="number" name="days" id="days" className="form-control" onChange={changeHandler} />
                </div>

                <div className="form-group mb-3">
                  <input type="file" name="file" onChange={changeHandler}/>
                  <button className="btn btn-success" onClick={(e) => { e.preventDefault() }}>Upload</button>
                </div>

                <div className="d-grid mt-3">
                  <button type="button" className="btn btn-block btn-primary" onClick={() => onFormSubmit()}>Apply</button>
                </div> <br />
                {appliedStatus &&
                  <div className="alert alert-info">
                    <strong>Response Submittted Succefully! </strong> <br />
                  </div>
                }
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
export default EmployeeDashboard;
