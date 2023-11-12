import React, { useEffect, useState } from 'react'
import axios from "axios"
import { authActions } from "../store/AuthReducer";
import { useDispatch } from 'react-redux'
function LeaderBoard() {
    const token=localStorage.getItem('token')
    const [leaderBoard,setLeaderBoard]=useState([])
const dispatch=useDispatch()

    const fetchData=async()=>{
        try{
            const response=await axios.get('http://localhost:3000/showleaderboard')
            console.log(response.data.leaderBoard)

            setLeaderBoard(response.data.leaderBoard || [])
        }catch(err){
            console.log(err)
            setLeaderBoard([]) //set an empty array on error
        }
    }
    useEffect(()=>{
        if (token) {
            dispatch(authActions.isLogin(token));
          }
          
         
        fetchData()
    },[])
  return (
    <div>
      <h1>LeaderBoard</h1>
     {/* <ul>
        {leaderBoard && leaderBoard.map((item,index)=>(
           <li key={index}>
           <span className='font-semibold'>{item.name}</span>-{item.totalExpenses}
       </li> 
        ))}
        
     </ul> */}
    </div>
  )
}

export default LeaderBoard
