import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TestStatusForm from './pages/TestStatusForm';
import TestCompletionForm from './pages/TestCompletionForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/status" element={<TestStatusForm />} />
        <Route path="/completion" element={<TestCompletionForm />} />
      </Routes>
    </Router>
  );
}

export default App;
