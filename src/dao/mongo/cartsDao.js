import cartModel from "./models/cart.model.js"

export default class cartDao {
  get = (params) => {
    return cartModel.find(params).lean();
  }

  getBy = async (cartId) => {
    try {
      const cart = await cartModel.findById(cartId).lean();

      if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);


      return cart;
    } catch (error) {
      throw error;
    }
  }

  create = async (products) => {
    try {
      let cartData = {};
      if (products && products.length > 0) {
        cartData.products = products;
      }

      const cart = await cartModel.create(cartData);
      return cart;
    } catch (err) {
      console.error("Error al crear el carrito:", err.message);
      return err;
    }
  }

  update = async (cartId, newProducts) => {
    return cartModel.updateOne({_id: cartId}, {$set: newProducts});
  };

  updateProductQuantity = async (cartId, updatedProducts) => {
    try {
      // Encuentra el carrito por su ID
      const cart = await cartModel.findById(cartId);

      if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);

      // Actualiza la lista de productos del carrito
      cart.products = updatedProducts;

      // Guarda los cambios en el carrito
      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

  deleteAllProductsInCart = async (cartId, vaciarcart) => {
    return cartModel.updateOne({ _id: cartId }, { $set: vaciarcart });
  };

  removeProductFromCart = async (cartId, productId) => {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) throw new Error(`No se encontró el carrito con ID ${cartId}`);

      cart.products = cart.products.filter((product) =>
        product._id._id.toString() !== productId
      );

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }

}