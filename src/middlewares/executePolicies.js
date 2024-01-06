const executePolicies = (policies) => {
    return (req, res, next) => {
        if (policies[0] === "PUBLIC") return next();
        if (policies[0] === "NO_AUTH" && !req.user) return next();
        if (policies[0] === "NO_AUTH" && req.user) return res.sendUnauthorized("Ya estas Autenticado");
        if (policies[0] === "AUTH" && req.user) return next();
        if (policies[0] === "AUTH" && !req.user) return res.sendUnauthorized('No se encuetra autenticado');
        if (!req.user) return res.sendUnauthorized('No se encuentra autenticado');
        if (!policies.includes(req.user.role.toUpperCase())) {
            return res.sendForbidden('No tiene acceso');
        }
        next();
    }
}

export default executePolicies;