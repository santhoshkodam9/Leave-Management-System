import axios from "axios";

const GET_URL_REQUESTS = 'http://localhost:8080/lms/hr/leave-requests';
const POST_URL_APPLY = 'http://localhost:8080/lms/hr/change-status';
class HrService {

  getLeaveRequests() {
    return axios.get(GET_URL_REQUESTS);
  }
  approveLeave(aprData,status) {
    return axios.post(POST_URL_APPLY + "?eid=" + aprData.employeeId + "&lid=" + aprData.leaveId + "&status=" + status);
  }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new HrService();