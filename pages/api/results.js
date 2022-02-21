import mockData from "../../mockData.json";

const sortByName = (a, b) => {
  const nameA = a[0].toUpperCase();
  const nameB = b[0].toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

const sortByYear = (a, b) => {
  const yearA = parseInt(a[3].slice(a[3].length - 4));
  const yearB = parseInt(b[3].slice(b[3].length - 4));
  return yearA - yearB;
};

export default (req, res) => {
  if (!req.query.name) {
    res.statusCode = 400;
    res.send("Must have name!");
  } else {
    const { name, page, orderBy, ascending } = req.query;
    const filter = name ? new RegExp(name, "i") : /.*/;
    const data = mockData.data;
    const total = data.filter((info) => info[0].match(filter));
    if (orderBy === "name") {
      total.sort(sortByName);
    }
    if (orderBy === "year") {
      total.sort(sortByYear);
    }
    if (ascending === "false") {
      total.reverse();
    }
    const pageSize = 3;
    const pageIndex = parseInt(page) || 1;
    const start = (pageIndex - 1) * pageSize;
    const results = total.slice(start, start + pageSize);
    if (results.length === 0) {
      res.statusCode = 404;
      res.send("Not found!");
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ results, pageCount: total.length / 3 }));
    }
  }
};
