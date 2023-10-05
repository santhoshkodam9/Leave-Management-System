import './App.css';
import { TopMenu } from './components/top-menu/TopMenu';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/login-page/Login';
import { Register } from './components/register/register';
import { Employee } from './components/employee/employee';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import HrDashboard from './components/hr/Hr';
import ManagerDashboard from './components/manager/Manager';

function App() {
  return (
    <>
      <TopMenu />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/employee" element={<Employee/>} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard/>} />
        <Route path="/hr/dashboard" element={<HrDashboard/>} />
        <Route path="/manager/dashboard" element={<ManagerDashboard/>} />
        <Route path="/" element={<Login />} /> 
      </Routes>
    </>
  );
}

export default App;

