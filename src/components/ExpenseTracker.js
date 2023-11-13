import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/AuthReducer";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExpenseTracker() {
  const formRef = useRef();
  const dispatch = useDispatch();
  const [expenses, setExpenses] = useState([]);

  const isPremium = useSelector((state) => state.auth.isPremium);
  console.log(isPremium);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [updateData, setUpdateData] = useState(null);
  const sum = expenses.reduce(
    (total, expense) => total + parseInt(expense.amount),
    0
  );

  useEffect(() => {
    if (token) {
      dispatch(authActions.isLogin(token));
    }

    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const response = await axios.get("http://localhost:3000/expense");
      const data = response.data;
      const fetcheddata = [];
      for (const key in data) {
        if (data[key].userId == userId) {
          fetcheddata.push({
            id: data[key].id,
            amount: data[key].amount,
            category: data[key].category,
            description: data[key].description,
          });
        }
      }
      setExpenses(fetcheddata);
    } catch (err) {
      console.log(err);
    }
  }

  async function submitHandler(event) {
    event.preventDefault();

    const amountInput = formRef.current.elements.amount.value;
    const descriptionInput = formRef.current.elements.description.value;
    const categoryInput = formRef.current.elements.category.value;

    event.target.reset();

    const expenseData = {
      amount: parseInt(amountInput),
      description: descriptionInput,
      category: categoryInput,
      totalexpense: sum,
    };

    console.log(expenseData);
    if (!updateData) {
      await axios.post("http://localhost:3000/expense", expenseData, {
        headers: {
          Authorization: localStorage.getItem("token"), // Include the JWT token from local storage
        },
      });
    } else {
      await axios.put(
        `http://localhost:3000/expense/${updateData}`,
        expenseData
      );
      // console.log(updateData)
      setUpdateData(null);
    }
    fetchExpenses();
  }

  const deleteExpense = (expenseId) => {
    console.log("ID", expenseId);
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== expenseId)
    );
    axios.delete(`http://localhost:3000/expense/${expenseId}`);
  };
  const editExpense = (expenseId) => {
    //   findind the specific object  which needs to populate
    setUpdateData(expenseId);
    const expenseToEdit = expenses.find((expense) => expense.id === expenseId);
    if (expenseToEdit) {
      formRef.current.elements.amount.value = expenseToEdit.amount;
      formRef.current.elements.description.value = expenseToEdit.description;
      formRef.current.elements.category.value = expenseToEdit.category;
    }
  };

  function downloadExpensesAsTxt() {
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
    <>
      <div>
        {!isPremium && (
          <Button
            onClick={downloadExpensesAsTxt}
            className="flex justify-end mx-auto"
          >
            DownLoad File
          </Button>
        )}
        {!isPremium && (
          <form
            onSubmit={submitHandler}
            ref={formRef}
            className="bg-gradient-to-b from-blue-800 via-pink-500 to-purple-800  rounded-lg shadow-md p-6 space-y-6 wd-full mx-auto max-w-xl mt-4"
          >
            <h2 className=" flex text-2xl font-bold text-white mb-4 justify-center">
              ADD EXPENSE
            </h2>
            <div>
              <label
                htmlFor="amount"
                className="block text-white font-semibold mb-1"
              >
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
              <label
                htmlFor="description"
                className="block text-white font-semibold mb-1"
              >
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
              <label
                htmlFor="category"
                className="block text-white font-semibold mb-1"
              >
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
            <button className="bg-gradient-to-r flex mx-auto from-blue-800  to-blue-500  hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-purple-400 mt-0.25">
              Total amount: {sum}
            </button>
            <input type="text" className="hidden" />{" "}
            {/* Placeholder for the missing 'imput' element */}
          </form>
        )}

        {!isPremium && (
          <ul className="bg-gradient-to-b from-blue-800 via-pink-500 to-purple-500 rounded-lg shadow-md p-6 space-y-4 mt-7 mx-5">
            {expenses &&
              expenses.map((item, index) => (
                <li
                  key={index}
                  className="border-b border-gray-300 py-2 flex text-white"
                >
                  <span className="font-semibold mx-2">Amount:</span>{" "}
                  {item.amount}---{" "}
                  <span className="font-semibold mx-2">Description:</span>{" "}
                  {item.description}---{" "}
                  <span className="font-semibold mx-2">Category:</span>{" "}
                  {item.category}
                  <button
                    className="mx-4 bg-gradient-to-b from-red-800 via-red-500 to-red-800 hover:bg-purple-600 p-2 px-3 rounded-md"
                    onClick={() => deleteExpense(item.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="mx-0.25 bg-gradient-to-b from-green-800 via-green-500 to-green-800 hover:bg-purple-600 p-2 px-3 rounded-md"
                    onClick={() => editExpense(item.id)}
                  >
                    Edit
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {isPremium && (
        <div style={{ backgroundColor: "black" }}>
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={downloadExpensesAsTxt} className="">
              DownLoad File
            </Button>
            <span className=" text-yellow-500 text-xl mr-2">
              You are Premium user
            </span>
          </div>
          {isPremium && (
            <form
              onSubmit={submitHandler}
              className="bg-gradient-to-b from-green-600 via-red-700 to-green-600 rounded-lg shadow-md p-6 space-y-6 wd-full mx-auto max-w-xl mt-6"
              ref={formRef}
            >
              <h2 className=" flex text-2xl font-bold text-white mb-4 justify-center">
                ADD EXPENSE
              </h2>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-white font-semibold mb-1"
                >
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
                <label
                  htmlFor="description"
                  className="block text-white font-semibold mb-1"
                >
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
                <label
                  htmlFor="category"
                  className="block text-white font-semibold mb-1"
                >
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
              <button className="bg-gradient-to-r flex mx-auto from-blue-800  to-blue-500  hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-purple-400">
                Total amount: {sum}
              </button>
              <input type="text" className="hidden" />{" "}
              {/* Placeholder for the missing 'imput' element */}
            </form>
          )}

          {isPremium && (
            <ul className="bg-gradient-to-r from-red-600 via-green-500 to-red-600 rounded-lg shadow-md p-6 space-y-4 mt-7 mx-5">
              {expenses &&
                expenses.map((item, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-300 py-2 flex text-white"
                  >
                    <span className="font-semibold mx-2">Amount:</span>{" "}
                    {item.amount}---{" "}
                    <span className="font-semibold mx-2">Description:</span>{" "}
                    {item.description}---{" "}
                    <span className="font-semibold mx-2">Category:</span>{" "}
                    {item.category}
                    <button
                      className="mx-4 bg-gradient-to-b from-red-800 via-red-500 to-red-800 hover:bg-purple-600 p-2 px-3 rounded-md"
                      onClick={() => deleteExpense(item.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="mx-0.25 bg-gradient-to-b from-green-800 via-green-500 to-green-800 hover:bg-purple-600 p-2 px-3 rounded-md"
                      onClick={() => editExpense(item.id)}
                    >
                      Edit
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
