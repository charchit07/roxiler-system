const express = require("express");
const { TransactionModel } = require("../Model/Transaction.Model");

const statisticRouter = express.Router();

// Endpoint to retrieve statistics for the selected month
statisticRouter.get("/statistics", async (req, res) => {
  try {
    const selectedMonth = req.query.month; // Assuming the month is passed as a query parameter

    // Calculate statistics for the selected month
    const totalSaleAmount = await TransactionModel.aggregate([
      {
        $match: { month: selectedMonth, sold: true },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $toDouble: "$price" } }, // Convert price to double
        },
      },
    ]);

    const totalSoldItems = await TransactionModel.countDocuments({
      month: selectedMonth,
      sold: true,
    });
    const totalNotSoldItems = await TransactionModel.countDocuments({
      month: selectedMonth,
      sold: false,
    });

    res.json({
      totalSaleAmount:
        totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  statisticRouter,
};
