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

const renderResultBox = (data, query) => {
  if (!data) return;
  return (
    <div className={styles.results}>
      {data.map((items, index) => {
        return index > 2 ? (
          <Link
            key={items[2]}
            href={{ pathname: "/results", query: { name: query } }}
          >
            show more
          </Link>
        ) : (
          <div key={items[2]} className={styles.resultItems}>
            <div>
              <p>{items[4] + " - " + items[5]}</p>
              <p>{items[0] + " - " + items[3].slice(items[3].length - 4)}</p>
            </div>
            <p>{"Email: " + items[2]}</p>
          </div>
        );
      })}
    </div>
  );
};
export default function Home() {
  const [query, setQuery] = useState("");
  const { data, refetch } = useQuery(["q", query], search, { enabled: false });
  return (
    <div className={styles.container}>
      <Head>
        <title>Search App</title>
        <meta name="description" content="Search value!" />
        <link rel="icon" href="logo.jpg" />
      </Head>
      <img src="logo.jpg" alt="logo" />
      <input
        type="text"
        placeholder="search"
        aria-label="Search"
        value={query}
        onChange={(evt) => setQuery(evt.target.value)}
        onKeyDown={(evt) => {
          evt.code === "Enter" && refetch();
        }}
      />
      <button onClick={refetch}>Search</button>
      {renderResultBox(data, query)}
    </div>
  );
}
