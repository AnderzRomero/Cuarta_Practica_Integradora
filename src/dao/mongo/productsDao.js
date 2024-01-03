import productModel from "./models/product.model.js"

export default class productsDao {

    get = (params) => {
        return productModel.find(params).lean();
    };

    paginateProducts = async (params, paginateOptions) => {
        const { available, ...otherParams } = params;  
        // Construir el objeto de consulta, incluyendo el filtro de estado si está presente
        const query = { ...otherParams, available: true };
        if (params.available !== undefined) {
            query.available = params.available;
        }        
        return productModel.paginate(query, paginateOptions);
    }

    getBy = (params) => {
        return productModel.findOne(params).lean();
    }

    create = (product) => {
        return productModel.create(product);
    }

    update = (id, product) => {
        return productModel.updateOne({ _id: id }, { $set: product });
    }

    updateStatusInactive = async (id) => {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                { $set: { available: false } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error(`No se encontró el producto con ID ${id}`);
            }

            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }
    updateStatusActive = async (id) => {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                { $set: { available: true } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error(`No se encontró el producto con ID ${id}`);
            }

            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }

    delete = (id) => {
        return productModel.deleteOne({ _id: id });
    }
}