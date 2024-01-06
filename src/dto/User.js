export default class UserDTO {
    static getTokenDTOFrom = (user) => {
        if (user.documents.length >= 5) {
            user.isPremium = true;
        } else {
            user.isPremium = false;
        }
        return {
            name: `${user.firstName} ${user.lastName}`,
            nombres: user.firstName,
            apellidos: user.lastName,
            email: user.email,
            id: user._id,
            role: user.role,
            cart: user.cart,
            isPremium: user.isPremium
        }
    }
    static getTokenDTOFromTerceros = (user) => {
        if (user.documents.length >= 5) {
            user.isPremium = true;
        } else {
            user.isPremium = false;
        }
        return {
            name: `${user.firstName} ${user.lastName}`,
            id: user._id,
            role: user.role,
            cart: user.cart,
            email: user.email,
            isPremium: user.isPremium
        }
    }
    static getTokenDTOadmin = (user) => {
        return {
            nombres: user.firstName,
            id: user._id,
            role: user.role,
        }
    }
    static getTokenDTOFromPremium = (user) => {        
        return {
            name: `${user.firstName} ${user.lastName}`,
            nombres: user.firstName,
            apellidos: user.lastName,
            email: user.email,
            id: user._id,
            role: user.role,
            cart: user.cart,
            isPremium: user.isPremium
        }
    }
}