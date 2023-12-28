import PersistenceFactory from "../dao/PersistenceFactory.js";

import UsersRepository from "./repositories/usersRepository.js";
import CartsRepository from "./repositories/cartsRepository.js";
import ProductsRepository from "./repositories/productsRepository.js";
import MessageRepository from "./repositories/messagesRepository.js";
import TicketsRepository from "./repositories/ticketsRepository.js";

const {UsersDao, ProductsDao, CartsDao, MessagesDao, TicketsDao} = await PersistenceFactory.getPersistence();

export const usersService = new UsersRepository(new UsersDao());
export const cartsService = new CartsRepository(new CartsDao());
export const productsService = new ProductsRepository(new ProductsDao());
export const messageService = new MessageRepository(new MessagesDao());
export const ticketsService = new TicketsRepository(new TicketsDao());