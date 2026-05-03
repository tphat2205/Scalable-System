const validateProduct = (req, res, next) => {
    const { name, price } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ 
            error: 'Dữ liệu không hợp lệ: Tên sản phẩm phải là chuỗi và không được để trống.' 
        });
    }

    if (price === undefined || typeof price !== 'number' || price < 0) {
        return res.status(400).json({ 
            error: 'Dữ liệu không hợp lệ: Giá sản phẩm phải là số và lớn hơn hoặc bằng 0.' 
        });
    }
    req.body.name = name.trim();
    
    next();
};

module.exports = { validateProduct };   