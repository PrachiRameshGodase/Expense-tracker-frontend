import React, { Fragment, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/AuthReducer';
import axios from "axios"
import { Button } from 'react-bootstrap';

function ExpenseTracker() {
    const formRef=useRef()
    const dispatch=useDispatch()
    const [expenses,seExpenses]=useState([])
    const [updateData, setUpdateData] = useState(null);


    const isToggle=useSelector((state)=>state.auth.darktoggle)
    const userId=localStorage.getItem('userId')
    const token=localStorage.getItem('token')


    async function submitHandler(e){
      try{
      e.preventDefault()

      const amount=formRef.current.elements.amount.value;
      const category=formRef.current.elements.category.value;
      const description=formRef.current.elements.description.value;
      console.log(description)

      const obj={
        amount,
        category,
        description
      }
      if (!updateData) {
        await axios.post("http://localhost:3000/expense", obj,{headers: {
          Authorization: localStorage.getItem("token"), 
      }}  )
      } else {
        await axios.put(
          `http://localhost:3000/expense/${updateData}`,
          obj
        );
        console.log(updateData)
        setUpdateData(null);
      }
      // const respone= await axios.post("http://localhost:3000/expense", obj );
      // console.log(respone.data)
    }catch(err){
      console.log(err)
    }
    }
    
    async function deleteExpense(expenseid){
      console.log("expenseId",expenseid)

      seExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseid));

      const response=await axios.delete(`http://localhost:3000/expense/${expenseid}`)
    }

    function editExpense(expenseid) {
      const expenseToEdit = expenses.find((expense) => expense.id === expenseid); // Use '===' for comparison
      //populating the expense
      if (expenseToEdit) {
        formRef.current.elements.amount.value = expenseToEdit.amount;
        formRef.current.elements.category.value = expenseToEdit.category;
        formRef.current.elements.description.value = expenseToEdit.description;
      }
    }
    const sum = expenses.reduce((total, expense) => total + parseInt(expense.amount), 0);


    if(sum){
      dispatch(authActions.isPremium(sum))
    }

    function downloadExpensesAsTxt(){
      const data = expenses.map((expense) => {
        return `Amount: ${expense.amount} | Description: ${expense.description} | Category: ${expense.category}`;
      });
      const text = data.join("\n");
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = "expenses.txt";
      link.click();
  
      URL.revokeObjectURL(url);
    }

  return (
    <Fragment>
       <div>

        {!isToggle && <Button onClick={downloadExpensesAsTxt}  className='flex justify-end mx-auto'>DownLoad File</Button> }
        {!isToggle && (<form onSubmit={submitHandler} ref={formRef} className="bg-gradient-to-b from-blue-800 via-pink-500 to-purple-800  rounded-lg shadow-md p-6 space-y-6 wd-full mx-auto max-w-xl mt-4">
        <h2 className=" flex text-2xl font-bold text-white mb-4 justify-center">ADD EXPENSE</h2>

        <div>
          <label htmlFor="amount" className="block text-white font-semibold mb-1">
            Expense Amount
          </label>
          <input
            type="number"
            id="amount"
            // value={amount}
            // onChange={(event) => {
            //   setAmount(parseInt(event.target.value));
            // }}
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-white font-semibold mb-1">
            Expense Description
          </label>
          <input
            type="text"
            id="description"
            // value={description}
            // onChange={(event) => {
            //   setDescription(event.target.value);
            // }}
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
          />
      </div>

      <div>
        <label htmlFor="category" className="block text-white font-semibold mb-1">
          Expense Category
        </label>
        <select
          id="category"
          // value={category}
          // onChange={(event) => {
          //   setCategory(event.target.value);
          // }}
          className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
        >
          <option>Choose Category</option>
          <option>Food</option>
          <option>Petrol</option>
          <option>Salary</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-gradient-to-b from-red-800 via-red-500 to-red-800  hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-purple-400"
      >
        Add Expense
      </button>

      <button className="bg-gradient-to-r flex mx-auto from-blue-800  to-blue-500  hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-purple-400 mt-0.25">Total amount: {sum}</button>

      <input type="text" className="hidden" /> {/* Placeholder for the missing 'imput' element */}
    </form>)}


  {!isToggle && (<ul className="bg-gradient-to-b from-blue-800 via-pink-500 to-purple-500 rounded-lg shadow-md p-6 space-y-4 mt-7 mx-5">
    {expenses && expenses.map((item, index) => (
      <li key={index} className="border-b border-gray-300 py-2 flex text-white">
        <span className="font-semibold mx-2">Amount:</span> {item.amount}---{' '}
        <span className="font-semibold mx-2">Description:</span> {item.description}---{' '}
        <span className="font-semibold mx-2">Category:</span> {item.category}
        <button className='mx-4 bg-gradient-to-b from-red-800 via-red-500 to-red-800 hover:bg-purple-600 p-2 px-3 rounded-md' onClick={() => deleteExpense(item.id)}>Delete</button>
        <button  className="mx-0.25 bg-gradient-to-b from-green-800 via-green-500 to-green-800 hover:bg-purple-600 p-2 px-3 rounded-md" onClick={() => editExpense(item.id)}>Edit</button>
      </li>
    ))}
  </ul>
  )}
</div>



  {isToggle && <div style={{backgroundColor:"black"}}>
  <div className='' style={{display:"flex" , flexDirection:"row", justifyContent:"space-between"}}>
  <Button onClick={downloadExpensesAsTxt} className=''>DownLoad File</Button>
  <span className=' text-white'>Dark theme is active now</span>

  </div>
  { isToggle && (
    
  <form onSubmit={submitHandler} className="bg-gradient-to-b from-green-600 via-red-700 to-green-600 rounded-lg shadow-md p-6 space-y-6 wd-full mx-auto max-w-xl mt-6" ref={formRef}>
    <h2 className=" flex text-2xl font-bold text-white mb-4 justify-center">ADD EXPENSE</h2>

    <div>
      <label htmlFor="amount" className="block text-white font-semibold mb-1">
        Expense Amount
      </label>
      <input
        type="number"
        id="amount"
        // value={amount}
        // onChange={(event) => {
        //   setAmount(event.target.value);
        // }}
        className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
      />
    </div>

    <div>
      <label htmlFor="description" className="block text-white font-semibold mb-1">
        Expense Description
      </label>
      <input
         type="text"
         id="description"
        // value={description}
        // onChange={(event) => {
        //   setDescription(event.target.value);
        // }}
        className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
      />
    </div>

    <div>
      <label htmlFor="category" className="block text-white font-semibold mb-1">
        Expense Category
      </label>
      <select
        id="category"
        // value={category}
        // onChange={(event) => {
        //   setCategory(event.target.value);
        // }}
        className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
      >
        <option>Choose Category</option>
        <option>Food</option>
        <option>Petrol</option>
        <option>Salary</option>
        <option>Transportation</option>
      </select>
  </div>

  <button
    type="submit"
    className="bg-gradient-to-b from-red-800 via-red-500 to-red-800  hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-purple-400"
  >
    Add Expense
  </button>

  <button className="bg-gradient-to-r flex mx-auto from-blue-800  to-blue-500  hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-purple-400">Total amount: {sum}</button>

  <input type="text" className="hidden" /> {/* Placeholder for the missing 'imput' element */}
</form>)}


{isToggle && (<ul className="bg-gradient-to-r from-red-600 via-green-500 to-red-600 rounded-lg shadow-md p-6 space-y-4 mt-7 mx-5">
  {expenses && expenses.map((item, index) => (
    <li key={index} className="border-b border-gray-300 py-2 flex text-white">
      <span className="font-semibold mx-2">Amount:</span> {item.amount}---{' '}
      <span className="font-semibold mx-2">Description:</span> {item.description}---{' '}
      <span className="font-semibold mx-2">Category:</span> {item.category}
      <button className='mx-4 bg-gradient-to-b from-red-800 via-red-500 to-red-800 hover:bg-purple-600 p-2 px-3 rounded-md' onClick={() => deleteExpense(item.id)}>Delete</button>
      <button  className="mx-0.25 bg-gradient-to-b from-green-800 via-green-500 to-green-800 hover:bg-purple-600 p-2 px-3 rounded-md" onClick={() => editExpense(item.id)}>Edit</button>
    </li>
  ))}
</ul>)}
</div>}
    </Fragment>

  )
}

export default ExpenseTracker

// import React from 'react'

// function ExpenseTracker() {
//   return (
//     <div>
//       <h1>Hello</h1>
//     </div>
//   )
// }

// export default ExpenseTracker
