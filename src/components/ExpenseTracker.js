import React, { Fragment } from 'react'

function ExpenseTracker() {
  return (
    <Fragment>
       <div>

        {!isToggle && <Button onClick={downloadExpensesAsTxt} className='flex justify-end mx-auto'>DownLoad File</Button> }
        {!isToggle && (<form onSubmit={submitHandler} className="bg-gradient-to-b from-blue-800 via-pink-500 to-purple-800  rounded-lg shadow-md p-6 space-y-6 wd-full mx-auto max-w-xl mt-4">
        <h2 className=" flex text-2xl font-bold text-white mb-4 justify-center">ADD EXPENSE</h2>

        <div>
          <label htmlFor="amount" className="block text-white font-semibold mb-1">
            Expense Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(event) => {
              setAmount(parseInt(event.target.value));
            }}
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
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
          />
      </div>

      <div>
        <label htmlFor="category" className="block text-white font-semibold mb-1">
          Expense Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
          }}
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
    
  <form onSubmit={submitHandler} className="bg-gradient-to-b from-green-600 via-red-700 to-green-600 rounded-lg shadow-md p-6 space-y-6 wd-full mx-auto max-w-xl mt-6">
    <h2 className=" flex text-2xl font-bold text-white mb-4 justify-center">ADD EXPENSE</h2>

    <div>
      <label htmlFor="amount" className="block text-white font-semibold mb-1">
        Expense Amount
      </label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(event) => {
          setAmount(event.target.value);
        }}
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
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
        className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-400"
      />
    </div>

    <div>
      <label htmlFor="category" className="block text-white font-semibold mb-1">
        Expense Category
      </label>
      <select
        id="category"
        value={category}
        onChange={(event) => {
          setCategory(event.target.value);
        }}
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
