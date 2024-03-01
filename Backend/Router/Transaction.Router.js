const express = require("express");
const axios = require("axios");
const { TransactionModel } = require("../Model/Transaction.Model");
const transactionRouter = express.Router();

const paginateResults = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        perPage: perPage,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        perPage: perPage,
      };
    }

    try {
      results.results = await model
        .find()
        .limit(perPage)
        .skip(startIndex)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

transactionRouter.get("/initialize-database", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    // Loop through the response data
    const updatedData = response.data.map((item) => {
      // Convert the dateOfSale to a JavaScript Date object
      const dateOfSale = new Date(item.dateOfSale);

      // Extract the month name from the date dynamically
      const monthName = dateOfSale.toLocaleString("default", { month: "long" });

      // Create a new key "month" to store the month name
      item["month"] = monthName;
      return item;
    });

    // Clear existing data and insert the updated data into the database
    await TransactionModel.deleteMany({});
    await TransactionModel.insertMany(updatedData);

    res.json({ message: "Database initialized with seed data" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error initializing the database" });
  }
});

transactionRouter.get(
  "/transactions",
  paginateResults(TransactionModel),
  async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const search = req.query.search;

    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    const results = {};

    if (endIndex < res.paginatedResults.results.length) {
      results.next = {
        page: page + 1,
        perPage: perPage,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        perPage: perPage,
      };
    }

    try {
      let query = {};
      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { price: { $regex: search, $options: "i" } },
          ],
        };

        // Attempt to convert search query to a number
        // const price = parseFloat(search);
        // if (!isNaN(price)) {
        //   // If search query can be converted to a number, add search condition for the price
        //   query.$or.push({ 'price': price });
        // }
      }

      const transactions = await TransactionModel.find(query)
        .limit(perPage)
        .skip(startIndex)
        .exec();
      console.log(transactions);
      results.results = transactions;
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = {
  transactionRouter,
};
