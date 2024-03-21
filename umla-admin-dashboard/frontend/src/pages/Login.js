import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import umlaLogo from "../../src/assets/images/umlaLogo.png";
import umla from "../../src/assets/images/umla.png";
import backgroundPattern from "../../src/assets/images/backgroundPattern.png";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../redux/actions/adminActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminLogin = useSelector((state) => state.loginRequest);

  const { error } = adminLogin;
  const admin = localStorage.getItem("admin");

  useEffect(() => {
    if (admin) {
      navigate("/home");
    }
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginRequest({ email: email, password: password }));
  };

  useEffect(() => {
    if (error) {
      toast.error("Incorrect Email or Password");
      return;
    }
  }, [error]);

  return (
    <div className="flex justify-center gap-20 w-screen h-screen sm:flex-col md:flex-row py-8 md:py-10  md:px-20">
      {/* left form container start */}
      <div className="w-full md:w-1/2 lg:w-2/5 mx-auto my-10 ">
        <div className="flex items-center justify-center gap-6">
          <div className="w-[45px] h-[60px]">
            <img
              src={umlaLogo}
              alt="logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-2">
            <div>
              <img src={umla} alt="umla" />
            </div>
            <span className="text-[20px] font-light text-[#5E5E5E] opacity-70 tracking-wider">
              Meetup Partners
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className=" my-16">
          <div className="flex flex-col mb-8">
            <label
              htmlFor="username"
              className="font-light text-lg tracking-widest my-2 text-black text-opacity-60"
            >
              EMAIL ADDRESS
            </label>
            <input
              type="text"
              id="email"
              placeholder="Email Address"
              required
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none border-b border-[#C0C0C0] font-medium text-base px-2 tracking-wider py-3 text-black cursor-pointer my-2"
            />
          </div>

          <div className="flex flex-col mb-8 ">
            <label
              htmlFor="password"
              className="font-light text-lg tracking-widest my-2 text-black text-opacity-60"
            >
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none border-b border-[#C0C0C0] font-semibold tracking-wider text-base px-2 py-3 text-black cursor-pointer my-2"
            />
          </div>

          <label className="text-[16px] font-normal text-[#5E5E5E] text-opacity-70 flex items-center gap-2 mb-0">
            <input
              type="checkbox"
              className="text-[#5E5E5E] rounded-sm w-6 h-5 my-5"
            />
            Remember Me
          </label>

          <button
            type="submit"
            className="bg-[#515ADA] text-white text-lg font-medium w-full rounded-xl p-4 my-10 flex items-center justify-center cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="text-lg font-bold underline underline-offset-2 text-center">
          Need Help? Let's work together!
        </div>
      </div>
      {/* left form container end */}

      {/* right img container start */}
      <div
        style={{ backgroundImage: `url(${backgroundPattern})` }}
        className="flex bg-[#515ADA] h-3/4 w-full md:w-1/2 mt-10"
      >
        <div className=" w-full h-full flex items-center text-left justify-center text-white pl-5">
          <div className="text-white">
            <h3 className=" text-4xl font-normal tracking-wider ">
              WELCOME TO
            </h3>
            <h2 className=" font-bold text-4xl  mb-10 mt-8 tracking-wider">
              UMLA ADMIN
            </h2>
            <span className="text-5xl font-medium tracking-wider">
              Login to Access Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* right img container start */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default Login;
