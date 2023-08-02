import { useEffect, useState } from "react";
import { auth } from "../utils/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Alert, Card, Table } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";
import { Link } from "react-router-dom";
import { Checkbox } from "flowbite-react";

const Watchlist = () => {
  const [user, loading] = useAuthState(auth);
  const [watchlist, setWatchlist] = useState();
  const [coins, setCoins] = useState();

  useEffect(() => {
    getWatchlist();
    console.log(watchlist);

    const options = {
      headers: {
        "Content-Type": "application/json",
        "x-access-token":
          "coinrankingffd88d7f1f3ded6efdd4294f69bc4947eaeea7a7afd17f66",
      },
    };

    fetch("https://api.coinranking.com/v2/coins", options)
      .then((response) => response.json())
      .then((result) => setCoins(result.data.coins));

    console.log(coins);
  }, []);

  const getWatchlist = async () => {
    if (user) {
      const docRef = doc(db, "watchlists", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setWatchlist(docSnap.data().watchlist);
      }
    }
  };

  return (
    <div className="flex item-center justify-center">
      {!user && (
        <Alert
          color="failure"
          icon={HiInformationCircle}
          className="w-11/12 m-auto max-w-screen-xl my-5"
        >
          <span>
            <p>
              <span className="font-medium">Info alert!</span>
              You have to login to see/create your watchlist
            </p>
          </span>
        </Alert>
      )}

      {user && (
        <Card className="w-11/12 max-w-screen-xl m-auto my-5">
          <div className="flex justify-end px-4 pt-4"></div>
          <div className="flex flex-col items-center pb-10">
            <img
              src={user.photoURL}
              className="h-24 mb-3 rounded-full shadow-lg"
            ></img>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              {user.displayName}
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </span>
            <div className="mt-4 flex space-x-3 lg:mt-6">
              <a
                className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                href="#"
              >
                <p>Add friend</p>
              </a>
              <a
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                href="#"
              >
                <p>Message</p>
              </a>
            </div>
          </div>

          <div className="w-11/12 max-w-screen-xl m-auto my-5">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell>Rank</Table.HeadCell>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell className="text-right">Price</Table.HeadCell>
                <Table.HeadCell className="text-right">24 %</Table.HeadCell>
                <Table.HeadCell className="text-right">
                  Market Cap
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                {coins
                  ?.filter((coin) => watchlist?.includes(coin.uuid))
                  .map((coin) => (
                    <Table.Row
                      key={coin.rank}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="!p-4">
                        <Checkbox />
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
                  ))}
              </Table.Body>
            </Table>
          </div>
          {/* <div className="flex items-center justify-center">
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
          }}
          showIcons
          totalPages={5}
          className="inline-block my-4"
        /> */}
        </Card>
      )}
    </div>
  );
};

export default Watchlist;
