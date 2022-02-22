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
        <p className="countryCity">{items[4] + " - " + items[5]}</p>
        <p className="year">
          {items[0] + " - " + items[3].slice(items[3].length - 4)}
        </p>
      </div>
      <p>{"Email: " + items[2]}</p>
    </div>
  ));
};

export default ({ initialData, initialName }) => {
  const router = useRouter();
  const [showList, setShowList] = useState(false);
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
      initialData,
    }
  );
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
    <div className={styles.container}>
      <div className={styles.header}>
        <img alt="logo" src="/logo.jpg" />
        <div className="flex w100">
          <input
            className="customInput"
            value={query.name}
            onChange={(evt) =>
              setQuery((s) => ({ ...s, name: evt.target.value }))
            }
            onKeyDown={(evt) => {
              evt.code === "Enter" && search();
            }}
          />
          <button className="customButton" onClick={search}>
            Search
          </button>
        </div>
      </div>
      <div className={styles.orderBy}>
        <p onClick={() => setShowList((s) => !s)}>↓ ↑ Order by</p>
        {showList && (
          <ul className={styles.orderList}>
            <li
              className={styles.orderListItem}
              onClick={() => {
                setQuery((s) => ({ ...s, orderBy: "name", ascending: true }));
              }}
            >
              <span>Name ascending</span>
            </li>
            <li
              className={styles.orderListItem}
              onClick={() => {
                setQuery((s) => ({ ...s, orderBy: "name", ascending: false }));
              }}
            >
              <span>Name descending</span>
            </li>
            <li
              className={styles.orderListItem}
              onClick={() => {
                setQuery((s) => ({ ...s, orderBy: "year", ascending: true }));
              }}
            >
              <span>Year ascending</span>
            </li>
            <li
              className={styles.orderListItem}
              onClick={() => {
                setQuery((s) => ({ ...s, orderBy: "year", ascending: false }));
              }}
            >
              <span>Year descending</span>
            </li>
          </ul>
        )}
      </div>
      {isError && "Something went wrong" ? (
        isLoading && "Loading..."
      ) : (
        <div className={styles.results}>{renderResult(data)}</div>
      )}
      {data.pageCount > 1 && (
        <div className={styles.pagination}>
          <button onClick={handleFirst}>First</button>
          <button onClick={handlePrev}>Previous</button>
          {[...Array(data.pageCount).keys()].map((page) => (
            <button
              style={{
                background: query.page === page + 1 ? "#204080" : "",
                color: query.page === page + 1 ? "white" : "",
              }}
              onClick={() => setQuery((s) => ({ ...s, page: page + 1 }))}
            >
              {page + 1}
            </button>
          ))}
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};
