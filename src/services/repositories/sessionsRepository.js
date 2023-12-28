export default class SessionsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUsers = (params) => {
        return this.dao.get(params);
    }
    getUser = (params) => {
        return this.dao.getBy(params);
    }
    createUser = (user) => {
        return this.dao.create(user);
    }
    updateUser = (id, user) => {
        return this.dao.update(id, user);
    }
    deleteUser = (id) => {
        return this.dao.delete(id);
    }
}