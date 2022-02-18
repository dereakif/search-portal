import mockData from "../../mockData.json";
export default (req, res) => {
  if (!req.query.name) {
    res.statusCode = 400;
    res.send("Must have name!");
  } else {
    const filter = req.query.name ? new RegExp(req.query.name, "i") : /.*/;
    const results = mockData.data
      .filter((info) => info[0].match(filter))
      .slice(0, 6);
    if (results.length === 0) {
      res.statusCode = 404;
      res.send("Not found!");
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(results));
    }
  }
};
