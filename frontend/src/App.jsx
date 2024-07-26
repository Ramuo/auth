import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import ResendEmailVerifPage from "./pages/auth/ResendEmailVerifPage";
import ForgotPasswordPage from "./pages/auth/FogotpasswordPage";
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/verify/:id" element={<EmailVerificationPage/>}/>
        <Route path="/resend/verification/:id" element={<ResendEmailVerifPage/>}/>
        <Route path="/forget-password" element={<ForgotPasswordPage/>}/>
        <Route path='/reset-password/:token' element={<ResetPasswordPage/>}/>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  );
}

export default App;
