import axios from "axios";

const LOGIN_URL = 'http://localhost:8080/lms/login';
const REGISTER_URL = 'http://localhost:8080/lms/register';

class LoginRegisterService {

  login(loginData) {
    return axios.post(LOGIN_URL,loginData);
  }
  register(registerData) {
    return axios.post(REGISTER_URL,registerData);
  }

}

// eslint-disable-next-line import/no-anonymous-default-export
export default new LoginRegisterService();