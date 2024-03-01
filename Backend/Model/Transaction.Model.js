const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: String,
    image: String,
    category: String,
    sold: Boolean,
    dateOfSale: Date,
    month: String, //as getting month
  },
  {
    versionKey: "false",
  }
);

const TransactionModel = mongoose.model("transaction", transactionSchema);

module.exports = {
  TransactionModel,
};
