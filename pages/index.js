import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Link from "next/link";

const search = async (filter) => {
  const name = filter.queryKey[1];
  const { data } = await axios.get(`/api/search?q=${name}`);
  return data;
};

const renderResultBox = ({ data, isError, query }) => {
  if (!data || isError) return;
  return (
    <div className={styles.results}>
      {data.map((items, index) => {
        return (
          <div key={items[2]} className={styles.resultItems}>
            <div>
              <p className="countryCity">{items[4] + " - " + items[5]}</p>
              <p className="year">
                {items[0] + " - " + items[3].slice(items[3].length - 4)}
              </p>
            </div>
            <p>{"Email: " + items[2]}</p>
          </div>
        );
      })}
      <p className={styles.showMore}>
        <Link
          key="showMore"
          href={{ pathname: "/results", query: { name: query } }}
        >
          Show more...
        </Link>
      </p>
    </div>
  );
};
export default function Home() {
  const [query, setQuery] = useState("");
  const { data, refetch, error, isError } = useQuery(["q", query], search, {
    enabled: false,
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>Search App</title>
        <meta name="description" content="Search value!" />
        <link rel="icon" href="logo.jpg" />
      </Head>
      <div className={styles.imgContainer}>
        <img src="logo.jpg" alt="logo" />
        <p className={styles.subtitle}>Search web app</p>
      </div>
      <div className={styles.ladingInputContainer}>
        <div className="flex">
          <input
            className={isError ? "isError" : " customInput"}
            type="text"
            placeholder="Search by name..."
            aria-label="Search"
            value={query}
            onChange={(evt) => setQuery(evt.target.value)}
            onKeyDown={(evt) => {
              evt.code === "Enter" && refetch();
            }}
          />
          <button className="customButton" onClick={refetch}>
            Search
          </button>
        </div>
        {error?.message && <p className={styles.errorMessage}>Not Found!</p>}
        {renderResultBox({ data, query, isError })}
      </div>
    </div>
  );
}
