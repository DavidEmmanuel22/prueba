import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Cinema from './pages/cinema'

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Cinema />} />
      
    </Routes>
  </Router>
   
  );
}

export default App;
