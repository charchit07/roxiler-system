const express = require("express");
const { TransactionModel } = require("../Model/Transaction.Model");

const barChartRouter = express.Router();

barChartRouter.get("/bar-chart", async (req, res) => {
  try {
    const month = req.query.month;

    // Define price ranges
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const transactions = await TransactionModel.find({ month: month });
    // Initialize counts for each price range

    const counts = new Array(priceRanges.length).fill(0);

    // Categorize transactions into price ranges
    transactions.forEach((transaction) => {
      const price = transaction.price;
      for (let i = 0; i < priceRanges.length; i++) {
        if (price >= priceRanges[i].min && price <= priceRanges[i].max) {
          counts[i]++;
          break;
        }
      }
    });

    // Format the result
    const formattedResult = priceRanges.map((range, index) => ({
      range: `${range.min}-${range.max}`,
      count: counts[index],
    }));

    res.json({ priceRanges: formattedResult });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = {
  barChartRouter,
};
