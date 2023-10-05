import { useEffect, useRef, useState } from "react";
import employeeService from "../../services/employee-service";
import hrService from "../../services/hr-service";
import { Cards } from "../cards/Cards";
import '../cards/Cards.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function HrDashboard() {

  const childRef = useRef(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveRequestsLen, setLeaveRequestsLen] = useState(true);
  const [modalType, setModalType] = useState(true);

  const [modalData, setModalData] = useState({
    leaveId: "",
    status: "",
    employeeId: '',
    leaveType: "",
    noOfDays: "",
    comments: "",
    medicalreport: ""
  });
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
  const getData = async (empId) => {
    const { data } = await employeeService.getEmployeeById(empId);
    console.log(data);
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
  };
  useEffect(() => {
    let empId = sessionStorage.getItem("userId");
    getData(empId);
    hrService.getLeaveRequests().then((data1) => {
      let res = data1.data?.filter(item => item.status === "SENT_TO_HR");
      setLeaveRequestsLen(res.length > 0);
      setLeaveRequests(data1.data);
    });
    toast.info("Page is Updated", {
      position: toast.POSITION.TOP_CENTER
    });
    console.log(employeeDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  }, [leaveRequestsLen]);

  const onFormSubmitHR = (item, str) => {
    setModalData(state => ({
      ...state,
      leaveId: item.leaveId,
      status: item.status,
      employeeId: item.employeeId,
      leaveType: item.leaveType,
      noOfDays: item.noOfDays,
      comments: item.comments,
      medicalreport: item.medicalreport
    }));
    if (str === "approve") {
      if (modalType !== true)
        setModalType(previousValue => !previousValue);
    } else {
      if (modalType !== false)
        setModalType(previousValue => !previousValue);
    }
  }

  const applyLeave = (item, status) => {
    hrService.approveLeave(item, status).then((data) => {
      if (data.status === 200) {
        if (status === "APPROVE") {
          toast.success("Approved Succesfully:", {
            position: toast.POSITION.BOTTOM_CENTER
          });
        } else {
          toast.success("Rejected Successfully", {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      } else {
        toast.error("Something Went wrong", {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
      console.log(data);
    });
  }

  const handleDownloadHr = () => {
    childRef.current.handleDownload();
  }
  function validateMedical(valid) {
    if (valid) {
      toast.success("Medical Report Validated Succesfully", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    } else {
      toast.error("Medical Report Updated as Invalid:", {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  }

  return (
    <>
      <div className="home-page-container" >
        <h3 style={{ textAlign: "center", padding: 20 }}>Welcome to HR Dashboard</h3>
        <p style={{ textAlign: "center", fontSize: 30 }}><i className="fa fa-refresh" aria-hidden="true" onClick={() => { window.location.reload() }}></i></p>
        <div className="card-deck">
          {leaveRequestsLen && leaveRequests?.filter(item => item.status === "SENT_TO_HR").map((item , index) => {
            return <Cards res={item} key={index} onFormSubmitHR={onFormSubmitHR} ref={childRef} />
          })
          }
          {
            !leaveRequestsLen && (
              <>
                <img src={process.env.PUBLIC_URL + "/assets/norecordsimage.png"} alt="no records" style={{ padding: 40 }} />
              </>
            )
          }
        </div>
        
        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              {modalType && (<>
                <div className="modal-header">
                  <h4 className="modal-title" >HR Approval Form</h4>
                  <button type="button" className="close" data-dismiss="modal">&times;</button>

                </div>
                <div className="modal-body">
                  <form className="leave-form" noValidate>
                    <div className="profile">
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </div>
                    <table>
                      <tbody>
                        <tr><td>Leave Id </td><td>{modalData.leaveId}</td></tr>
                        <tr><td>Status</td><td>{modalData.status}</td></tr>
                        <tr><td>Employee Id </td><td>{modalData.employeeId}</td></tr>
                        <tr><td>Leave Type </td><td>{modalData.leaveType}</td></tr>
                        <tr><td>Days </td><td>{modalData.noOfDays}</td></tr>
                        <tr><td>Comments</td><td>{modalData.comments}</td></tr>
                        <tr><td>Medicalreport NUmber</td><td>{modalData.medicalreport}</td></tr>
                      </tbody>
                    </table>
                    <div>
                    </div>
                    <div className="d-grid mt-3">
                      <button type="button" className="btn btn-block btn-primary" onClick={() => applyLeave(modalData, "APPROVE")} >Approve</button>
                      <button type="button" className="btn btn-block btn-primary" onClick={() => applyLeave(modalData, "REJECTED")} >Reject</button>
                    </div> <br />
                  </form>
                </div>
              </>
              )}
              {!modalType && (
                <>
                  <div className="modal-header">
                    <h4 className="modal-title" >Check Medical Report</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>

                  </div>
                  <div className="modal-body">
                    <form className="leave-form" noValidate>
                      <table>
                        <tbody>
                          <tr><td>Leave Id </td><td>{modalData.leaveId}</td></tr>
                          <tr><td>Employee Id </td><td>{modalData.employeeId}</td></tr>
                        </tbody>
                      </table>
                      <div>
                      </div>
                      <div className="d-grid mt-3">
                        <label className="download-label"> Medicale Report: </label>(Click here to Download)
                        <button type="button" className="btn btn-block btn-primary" onClick={handleDownloadHr}>Download Medical Report PDF</button> <br />
                        <label> Validate:</label>
                        <div className="validate-btn-container">
                          <button type="button" className="btn btn-success valid" onClick={() => validateMedical(true)} >Valid</button>
                          <button type="button" className="btn btn-danger invalid" onClick={() => validateMedical(false)} >Invalid</button>
                        </div>
                      </div> <br />
                    </form>
                  </div>
                </>
              )
              }
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  )
}

export default HrDashboard;
