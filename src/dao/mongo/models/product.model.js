import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ['Accesorios Externos', 'Cajas', 'Combos Cajas con Fuentes', 'Combos Perifericos', 'Diademas', 'Mouse', 'Micro SD', 'Memorias RAM', 'Fuentes', 'Monitores', 'Pad Mouse', 'Portatiles Gamer', 'Parlantes', 'Placas Madre', 'Redes', 'Refigeraciones', 'Reguladores y Ups', 'Teclados', 'Tarjetas Graficas', 'Streaming', 'Sillas', 'Unidades Disco Mecanico', 'Unidades SSD'],
            required: true,
            index: true
        },
        code: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        stock: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            index: true
        },
        thumbnail: {
            type: Array,
            default: []
        },
        available: {
            type: Boolean,
            default: true,
            index: true
        },
        owner: {    
            type: String,        
            ref: "users",
            default: "admin",
        },
    },
    { timestamps: true }
);

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema);

export default productModel;

