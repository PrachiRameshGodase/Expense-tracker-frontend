import React, { useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import classes from "../components/Navbar.module.css"
// import { premiumActions } from "../../store/authPremium";
// import { authActions } from "../../store/auth";

import { authActions } from "../store/AuthReducer"
import { useNavigate } from "react-router-dom";
import axios from "axios"

function Header() {
  const [isBouncing, setIsBouncing] = useState(true);
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isPremium = useSelector((state) => state.auth.isPremium);
  const token=localStorage.getItem('token')

  // const handleButtonClick = () => {
  //   setIsBouncing(false);
  //   dispatch(authActions.darkToggle());
  // };

  const navigate = useNavigate();

  const logOutHandler = () => {
    dispatch(authActions.islogout());
    navigate("/");
  };

  const toggleHandler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/razorpay/transaction",
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const { keyId, orderId } = response.data;

      const options = {
        key: keyId,
        amount: 1000, // Example amount
        currency: "INR", // Example currency
        name: "Sharpener",
        description: "Purchase Premium",
        order_id: orderId,
        handler: async function (response) {
          // Handler function for success or failure

          if (response.razorpay_payment_id) {
            // Payment successful

            // Make a request to update the transaction
            const updateResponse = await axios.put(
              `http://localhost:3000/razorpay/transaction/${orderId}`,
              {
                paymentId: response.razorpay_payment_id,
              },
              {
                headers: {
                  Authorization: token,
                },
              }
            );

            // Handle the response and perform necessary actions

            // Redirect or display a success message to the user
          } else {
            // Payment failed
            // Handle the failure case
            alert("Payment failed")
          }
        },
        prefill: {
          name: "Test",
          email: "test@example.com",
          contact: "+919876543210",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error) {
      // Handle error
    }
  };


  
  return (
    <nav className="p-3  bg-gradient-to-b from-blue-900 to-purple-400 items-center">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 className={`mr-8 text-gray-100 font-bold ${classes.logo}`}>
          Expense tracker
        </h1>

        <div>
          {!isAuth && (
            <Link to="/">
              <button className='bg-gradient-to-b from-red-600 via-red-500 to-red-800  hover:bg-purple-600 py-2 px-4 font-bold text-white rounded'>LOGIN</button>
            </Link>
          )}
          {isPremium && (
            <button
              className={`bg-gradient-to-r from-red-600 via-green-500 to-red-600 py-2 px-4 font-bold text-white rounded hover:bg-red-800  ${
                isBouncing ? classes.bouncing : ''
              }`}
              onClick={toggleHandler}
            >
              Premium
            </button>
          )}

          {isAuth && (
            <button
              className='bg-gradient-to-b from-red-600 via-red-500 to-red-800  hover:bg-purple-600 py-2 px-4 font-bold text-white rounded mx-5 '
              onClick={logOutHandler}
            >
              LOGOUT
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
