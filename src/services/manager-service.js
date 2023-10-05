import axios from "axios";

const GET_URL_REQUESTS = 'http://localhost:8080/lms/manager/check-leave-requests';
const POST_URL_APPLY = 'http://localhost:8080/lms/manager/change-leave-status';
class ManagerService {

  getLeaveRequests() {
    return axios.get(GET_URL_REQUESTS);
  }
  approveLeave(aprData,status) {
    return axios.post(POST_URL_APPLY + "?eid=" + aprData.employeeId + "&lid=" + aprData.leaveId + "&status=" + status);
  }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ManagerService();