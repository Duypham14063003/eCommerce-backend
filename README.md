# 🛒 eCommerce-backend

Hệ thống backend mạnh mẽ và bảo mật cho ứng dụng thương mại điện tử. Dự án này giúp quản lý sản phẩm, người dùng, giỏ hàng, đơn hàng và hàng tồn kho với các công nghệ hiện đại trong hệ sinh thái JavaScript.

---

## 🚀 Tính năng

- ✅ Thiết kế API RESTful sử dụng Express.js
- 🔐 Xác thực và phân quyền người dùng bằng JWT + bcrypt
- 📦 Quản lý sản phẩm, danh mục, hàng tồn kho
- 🛒 Xử lý giỏ hàng và đơn hàng
- 👨‍💼 Phân quyền vai trò người dùng (quản trị viên, người dùng thường)
- 📄 Hỗ trợ query, lọc, phân trang dữ liệu
- 📦 Upload hình ảnh sản phẩm (có thể tích hợp Cloudinary hoặc tương tự)
- 📘 Tài liệu API sử dụng Postman hoặc Swagger

---

## 🧱 Công nghệ sử dụng

- **Backend**: Node.js + Express
- **Cơ sở dữ liệu**: MongoDB (Mongoose)
- **Xác thực**: JWT + bcrypt
- **Khác**: dotenv, cors, morgan, nodemon

---

## 📂 Cấu trúc thư mục

├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ └── utils/
├── server.js
├── package.json
└── README.md

---

## ⚙️ Cách chạy dự án

```bash
# Cài đặt dependencies
npm install

# Tạo file .env và cấu hình các biến môi trường cần thiết
# Chạy server
npm start
```
