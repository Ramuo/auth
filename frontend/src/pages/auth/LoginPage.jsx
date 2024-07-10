import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from "react-toastify"
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../css/login.css";


import {useLoginMutation} from "../../slices/userApiSlice";
import { setCredentials } from '../../slices/authSlice';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const [login, {isLoading}] = useLoginMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);


  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({email, password}).unwrap();
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    
  };

  return (
    <div className="container">
      <div className="formContainer">
        <h2>Login Up</h2>
        <div className="social">
          <div className="">
            Facebook
          </div>
          <div className="">
            Google
          </div>
        </div>
        <form onSubmit={submitHandler}>
          <div className="inputContainer">
            <input 
            type="email"
            placeholder='Email' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <div className='passwordContainer'>
              <input 
              type={show ? ('text') : ("password")}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              />
              <button onClick={() => setShow(!show)}>{show ? (<FaEyeSlash className='text-2xl'/>) : (<FaEye className='text-2xl'/>)}</button>
              {/* <button onClick={() => setShow(!show)}>{show ? ("HIDE") : ("SHOW")}</button> */}
            </div>
            <button type='submit'>Login</button>
          </div>
        </form>

        <div className="footer"> 
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Don't have an account ? Register</Link>
          <Link to='/forget-password'>Forgot Password</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage