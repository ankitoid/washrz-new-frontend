import axios from "../config";

const getProfile = async (setAuth, setisLoader, navigate) =>
{
  try{
    const response = await axios.get(
      "/auth/profile",
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
      }
    );  
    const profile = response.data.profile;
    const {name, email, role, avatar} = profile;
     setisLoader(false)
    setAuth({name, email, role, avatar});
    return {name, email, role, avatar};
  }catch(err){
    let message = err?.response?.data?.message;
    if(message = 'You are not logged in! Please log in to get access.')
    { 
      setisLoader(false)
      navigate('/login')
    }

    console.log("here is the errr-->> ", message)
  } 
}

const Signup = async (user, setisLoader) => 
{
  try{
    setisLoader(true)
    const response = await axios.post(
      "/auth/register",
      user,
       {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
      }
    );  
    setisLoader(false)
    const data = response.data;
    console.log("here is the resister data--->> ", data)
  }catch(err){
    let message = err?.response?.data?.message;
    if(message = 'You are not logged in! Please log in to get access.')
    { 
      setisLoader(false)
      // navigate('/login')
    }

    console.log("here is the errr-->> ", message)
  } 
}

export {getProfile, Signup}