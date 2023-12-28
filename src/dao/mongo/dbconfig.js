import mongoose from "mongoose";
import config from "../../config/config.js";

// con esta linea se encrypta las credenciales de la base de datos 
const URL = `mongodb+srv://${config.mongo.USER}:${config.mongo.PASSWORD}@cluster0.9vhlkqi.mongodb.net/${config.mongo.DBNAME}?retryWrites=true&w=majority`;

await mongoose.connect(URL, {serverSelectionTimeoutMS: 3000, })
    .then(() => console.log("Base de datos conectada con exito"))
    .catch(e => console.log(e));