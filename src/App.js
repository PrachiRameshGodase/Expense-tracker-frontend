import "bootstrap/dist/css/bootstrap.min.css";
import AuthForm from "./components/AuthForm/AuthForm";
import ExpenseTracker from "./components/ExpenseTracker/ExpenseTracker";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import { useSelector } from "react-redux";
import LeaderBoard from "./components/ExpenseTracker/LeaderBoard";
import ForgotPassword from "./components/AuthForm/ForgotPassword";
import Alldownload from "./components/ExpenseTracker/Alldownload";

function App() {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/alldownload" element={<Alldownload />}></Route>
        {isAuth ? (
          <Route path="/expensetracker" element={<ExpenseTracker />} />
        ) : (
          <Route path="/expensetracker" element={<AuthForm />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
