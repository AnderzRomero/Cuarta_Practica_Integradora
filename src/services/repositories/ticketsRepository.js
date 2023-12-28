export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getTickets = (params) => {
        return this.dao.get(params);
    };

    getTicketsBy = (params) => {
        return this.dao.getBy(params);
    };

    createTicket = (ticket) => {
        return this.dao.create(ticket);
    };

    updateTicket = (id, ticket) => {
        return this, dao.update(id, ticket);
    };

    deleteTicket = (id) => {
        return this, dao.delete(id);
    };
}