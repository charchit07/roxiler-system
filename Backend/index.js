const express = require("express");

const { connection } = require("./config/db");
const { transactionRouter } = require("./Router/Transaction.Router");
const { statisticRouter } = require("./Router/Statistics.Router");
const { barChartRouter } = require("./Router/BarChart.Router");
const { pieChartRouter } = require("./Router/PieChart.Router");


const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/",transactionRouter );
app.use("/",statisticRouter );
app.use("/", barChartRouter);
app.use("/", pieChartRouter);

app.listen(7500, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log(" Cannot Connected to DB");
    console.log(error);
  }
  console.log("Running the server at port 7500");
});
