import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/AuthReducer";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExpenseTracker() {
  const formRef = useRef();
  const dispatch = useDispatch();
  const [expenses, setExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

    fetchExpenses(currentPage);
  }, [currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset the current page when items per page changes
  };
  async function fetchExpenses(page) {
    try {
      const response = await axios.get("http://localhost:3000/expense", {
        params: { page, limit: itemsPerPage },
        headers: { Authorization: localStorage.getItem("token") },
      });
      const { expenses, totalItems } = response.data;

      setExpenses(expenses);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
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
    fetchExpenses(currentPage);
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

  async function downloadExpensesAsTxt() {
    // const data = expenses.map((expense) => {
    //   return `Amount: ${expense.amount} | Description: ${expense.description} | Category: ${expense.category}`;
    // });
    // const text = data.join("\n");
    // const blob = new Blob([text], { type: "text/plain" });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "expenses.txt";
    // link.click();
    // URL.revokeObjectURL(url);
    const response = await axios.get("http://localhost:3000/download", {
      headers: {
        Authorization: localStorage.getItem("token"), // Include the JWT token from local storage
      },
    });
    console.log(response.data);
    const { fileUrl } = response.data;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "expenses.txt";
    link.click();

    // URL.revokeObjectURL(url);
  }
  const allDownload = () => {
    navigate("/alldownload");
  };
  return (
    <>
      <div>
        {!isPremium && (
          <div>
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

            <div className="flex items-center justify-center mt-4 space-x-4">
              <span className="text-white bg-gradient-to-b from-red-400 to-purple-700 px-2 py-2 font-medium text-black rounded-lg">
                Select Number of Rows
              </span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border bg-gradient-to-b from-red-400 to-purple-700 border-white rounded px-3 py-2 text-black"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        )}

        {!isPremium && (
          <div>
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
            <div className="flex justify-center mt-4 space-x-4">
              {currentPage > 1 && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                  onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                >
                  Previous Page
                </button>
              )}

              {currentPage < totalPages && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                  onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                >
                  Next Page
                </button>
              )}
            </div>
          </div>
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
            <Button onClick={allDownload} className="mt-2">
              All Downloads
            </Button>
          )}
          {isPremium && (
            <div>
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
              <div className="flex items-center justify-center mt-4 space-x-4">
                <span className="text-white bg-red-500 px-2 py-2 font-medium rounded-lg">
                  Select Number of Rows
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border bg-red-500 border-white rounded px-3 py-2 text-white"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
          )}

          {isPremium && (
            <div>
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
              <div className="flex justify-center mt-4 space-x-4">
                {currentPage > 1 && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                    onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                  >
                    Previous Page
                  </button>
                )}

                {currentPage < totalPages && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                  >
                    Next Page
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
