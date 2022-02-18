import axios from "axios";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import styles from "../styles/Results.module.scss";

const getResults = async (name) => {
  const { data } = await axios.get(
    `http://localhost:3000/api/results?name=${name}`
  );
  return data;
};

const search = async (filter) => {
  const name = filter.queryKey[1];
  const { data } = await axios.get(`/api/search?q=${name}`);
  return data;
};

export async function getServerSideProps(context) {
  const initialName = context.query.name;
  const initialData = await getResults(initialName);
  return {
    props: { initialData, initialName },
  };
}
const renderResult = (data) => {
  if (!data || data?.length === 0) return;
  return data.map((items) => (
    <div key={items[2]} className={styles.resultItems}>
      <div>
        <p>{items[4] + " - " + items[5]}</p>
        <p>{items[0] + " - " + items[3].slice(items[3].length - 4)}</p>
      </div>
      <p>{"Email: " + items[2]}</p>
    </div>
  ));
};

export default ({ initialData, initialName }) => {
  const [query, setQuery] = useState(initialName);
  const [dataToShow, setDataToShow] = useState(initialData);
  const { data, refetch, isError, isLoading } = useQuery(["q", query], search, {
    enabled: false,
  });

  useEffect(() => {
    if (query !== initialName && data?.length > 0) {
      console.log(query);
      setDataToShow(data);
      setQuery("");
    }
  }, [data]);

  return (
    <div className={styles}>
      <img alt="logo" src="/logo.jpg" />
      <input
        value={query}
        onChange={(evt) => setQuery(evt.target.value)}
        onKeyDown={(evt) => {
          evt.code === "Enter" && refetch();
        }}
      />
      <button onClick={refetch}>Search</button>
      {isError && <div>Something went wrong</div>}
      {isLoading && <div>Loading...</div>}
      <div className={styles.results}>{renderResult(dataToShow)}</div>
    </div>
  );
};
