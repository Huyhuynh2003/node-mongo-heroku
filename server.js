const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => console.log("✅ Kết nối MongoDB thành công!"));
mongoose.connection.on("error", (err) => console.error("❌ Lỗi MongoDB:", err));

// API: Thêm sản phẩm
app.post("/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.status(201).json({ message: "Sản phẩm đã được thêm!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi thêm sản phẩm!" });
  }
});

// API: Tìm kiếm sản phẩm theo tên
app.get("/products", async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find(name ? { name: new RegExp(name, "i") } : {});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi tìm kiếm sản phẩm!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy trên cổng ${PORT}`));
