import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import logo from "../public/logo.jpg";

const search = async (filter) => {
  const name = filter.queryKey[1];
  const { data } = await axios.get(`/api/search?q=${name}`);
  return data;
};
export default function Home() {
  const [query, setQuery] = useState("");
  const { data } = useQuery(["q", query], search);
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
      />
      <button>Search</button>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
