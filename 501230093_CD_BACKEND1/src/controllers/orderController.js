// Trong hàm create hoặc getCreatePage
async function getCreatePage(req, res) {
    try {
        const products = await ProductModel.find({});
        console.log('Products from DB:', products); // Kiểm tra dữ liệu
        res.render('pages/orders/create', {
            products,
            mode: 'Create',
            err: null
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server Error');
    }
}