import React, { useEffect, useState } from "react";
import axios from "axios";
import { authActions } from "../../store/AuthReducer";
import { useDispatch } from "react-redux";
function LeaderBoard() {
  const token = localStorage.getItem("token");
  const [leaderBoard, setLeaderBoard] = useState([]);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/premium/showleaderboard"
      );
      console.log(response.data.leaderboard);

      setLeaderBoard(response.data.leaderboard || []);
    } catch (err) {
      console.log(err);
      setLeaderBoard([]); //set an empty array on error
    }
  };
  useEffect(() => {
    if (token) {
      dispatch(authActions.isLogin(token));
    }

    fetchData();
  }, []);
  return (
    <div className=" text-white ">
      <h1 className="text-white px-4 py-4 font-semibold bg-slate-800">
        LeaderBoard
      </h1>
      <ul className="font-semibold text-lg">
        {leaderBoard &&
          leaderBoard.map((item, index) => (
            <li key={index}>
              <span className="mr-4">{index + 1}.</span>
              <span className=" mr-4">{item.name}</span>Total Expense :
              {item.totalexpense}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default LeaderBoard;
