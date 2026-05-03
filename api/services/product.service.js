const { masterPool, slavePool } = require('../config/db');

const createProduct = async (name, price) => {
    console.log(`[MASTER] Bắt đầu xử lý yêu cầu thêm sản phẩm: ${name}`);
    const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
    
    const [result] = await masterPool.execute(query, [name, price]);
    console.log(`[MASTER] Ghi thành công. Product ID: ${result.insertId}`);
    
    return {
        id: result.insertId,
        name,
        price
    };
};

const getProducts = async () => {
    const query = 'SELECT * FROM products ORDER BY id DESC';

    try {
        console.log(`[SLAVE] Đang thử truy xuất dữ liệu...`);
        const [rows] = await slavePool.execute(query);
        
        console.log(`[SLAVE] Đọc dữ liệu thành công.`);
        return { data: rows, source: 'SLAVE_DB' };

    } catch (slaveErr) {
        console.warn(`[SLAVE] Gặp sự cố kết nối/truy vấn: ${slaveErr.message}`);
        console.log(`[FALLBACK] Đang chuyển hướng đọc dữ liệu sang Master DB...`);
        
        // Fallback sang Master
        const [rows] = await masterPool.execute(query);
        console.log(`[FALLBACK] Đọc dữ liệu từ Master thành công.`);
        
        return { data: rows, source: 'MASTER_DB_FALLBACK' };
    }
};

module.exports = {
    createProduct,
    getProducts
};