import { ColorType, createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Badge, Checkbox } from "flowbite-react";
import { auth, db } from "../utils/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import AddToast from "../components/AddToast";
import RemoveToast from "../components/RemoveToast";
import LoginToast from "../components/LoginToast";

const CoinDetail = () => {
  const [user] = useAuthState(auth);
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);

  const chartContainerRef = useRef();

  const params = useParams();
  const { id } = params;

  const [priceHistory, setPriceHistory] = useState([]);

  //data fetching
  const [coin, setCoin] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const addToastRef = useRef();
  const removeToastRef = useRef();
  const LoginToastRef = useRef();

  useEffect(() => {
    const checkIfAddedToWatchlist = async () => {
      if (user) {
        const watchlistRef = doc(db, "watchlists", user.uid);
        const docSnap = await getDoc(watchlistRef);
        if (docSnap.exists()) {
          setIsAddedToWatchlist(docSnap.data().watchlist.includes(id));
        }
      }
    };

    checkIfAddedToWatchlist();
  }, [user, id]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    });

    const newSeries = chart.addAreaSeries({
      lineColor: "#2963FF",
      topColor: "#2963FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
    });

    if (priceHistory.length > 0) {
      newSeries.setData(priceHistory);
    } else {
      newSeries.setData(initialData);
    }

    return () => {
      if (chart) {
        chart.remove();
      }
    };
  }, [priceHistory]);

  const handleWatchlist = async (e) => {
    if (user) {
      const watchlistRef = doc(db, "watchlists", user.uid);
      setDoc(watchlistRef, { capital: true }, { merge: true });

      if (e.target.checked) {
        // add to watchlist
        await updateDoc(watchlistRef, {
          watchlist: arrayUnion(id),
        });
        setIsAddedToWatchlist(true);
        handleAddToast();
      } else {
        // remove from watchlist
        await updateDoc(watchlistRef, {
          watchlist: arrayRemove(id),
        });
        setIsAddedToWatchlist(false);
        handleRemoveToast();
      }
    } else {
      // if not logged in
      handleLoginToast();
    }
  };

  const handleAddToast = () => {
    addToastRef.current.showToast();
  };

  const handleRemoveToast = () => {
    removeToastRef.current.showToast();
  };

  const handleLoginToast = () => {
    LoginToastRef.current.showToast();
  };

  useEffect(() => {
    const options = {
      headers: {
        "x-access-token": `${process.env.REACT_APP_COINRANKING_KEY}`,
      },
      signal: abortControllerRef.current?.signal,
    };

    const getPriceHistory = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.coinranking.com/v2/coin/${id}/history?timePeriod=1y`,
          options
        );
        const data = await response.json();
        setPriceHistory(convertData(data.data.history));
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getPriceHistory();

    const getCoin = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.coinranking.com/v2/coin/${id}`,
          options
        );
        const data = await response.json();
        setCoin(data.data.coin);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getCoin();
  }, [id]);

  const convertData = (apiResponse) => {
    return apiResponse
      .map((item) => {
        const date = new Date(item.timestamp * 1000);
        const formattedDate = date.toISOString().slice(0, 10);
        const value = parseFloat(item.price);
        return { time: formattedDate, value };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const initialData = [
    { time: "2018-12-22", value: 32.51 },
    { time: "2018-12-23", value: 31.11 },
    { time: "2018-12-24", value: 27.02 },
    { time: "2018-12-25", value: 27.32 },
    { time: "2018-12-26", value: 25.17 },
    { time: "2018-12-27", value: 28.89 },
    { time: "2018-12-28", value: 25.46 },
    { time: "2018-12-29", value: 23.92 },
    { time: "2018-12-30", value: 22.68 },
    { time: "2018-12-31", value: 22.67 },
  ];

  return (
    <div>
      <AddToast ref={addToastRef} timeout={3000}></AddToast>
      <RemoveToast ref={removeToastRef} timeout={3000}></RemoveToast>
      <LoginToast ref={LoginToastRef} timeout={3000}></LoginToast>

      {isLoading ? (
        <div className="w-11/12 max-w-screen-xl m-auto my-5 flex justify-start items-center">
          <h1 className="text-black text-2xl">Loading...</h1>
        </div>
      ) : error ? (
        <div className="w-11/12 max-w-screen-xl m-auto my-5 flex justify-start items-center">
          <h1 className="text-black text-2xl">
            There is an error, please try again later... <br></br>
            {error}
          </h1>
        </div>
      ) : (
        <Card className="w-11/12 max-w-screen-xl m-auto my-5" href="#">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="flex justify-start items-center">
              <img src={coin.iconUrl} className="w-7"></img>
              <h5 className="mx-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {coin.name} Price Chart
              </h5>
            </div>
            <div className="flex items-center border border-slate-300 rounded-md my-2 p-2 w-fit">
              <Checkbox
                className="mr-2"
                checked={isAddedToWatchlist}
                onChange={handleWatchlist}
              ></Checkbox>
              <p>
                {isAddedToWatchlist
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
              </p>
            </div>
          </div>

          <div
            className="w-11/12 m-auto overflow-auto"
            ref={chartContainerRef}
          ></div>

          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            <p>Description</p>
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {coin.description}
          </p>

          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            <p>Related Links</p>
          </h5>
          <div className="flex flex-wrap">
            <Badge color="info" className="m-2">
              <a href={coin.websiteUrl} target="blank">
                Website
              </a>
            </Badge>

            {coin.links.map((link) => (
              <Badge color="info" className="m-2">
                <a href={link.url} target="blank">
                  {link.name}
                </a>
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CoinDetail;
