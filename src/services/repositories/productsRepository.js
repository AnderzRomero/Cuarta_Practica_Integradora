export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = (params) => {
        return this.dao.get(params);
    }

    paginateProducts = (params, paginateOptions) => {
        return this.dao.paginateProducts(params, paginateOptions);
    }

    getProductBy = (params) => {
        return this.dao.getBy(params);
    }

    createProduct = (product) => {
        return this.dao.create(product);
    }

    updateProduct = (id, product) => {
        return this.dao.update(id, product);
    }

    updateProductStatusInactive = (id) => {
        return this.dao.updateStatusInactive(id);
    }

    updateProductStatusActive = (id) => {
        return this.dao.updateStatusActive(id);
    }

    deleteProduct = (id) => {
        return this.dao.delete(id);
    }
}

