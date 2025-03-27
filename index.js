// Import thư viện
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load biến môi trường từ .env
dotenv.config();

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Định nghĩa Schema và Model
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
});
const Product = mongoose.model("Product", ProductSchema);

// API thêm sản phẩm
app.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

// API tìm kiếm sản phẩm
app.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find({ name: new RegExp(name, "i") });
    res.send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
