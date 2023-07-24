import { Route, Routes } from "react-router-dom";
import { useRef } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./components/Home";
import CoinDetail from "./components/CoinDetail";
import About from "./components/About";
import Watchlist from "./components/Watchlist";
import { AddToast, RemoveToast, LoginToast } from "./components/Toasts";

function App() {
  const AddToastRef = useRef();
  const RemoveToastRef = useRef();
  const LoginToastRef = useRef();

  return (
    <div>
      <AddToast ref={AddToastRef}></AddToast>
      <RemoveToast ref={RemoveToastRef}></RemoveToast>
      <LoginToast ref={LoginToastRef}></LoginToast>

      <Nav></Nav>

      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/coins/:id" element={<CoinDetail></CoinDetail>}></Route>
        <Route path="/about" element={<About></About>}></Route>
        <Route path="/watchlist" element={<Watchlist></Watchlist>}></Route>
      </Routes>
    </div>
  );
}

export default App;
