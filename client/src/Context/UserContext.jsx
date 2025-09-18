import React, { useEffect, useState, createContext, useContext } from 'react';
import { authDataContext } from './UseAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const { serverUrl } = useContext(authDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [student, setStudent] = useState(null)

  const navigate = useNavigate();

  // const fetchStudentData = async () => {
  //   try {
  //     const res = await axios.get(`/api/students/${user?.user_id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       withCredentials: true
  //     });


  //     console.log(res.data);
  //     if (res.data?.success && res.data.student) {
  //       setStudent(res.data.student || res.data);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch student data:', error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }


  const fetchUser = async () => {
    try {
      console.log(token)
      const { data } = await axios.get('/api/auth/get/data', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUser(data.user);
        console.log(data.role)
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log(data.message)
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      console.log("User not found1")
    } finally {
      setIsCheckingAuth(false);
      console.log("User not found2")
    }
  };

  const userSignOut = async () => {
    localStorage.removeItem("token");

    setToken(null);

    setIsAuthenticated(false);
    navigate("/");
  }



  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setIsAuthenticated(false);
      console.log("User not found3")
      setIsCheckingAuth(false);
    }
  }, [token]);

  const value = {
    user, setUser, navigate, isLoading, setIsLoading,
    axios, token, setToken, fetchUser,
    isAuthenticated, setIsAuthenticated,
    isCheckingAuth, userSignOut, student, setStudent
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
