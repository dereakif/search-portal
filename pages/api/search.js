/* eslint-disable import/no-anonymous-default-export */
import mockData from "../../mockData.json";

export default (req, res) => {
  const filter = req.query.q ? new RegExp(req.query.q, "i") : /.*/;
  const result = mockData.data
    .filter((info) => info[0].match(filter))
    .slice(0, 3);
  if (result.length === 0) {
    res.statusCode = 404;
    res.send("Not found!");
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  }
};
