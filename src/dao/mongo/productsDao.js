import productModel from "./models/product.model.js"

export default class productsDao {

    get = (params) => {
        return productModel.find(params).lean();
      };
   
    paginateProducts = async (params, paginateOptions) => {
        return productModel.paginate(params, paginateOptions);
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

    delete = async (id) => {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                { $set: { status: false } },
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
}