import React from 'react';
import {useNavigate} from "react-router-dom"
import { useDispatch } from 'react-redux';


import { logout } from '../../slices/authSlice';
import {useLogoutMutation} from "../../slices/userApiSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login")
    } catch (err) {
      console.log(err);
    }
  }


  return (
      <div>
        <h1 className="text-3xl text-red-400" onClick={logoutHandler}>HomePage</h1>
      </div>
  );
}

export default HomePage