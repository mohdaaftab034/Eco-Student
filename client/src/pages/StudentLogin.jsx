import React, { useContext, useState } from 'react'
import { userDataContext } from '../Context/UserContext';
import { authDataContext } from '../Context/UseAuthContext';
import toast from 'react-hot-toast';

const StudentLogin = () => {

  const { user, setUser, navigate,isAuthenticated, axios, setIsAuthenticated, isLoading, setIsLoading, token, setToken } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const url = state === 'login' ? '/api/auth/user/login' : '/api/auth/user/register';

    try {
      let result = await axios.post(
        serverUrl + url,
        { fullName: name, email, password },
        { withCredentials: true }
      );

      const { data } = result;
      console.log(data)
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        console.log(data.token);
        setIsAuthenticated(true)
        navigate('/');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false); //  Always run this
    }
  };




  return (
    <div className='flex justify-center w-screen h-screen items-center'>
      <form className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-2xl border border-green-300 bg-white">
        <p className="text-2xl font-medium m-auto">
          <span className="text-green-500">Student</span> {state === "login" ? "Login" : "Sign Up"}
        </p>
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-green-300 rounded-full w-full p-2 mt-1 outline-green-600" type="text" required />
          </div>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-green-300 rounded-full w-full p-2 mt-1 outline-green-600" type="email" required />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-green-300 rounded-full w-full p-2 mt-1 outline-green-600" type="password" required />
        </div>
        {state === "register" ? (
          <p>
            Already have account? <span onClick={() => setState("login")} className="text-green-500 cursor-pointer">click here</span>
          </p>
        ) : (
          <p>
            Create an account? <span onClick={() => setState("register")} className="text-green-500 cursor-pointer">click here</span>
          </p>
        )}
        <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 transition-all text-white w-full py-2 rounded-full cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  )
}

export default StudentLogin