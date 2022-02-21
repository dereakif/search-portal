import axios from "axios";
import { useQuery } from "react-query";
import { useState, useEffect, useMemo } from "react";
import styles from "../styles/Results.module.scss";
import { useRouter } from "next/router";

const getResultsOnSSR = async (name) => {
  const { data } = await axios.get(
    `http://localhost:3000/api/results?name=${name}`
  );
  return data;
};

const getResultsOnCS = async (filter) => {
  const { name, page, orderBy, ascending } = filter.queryKey[1];
  const { data } = await axios.get(
    `/api/results?name=${name}&page=${page}&orderBy=${orderBy}&ascending=${ascending}`
  );
  return data;
};

export async function getServerSideProps(context) {
  const initialName = context.query.name;
  const initialData = await getResultsOnSSR(initialName);
  if (!initialData || !initialName) {
    return { props: {} };
  }
  return {
    props: { initialData, initialName },
  };
}
const renderResult = (data) => {
  if (!data || data?.results.length === 0) return;
  return data.results.map((items) => (
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
  const router = useRouter();
  const [query, setQuery] = useState({
    name: initialName,
    page: 1,
    orderBy: "",
    ascending: false,
  });
  const { data, refetch, isError, isLoading } = useQuery(
    ["q", query],
    getResultsOnCS,
    {
      enabled: false,
    }
  );
  let dataToShow = useMemo(() => {
    if (!data) return initialData;
    return data;
  }, [data]);
  const handleNext = () => {
    if (data.pageCount > query.page) {
      setQuery((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };
  const handlePrev = () => {
    if (query.page > 1) {
      setQuery((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };
  const handleFirst = () => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  };
  const search = async () => {
    await refetch();
    router.push(
      `/results?name=${query.name}&page=${query.page}&orderBy=${query.orderBy}&ascending=${query.ascending}`,
      undefined,
      { shallow: true }
    );
  };
  useEffect(() => {
    search();
  }, [query.orderBy, query.page, query.ascending]);

  return (
    <div className={styles}>
      <img alt="logo" src="/logo.jpg" />
      <input
        value={query.name}
        onChange={(evt) => setQuery((s) => ({ ...s, name: evt.target.value }))}
        onKeyDown={(evt) => {
          evt.code === "Enter" && search();
        }}
      />
      <button onClick={search}>Search</button>

      <div className="orderByContainer">
        <p>Order by</p>
        <ul className={styles.orderList}>
          <li
            className={styles.orderListItem}
            onClick={() => {
              setQuery((s) => ({ ...s, orderBy: "name", ascending: true }));
            }}
          >
            Name ascending
          </li>
          <li
            className={styles.orderListItem}
            onClick={() => {
              setQuery((s) => ({ ...s, orderBy: "name", ascending: false }));
            }}
          >
            Name descending
          </li>
          <li
            className={styles.orderListItem}
            onClick={() => {
              setQuery((s) => ({ ...s, orderBy: "year", ascending: true }));
            }}
          >
            Year ascending
          </li>
          <li
            className={styles.orderListItem}
            onClick={() => {
              setQuery((s) => ({ ...s, orderBy: "year", ascending: false }));
            }}
          >
            Year descending
          </li>
        </ul>
      </div>
      <div>
        {isError && "Something went wrong"
          ? isLoading && "Loading..."
          : renderResult(dataToShow)}
      </div>
      <div className="pagination">
        <button onClick={handleFirst}>first</button>
        <button onClick={handlePrev}>prev</button>
        <span>{query.page}</span>
        <button onClick={handleNext}>next</button>
      </div>
    </div>
  );
};
