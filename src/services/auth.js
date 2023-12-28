import bcrypt from 'bcrypt';

const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts);
}

const validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

const cookieExtractor = (req) => {
    let token = null;
    if (req.cookies) {
        token = req.cookies['authCookie']
    }
    return token;
}

export default {
    createHash,
    validatePassword,
    cookieExtractor
}