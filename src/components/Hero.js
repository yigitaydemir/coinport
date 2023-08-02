import Lottie from "lottie-react";
import animationData from "../media/home.json";
import { MdSupervisorAccount } from "react-icons/md";
import { FaListUl } from "react-icons/fa";
import { TbDeviceAnalytics } from "react-icons/tb";

const Hero = () => {
  return (
    <div>
      <div className="w-11/12 max-w-screen-xl m-auto flex my-10 flex-col md:flex-row">
        <div className="w-full md:w-2/3 py-10 flex flex-col justify-center">
          <p className="text-2xl">CoinBuzz</p>
          <p className="text-7xl my-5">
            Track Your Crypto <br /> Portfolio Easily
          </p>
          <p className="leading-7 tracking-wide text-md">
            Add your favorite cryptocurrencies to your watchlist to closely
            follow <br />
            their performance and maximize your investment potential.
          </p>
        </div>

        <div className="w-full md:w-1/3">
          <Lottie animationData={animationData}></Lottie>
        </div>
      </div>

      <div className="w-11/12 max-w-screen-xl m-auto grid grid-cols-1 sm:grid-cols-3 gap-10 my-10">
        <div>
          <p className="flex items-center text-xl">
            <span className="text-2xl mr-1">
              <MdSupervisorAccount></MdSupervisorAccount>
            </span>
            Create an Account
          </p>
          <p>
            Sign up with Google to access your personalized watchlist and
            portfolio
          </p>
        </div>

        <div>
          <p className="flex items-center text-xl">
            <span className="text-2xl mr-1">
              <FaListUl></FaListUl>
            </span>
            Build Your Watchlist
          </p>
          <p>
            Explore the vast collection of cryptocurrencies and add your
            favorite ones to your watchlist
          </p>
        </div>

        <div>
          <p className="flex items-center text-xl">
            <span className="text-2xl mr-1">
              <TbDeviceAnalytics></TbDeviceAnalytics>
            </span>
            Analyze and Invest
          </p>
          <p>
            Dive into the detailed insights and performance graphs of each
            cryptocurrency in your watchlist
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
