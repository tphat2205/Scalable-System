require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product.routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/products', productRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`[${process.env.NODE_ID || 'Node'}] Server đang chạy tại http://localhost:${port}`);
    console.log(`- Master DB port: ${process.env.DB_MASTER_PORT}`);
    console.log(`- Slave DB port: ${process.env.DB_SLAVE_PORT}`);
});