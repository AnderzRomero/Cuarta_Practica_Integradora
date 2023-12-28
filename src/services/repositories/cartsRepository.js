
export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getCarts = (params) => {
        return this.dao.get(params);
    }
    getCartBy = (cartId) => {
        return this.dao.getBy(cartId);
    }
    createCart = (products) => {
        return this.dao.create(products);
    }
    updateCart = (cartId, newproduct) => {
        return this.dao.update(cartId, newproduct);
    }
    updateProductQuantity = (cartId, updatedProducts) => {
        return this.dao.updateProductQuantity(cartId, updatedProducts);
    }
    deleteAllProductsInCart = (cartId, vaciarcart) => {
        return this.dao.deleteAllProductsInCart(cartId, vaciarcart);
    }
    removeProductFromCart = (cartId, productId) => {
        return this.dao.removeProductFromCart(cartId, productId);
    }
}