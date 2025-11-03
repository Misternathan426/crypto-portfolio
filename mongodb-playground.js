// MongoDB Playground for Crypto Portfolio
// Use Ctrl+Shift+P and run "MongoDB: Connect" first

// Switch to your database
use('crypto-portfolio');

// 1. View all portfolio items
db.portfolios.find({});

// 2. Count total portfolio items
db.portfolios.countDocuments({});

// 3. Find portfolio items by symbol (example: BTC)
db.portfolios.find({ symbol: "BTC" });

// 4. Get portfolio sorted by amount (highest first)
db.portfolios.find({}).sort({ amount: -1 });

// 5. Calculate total portfolio value (aggregation)
db.portfolios.aggregate([
  {
    $addFields: {
      totalValue: { $multiply: ["$amount", "$price"] }
    }
  },
  {
    $group: {
      _id: null,
      totalPortfolioValue: { $sum: "$totalValue" },
      totalItems: { $sum: 1 },
      averageValue: { $avg: "$totalValue" }
    }
  }
]);

// 6. Get portfolio distribution by symbol
db.portfolios.aggregate([
  {
    $group: {
      _id: "$symbol",
      totalAmount: { $sum: "$amount" },
      avgPrice: { $avg: "$price" },
      totalValue: { $sum: { $multiply: ["$amount", "$price"] } }
    }
  },
  { $sort: { totalValue: -1 } }
]);

// 7. Insert a new portfolio item (example)
/*
db.portfolios.insertOne({
  symbol: "ETH",
  amount: 2.5,
  price: 2000,
  createdAt: new Date(),
  updatedAt: new Date()
});
*/

// 8. Update portfolio item price
/*
db.portfolios.updateOne(
  { symbol: "BTC" },
  { 
    $set: { 
      price: 50000,
      updatedAt: new Date()
    }
  }
);
*/

// 9. Delete portfolio item by symbol
/*
db.portfolios.deleteOne({ symbol: "DOGE" });
*/

// 10. Advanced: Find top 3 most valuable holdings
db.portfolios.aggregate([
  {
    $addFields: {
      totalValue: { $multiply: ["$amount", "$price"] }
    }
  },
  { $sort: { totalValue: -1 } },
  { $limit: 3 },
  {
    $project: {
      symbol: 1,
      amount: 1,
      price: 1,
      totalValue: 1,
      _id: 0
    }
  }
]);