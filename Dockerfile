# Sử dụng Node.js làm image cơ sở
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng mặc định của Vite.js
EXPOSE 5173

# Lệnh mặc định để chạy ứng dụng
CMD ["npm", "run", "dev", "--", "--host"]

