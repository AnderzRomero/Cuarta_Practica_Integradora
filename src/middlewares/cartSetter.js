import { cartsService } from "../services/index.js";

const cartSetter = async (req, res, next) => {
    if (!req.cookies.cart && !req.user) {
        const cart = await cartsService.createCart();
        res.cookie('cart', cart._id.toString())
    }
    next();
}

export default cartSetter;