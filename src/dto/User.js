export default class UserDTO {
    static getTokenDTOFrom = (user) => {
        return {
            name: `${user.firstName} ${user.lastName}`,
            nombres: user.firstName,
            apellidos: user.lastName,
            email: user.email,
            id: user._id,
            role: user.role,
            cart: user.cart
        }
    }
    static getTokenDTOFromTerceros = (user) => {
        return {
            name: `${user.firstName} ${user.lastName}`,
            id: user._id,
            role: user.role,
            cart: user.cart,
            email: user.em
        }
    }
}