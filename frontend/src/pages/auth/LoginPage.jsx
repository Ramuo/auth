import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin} from "@react-oauth/google";
import {LoginSocialFacebook} from "reactjs-social-login";
import {toast} from "react-toastify";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../css/login.css";
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";


import {useLoginMutation, useGoogleMutation, useFacebookMutation} from "../../slices/userApiSlice";
import { setCredentials } from '../../slices/authSlice';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const [login, {isLoading}] = useLoginMutation();
  const [google, {isLoading: googleLoading}] = useGoogleMutation();
  const [facebook, {isLoading: facebookLoading}] = useFacebookMutation();

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

  const handleContinueWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      //To get the user details from google
      const resultFromGoogle = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }
      );


      //To Register/Login the user 
      try {
        const res = await google({name: resultFromGoogle.data.name, email: resultFromGoogle.data.email}).unwrap();
        dispatch(setCredentials({...res}));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    },
    onError: (err) => {
      console.log(err);
    }
  });

  //Login/Register with facebook
  const handleContinueWithFacebook = async (resultFromFacebook) => {

    try {
      const res = await facebook({name: resultFromFacebook.data.name, email: resultFromFacebook.data.email}).unwrap();
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      console.log(err);
    }
  }

  return (
    <div className="container">
      <div className="formContainer">
        <h2>Login Up</h2>
        <div className="social">
          <div>
            <LoginSocialFacebook
              appId={import.meta.env.VITE_FACEBOOK_CLIENT_ID}
              onResolve={(res) => {
                // setisloading(true);
                handleContinueWithFacebook(res);
              }}
              onReject={(err) => {
                console.log(err);
              }}
            >
              <FacebookLoginButton>Continue with Facebook</FacebookLoginButton>
            </LoginSocialFacebook>
          </div>
          <div onClick={handleContinueWithGoogle}>
            <GoogleLoginButton>Google</GoogleLoginButton>
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