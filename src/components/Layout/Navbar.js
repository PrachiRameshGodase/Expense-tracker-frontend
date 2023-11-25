import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import classes from "../Layout/Navbar.module.css";
import { authActions } from "../../store/AuthReducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Tooltip } from "@mui/material";


function Header() {
  const [isBouncing, setIsBouncing] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const isPremium = useSelector((state) => state.auth.isPremium);
  // console.log("navabr", isPremium);
  const isPremiumReload = localStorage.getItem("isPremium");
  const token = localStorage.getItem("token");
  const enteredEmail = localStorage.getItem("email");

  const toggleAvtar = () => {
    setIsHovered((prevValue) => !prevValue);
  };
  useEffect(() => {
    dispatch(authActions.ispremium(isPremiumReload === "true"));
  }, []);

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
      console.log(response.data);
      const { keyId, orderId } = response.data;
      console.log(orderId);
      console.log(keyId);
      const options = {
        key: keyId,
        amount: 500, // Example amount
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
            if (
              updateResponse.data.message === "Transaction updated successfully"
            ) {
              // Payment successful and transaction updated
              //dispatch action isPremium
              dispatch(authActions.ispremium(true));
              localStorage.setItem("isPremium", true);
            }
          } else {
            // Payment failed
            // Handle the failure case
            alert("Payment failed");
          }
        },
        prefill: {
          name: "Test",
          email: "test@example.com",
          contact: "",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "blue",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      // Handle error
    }
  };

  const leaderBoardHandler = () => {
    navigate("/leaderboard");
    setIsBouncing(false);
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

        <div className="flex">
          {!isAuth && (
            <Link to="/">
              <button className="bg-gradient-to-b from-red-600 via-red-500 to-red-800  hover:bg-purple-600 py-2 px-4 font-bold text-white rounded">
                LOGIN
              </button>
            </Link>
          )}
          {isAuth && (
            <Tooltip
              title={enteredEmail}
              placement="bottom"
              open={isHovered}
              onClose={() => setIsHovered(false)}
              onOpen={() => setIsHovered(true)}
            >
              <Avatar
                className="bg-gradient-to-b from-yellow-200 to-pink-600 mr-3"
                style={{ marginRight: "10px", cursor: "pointer" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={toggleAvtar}
              >
                {!isHovered ? (
                  <span className={classes.avatarText}>
                    {enteredEmail && (
                      <Avatar className="bg-gradient-to-b from-yellow-200 to-pink-700 " />
                    )}
                  </span>
                ) : (
                  <span>
                    {enteredEmail && enteredEmail.charAt(0).toUpperCase()}
                  </span>
                )}
              </Avatar>
            </Tooltip>
          )}
          {isAuth && !isPremium && (
            <button
              className={`bg-gradient-to-r from-red-600 via-green-500 to-red-600 py-2 px-4 font-bold text-white rounded hover:bg-red-800  ${
                isBouncing ? classes.bouncing : ""
              }`}
              onClick={toggleHandler}
            >
              Premium
            </button>
          )}
          {isAuth && isPremium && (
            <button
              className={`bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 py-2 px-4 font-bold text-white rounded hover:bg-red-800  ${
                isBouncing ? classes.bouncing : ""
              }`}
              onClick={leaderBoardHandler}
            >
              LeaderBoard
            </button>
          )}

          {isAuth && (
            <button
              className="bg-gradient-to-b from-red-600 via-red-500 to-red-800  hover:bg-purple-600 py-2 px-4 font-bold text-white rounded mx-5 "
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
// import React, { Fragment, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import { authActions } from "../store/AuthReducer";
// import axios from "axios";

// export default function Navbar() {
//   const dispatch = useDispatch();
//   const isPremium = useSelector((state) => state.auth.isPremium);
//   const isPremiumReload=localStorage.getItem("isPremium")
//   const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
//   const token = localStorage.getItem("token");
//   const email=localStorage.getItem('email')

//   //   dispatch(authActions.isToggle());
//   useEffect(() => {
//     dispatch(authActions.ispremium(isPremiumReload === "true"));
//   }, []);

//   const navigate = useNavigate();
//   // const authCtx = useContext(AuthContext);
//   const logoutHandler = () => {
//     dispatch(authActions.islogout());

//     // authCtx.logout();
//     navigate("/");
//   };

//   const toggleHandler = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/razorpay/transaction",
//         {},
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );

//       const { keyId, orderId } = response.data;

//       const options = {
//         key: keyId,
//         amount: 1000,
//         currency: "INR",
//         name: "Sharpener",
//         description: "Purchase Premium",
//         order_id: orderId,
//         handler: async function (response) {
//           // Handler function for success or failure

//           if (response.razorpay_payment_id) {
//             // Payment successful

//             // Make a request to update the transaction
//             const updateResponse = await axios.put(
//               `http://localhost:3000/razorpay/transaction/${orderId}`,
//               {
//                 paymentId: response.razorpay_payment_id,
//               },
//               {
//                 headers: {
//                   Authorization: token,
//                 },
//               }
//             );
//             if (
//               updateResponse.data.message === "Transaction updated successfully"
//             ) {
//               // Payment successful and transaction updated

//               // Dispatch an action to set the isPremium state to true
//               dispatch(authActions.ispremium(true));
//               localStorage.setItem('isPremium',true)
//             }
//           } else {
//             alert("Payment Failed");
//             // Payment failed

//           }
//         },
//         prefill: {
//           name: "Test",
//           email: "test@gmail.com",
//           contact: "+919876543210",
//         },
//         notes: {
//           address: "Razorpay Corporate Office",
//         },
//         theme: {
//           color: "#F37254",
//         },
//       };

//       const razorpayInstance = new window.Razorpay(options);
//       razorpayInstance.open();
//     } catch (error) {
//       // Handle error
//       alert(error);
//     }
//   };

//   return (
//     <Fragment>
//       <nav className="flex items-center justify-between  bg-gradient-to-b from-blue-300 to-purple-900 p-4 border border-gray-300">
//         <Link to="/expensetracker" className="text-white text-xl font-semibold">
//           Expense Tracker
//         </Link>
//         <div>
//           {!isLoggedIn && (
//             <Link
//               to="/"
//               className="text-white font-medium mr-4 hover:underline"
//             >
//               <button className="text-white font-medium hover:underline px-4 py-2 rounded-md bg-gray-800">
//                 Login
//               </button>
//             </Link>
//           )}
//           {email && <span className="text-white font-medium mr-4 bg-green-600 hover:bg-green-800 py-2 px-2">{email}</span>}
//           {!isPremium && isLoggedIn && (
//             <button
//               onClick={toggleHandler}
//               className="text-white font-medium bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-r hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 px-4 py-2 rounded-md mr-4"
//             >
//               <span className="inline-block text-gray-900">Avail Premium</span>
//             </button>
//           )}

//           {isLoggedIn && (
//             <button
//               onClick={logoutHandler}
//               className="text-white font-medium  px-4 py-2 rounded-md bg-red-600 hover:bg-red-800"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </nav>
//     </Fragment>
//   );
// }
