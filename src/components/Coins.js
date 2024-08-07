import { useEffect, useState, useRef } from "react";
import { Table, Checkbox, Pagination } from "flowbite-react/lib/esm";
import { Link } from "react-router-dom";
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
import AddToast from "./AddToast";
import RemoveToast from "./RemoveToast";
import LoginToast from "./LoginToast";
import Loading from "./Loading";
import Error from "./Error";

const Coins = () => {
  const [user] = useAuthState(auth);

  //data fetching
  const [coins, setCoins] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage, setCoinsPerPage] = useState(10);

  const [checkboxStates, setCheckboxStates] = useState({});

  //toast notifications
  const addToastRef = useRef();
  const removeToastRef = useRef();
  const LoginToastRef = useRef();

  useEffect(() => {
    const options = {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${process.env.REACT_APP_COINRANKING_KEY}`,
      },
      signal: abortControllerRef.current?.signal,
    };

    const getCoins = async (options) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://api.coinranking.com/v2/coins",
          options
        );
        const data = await response.json();
        setCoins(data.data.coins);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getCoins(options);
  }, []);

  useEffect(() => {
    if (user && coins) {
      const watchlistRef = doc(db, "watchlists", user.uid);

      getDoc(watchlistRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const watchlistData = docSnap.data();
            const initialCheckboxStates = coins.reduce((acc, coin) => {
              acc[coin.uuid] = watchlistData.watchlist.includes(coin.uuid);
              return acc;
            }, {});
            setCheckboxStates(initialCheckboxStates);
          }
        })
        .catch((error) => {
          console.error("Error fetching watchlist:", error);
        });
    } else {
      // If user is not logged in or coins are not fetched, reset checkbox states
      setCheckboxStates({});
    }
  }, [user, coins]);

  // Get Current Coins
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = coins?.slice(indexOfFirstCoin, indexOfLastCoin);

  const onPageChange = (page) => setCurrentPage(page);

  const handleAddToast = () => {
    addToastRef.current.showToast();
  };

  const handleRemoveToast = () => {
    removeToastRef.current.showToast();
  };

  const handleLoginToast = () => {
    LoginToastRef.current.showToast();
  };

  const handleWatchlist = async (e, coinUUID) => {
    if (user) {
      // if logged in
      const updatedCheckboxStates = { ...checkboxStates };
      updatedCheckboxStates[coinUUID] = e.target.checked;
      setCheckboxStates(updatedCheckboxStates);

      const watchlistRef = doc(db, "watchlists", user.uid);
      setDoc(watchlistRef, { capital: true }, { merge: true });

      if (e.target.checked) {
        // add to watchlist
        await updateDoc(watchlistRef, {
          watchlist: arrayUnion(coinUUID),
        });
        handleAddToast();
      } else {
        // remove from watchlist
        await updateDoc(watchlistRef, {
          watchlist: arrayRemove(coinUUID),
        });
        handleRemoveToast();
      }
    } else {
      // if not logged in
      handleLoginToast();
    }
  };

  return (
    <div>
      <AddToast ref={addToastRef} timeout={3000}></AddToast>
      <RemoveToast ref={removeToastRef} timeout={3000}></RemoveToast>
      <LoginToast ref={LoginToastRef} timeout={3000}></LoginToast>

      <div className="w-11/12 max-w-screen-xl m-auto overflow-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell></Table.HeadCell>
            <Table.HeadCell>Rank</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell className="text-right">Price</Table.HeadCell>
            <Table.HeadCell className="text-right">24 %</Table.HeadCell>
            <Table.HeadCell className="text-right">Market Cap</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {isLoading ? (
              <Loading></Loading>
            ) : error ? (
              <Error message={error}></Error>
            ) : (
              currentCoins?.map((coin) => (
                <Table.Row
                  key={coin.rank}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="!p-4">
                    <Checkbox
                      value={coin.uuid}
                      onChange={(e) => handleWatchlist(e, coin.uuid)}
                      checked={checkboxStates[coin.uuid] || false}
                    />
                  </Table.Cell>
                  <Table.Cell>{coin.rank}</Table.Cell>
                  <Table.Cell className="flex justify-start items-center whitespace-nowrap font-medium">
                    <img src={coin.iconUrl} className="w-7"></img>
                    <Link to={`/coins/${coin.uuid}`}>
                      <span className="mx-2 text-gray-900 dark:text-white">
                        {coin.name}
                      </span>
                    </Link>

                    <span className="text-grey-100">{coin.symbol}</span>
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {Number(coin.price).toFixed(5)}
                  </Table.Cell>
                  <Table.Cell
                    className={
                      Number(coin.change) < 0
                        ? "text-red-500 text-right"
                        : "text-green-500 text-right"
                    }
                  >
                    {coin.change}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {Number(coin.marketCap).toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      <div className="flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
          showIcons
          totalPages={5}
          className="inline-block my-4"
        />
      </div>
    </div>
  );
};

export default Coins;
