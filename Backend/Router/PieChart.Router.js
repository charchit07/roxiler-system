const express = require("express");
const { TransactionModel } = require("../Model/Transaction.Model");

const pieChartRouter = express.Router();

pieChartRouter.get("/pie-chart", async (req, res) => {
  try {
    const month = req.query.month;
    const transactions = await TransactionModel.find({ month: month });

    // Count items for each category
    const categoryCounts = {};
    transactions.forEach((transaction) => {
      const category = transaction.category;
      if (!categoryCounts[category]) {
        categoryCounts[category] = 1;
      } else {
        categoryCounts[category]++;
      }
    });

    // Format the result
    const formattedResult = Object.keys(categoryCounts).map((category) => ({
      category: category,
      count: categoryCounts[category],
    }));

    res.json({ categories: formattedResult });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = {
  pieChartRouter,
};
