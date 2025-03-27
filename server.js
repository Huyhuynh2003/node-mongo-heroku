const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const app = express();
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((err) => {
    console.error("❌ Lỗi MongoDB:", err);
    process.exit(1); // Dừng server nếu kết nối MongoDB thất bại
  });

// Route chính (fix lỗi "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🔥 Server đang chạy! Truy cập /products để xem danh sách sản phẩm.");
});

// API: Thêm sản phẩm
app.post("/products", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = new Product({ name, price, description });
    await newProduct.save();
    res.status(201).json({ message: "Sản phẩm đã được thêm!", product: newProduct });
  } catch (error) {
    console.error("🔥 Lỗi khi thêm sản phẩm:", error);
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
    console.error("🔥 Lỗi khi tìm kiếm sản phẩm:", error);
    res.status(500).json({ error: "Lỗi khi tìm kiếm sản phẩm!" });
  }
});

// Middleware xử lý lỗi
app.use((req, res, next) => {
  res.status(404).json({ error: "Không tìm thấy đường dẫn này!" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Lỗi server:", err);
  res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại sau!" });
});

// Lắng nghe server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server đang chạy trên cổng ${PORT}`));
