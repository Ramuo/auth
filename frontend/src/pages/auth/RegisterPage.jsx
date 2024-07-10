import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from "react-toastify";
import Spinner from "../../components/Spinner"
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "../css/register.css";


import {useRegisterMutation} from "../../slices/userApiSlice";
import { setCredentials } from '../../slices/authSlice';


const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);

  const [register, {isLoading, isSuccess}] = useRegisterMutation();

 
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await register({ name, email, password }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    
  };
    
  

  return (
    <div className="container">
      <div className="formContainer">
      <h2>Sign Up</h2>
        {isSuccess && (
          <p className="text-center text-xl text-gray-600 bg-green-300 p-2 rounded-sm my-2 w-72">
            Pour finaliser votre inscriptition veiller consulter votre boite email et cliquer sur le lien de verification
          </p>
        )}
        <form onSubmit={submitHandler}>
          <div className="inputContainer">
            <input 
            type="text"
            placeholder='Name' 
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
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
            <button type='submit'>Sign up</button>
          </div>

          {isLoading && <Spinner/>}
        </form>
        <Link to="Login"/>
      </div>
    </div>
  )
}

export default RegisterPage