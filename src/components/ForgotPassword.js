import { useRef } from 'react'
import { Link } from "react-router-dom";
import axios from "axios"
function ForgotPassword() {
    const emailRef = useRef();
    const forgotPasswordHandler = async (e) => {
      e.preventDefault();
      try {
          const email = emailRef.current.value;
          const response = await axios.post("http://localhost:3000/forgotpassword", { email });
          // Handle successful response
          console.log(response.data);
      } catch (error) {
          // Handle error
          console.error("Error during forgot password:", error.message);
      }
  };
  
  return (
    <section className="bg-gradient-to-b from-purple-900 via-pink-400 to-purple-900 wd-full  max-w-xl rounded-6 shadow-md py-3 text-center text-white mx-auto my-5 rounded-4">
    <h2 className=" flex text-2xl  mb-4 justify-center text-black font-semibold">Forgot Password</h2>
    <div>
      <label htmlFor="email" className="block text-white font-semibold mb-1 mx-0">
      Enter the E-mail
      </label>
      <input
      type="email"
      id="email"
      ref={emailRef}
      className=" w-full max-w-md py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400 text-black"
      />
    </div>
    <button onClick={forgotPasswordHandler} className="bg-gradient-to-r flex mx-auto from-blue-800  to-blue-500  hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-purple-400 mt-3">Send Link</button>
    <p className='flex text-1xl font-bold text-white mb-2 mt-2 justify-center'>
         Already a user?
      <Link to="/">
          <b className='flex text-1xl font-bold text-white mb-2 mx-0.5  justify-center'>LOGIN</b>
      </Link>
    </p>
  </section>
  )
}

export default ForgotPassword
