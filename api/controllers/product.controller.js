const productService = require('../services/product.service');

const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        
        const createdProduct = await productService.createProduct(name, price);
        
        res.status(201).json({
            message: 'Tạo sản phẩm thành công',
            data: createdProduct,
            processed_by: process.env.NODE_ID
        });
    } catch (err) {
        console.error(`[CONTROLLER] Lỗi khi ghi dữ liệu:`, err.message);
        res.status(500).json({ error: 'Lỗi server khi ghi dữ liệu' });
    }
};

const getProducts = async (req, res) => {
    try {
        const result = await productService.getProducts();
        
        res.status(200).json({
            data: result.data,
            source: result.source,
            processed_by: process.env.NODE_ID
        });
    } catch (err) {
        console.error(`[FATAL ERROR] Cả Slave và Master đều lỗi:`, err.message);
        res.status(500).json({ 
            error: 'Hệ thống database đang tạm thời gián đoạn. Vui lòng thử lại sau.' 
        });
    }
};

module.exports = {
    createProduct,
    getProducts
};