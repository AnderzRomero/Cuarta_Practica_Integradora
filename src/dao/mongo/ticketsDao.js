import ticketModel from "./models/tickets.model.js"

export default class ticketsDao {
    get = (params) => {
        return ticketModel.find(params).lean();
    }

    getBy = (params) => {
        return ticketModel.findOne(params).lean();
    }

    create = async (ticket) => {
        return ticketModel.create(ticket);
    }

    update = (id, ticket) => {
        return ticketModel.updateOne({ _id: id }, { $set: ticket });
    }

    delete = (id) => {
        return ticketModel.updateOne({ _id: id });
    }





}