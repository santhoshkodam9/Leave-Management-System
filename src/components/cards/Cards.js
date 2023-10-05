import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { ToastContainer } from "react-toastify"
import { saveAs } from 'file-saver';

export const Cards = forwardRef((props, ref) => {
  const [base64PDF, setBase64PDF] = useState(null);
  useImperativeHandle(ref, () => {
    return {
      handleDownload: () => {
        console.log("-------download--------")
        let base64 = base64PDF.replace("data:application/pdf;base64,", "");
        var byteCharacters = atob(base64);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var file = new Blob([byteArray], { type: 'application/pdf' });
        saveAs(file, 'file.pdf');
      }
    }
  });
  
  useEffect(() => {
    setBase64PDF("data:application/pdf;base64," + props.res.files);
    console.log("--------base64-------------");
    // console.log(base64PDF);
  }, [base64PDF, props.res.files]);

  return (
    <div className="card" key={props.res.id}>
      <div className="card-top">
        <div className="card-image-container">
          <i className='fas fa-user-circle' style={{ fontSize: 50 }} />
        </div>
        <div className="card-top-contents">
          <h5 className="cards-title">EmployeeId: {props.res.employeeId}</h5>
          <p className="card-text">{props.res.leaveType} - {props.res.noOfDays} Days</p>
        </div>
      </div>
      <div className="card-body">
        <a className="card-link" href="/"> LeaveId: {props.res.leaveId}</a>
        <p className="card-description">{props.res.status}</p>
        <button type="submit" className="reg btn btn-block btn-primary" data-toggle="modal" data-target="#myModal" onClick={() => props.onFormSubmitHR(props.res, "approve")}> Approve </button>
        {  props.res.status !== "SENT_TO_MANAGER" && ( 
          <button type="submit" className="reg btn btn-block btn-primary" data-toggle="modal" data-target="#myModal" onClick={() => props.onFormSubmitHR(props.res, "validateReport")}>Validate Medical Report</button>
        )}
       </div>
      <ToastContainer />
    </div>
  )
});