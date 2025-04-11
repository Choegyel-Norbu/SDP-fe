import { ToastContainer } from "react-toastify";
import AppRouting from "./routes/AppRouting";
// import "./app.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

function App() {
  return (
    <>
      <AppRouting />
      <ToastContainer />
    </>
  );
}

export default App;
