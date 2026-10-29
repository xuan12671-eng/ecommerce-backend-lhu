require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// 1. Khai báo các Routes mới của Tuần 07
const paymentRoutes = require("./routes/paymentRoutes");
const aiRoutes = require("./routes/aiRoutes");
const shippingRoutes = require("./routes/shippingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối CSDL MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route kiểm tra trạng thái Server
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Hệ thống Quản lý Đơn hàng hoạt động ổn định!",
  });
});

// Đăng ký các routes chính
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 2. Đăng ký các Endpoint API mới vào Express App (PHẢI NẰM TRƯỚC MIDDLEWARE 404)
app.use("/api/payment", paymentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/shipping", shippingRoutes);

// Xử lý Route không tồn tại (404) - LUÔN ĐẶT Ở CUỐI CÙNG
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Đường dẫn [${req.method}] ${req.originalUrl} không tồn tại!`,
  });
});

app.listen(PORT, () => {
  console.log("====================================================");
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log("====================================================");
});
