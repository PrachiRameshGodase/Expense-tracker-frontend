import 'bootstrap/dist/css/bootstrap.min.css';
import AuthForm from './components/AuthForm';
import ExpenseTracker from './components/ExpenseTracker';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/expensetracker" element={<ExpenseTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
