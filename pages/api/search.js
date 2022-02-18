/* eslint-disable import/no-anonymous-default-export */
import mockData from "../../mockData.json";

export default (req, res) => {
  const filter = req.query.q ? new RegExp(req.query.q, "i") : /.*/;
  console.log({ filter });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify(
      mockData.data.filter((info) => info[0].match(filter)).slice(0, 4)
    )
  );
};
