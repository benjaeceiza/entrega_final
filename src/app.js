import express from "express";
import mongoose from "mongoose";
import dontenv from "dotenv"
import { engine } from "express-handlebars";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

//Configuracion para las variables de entorno
dontenv.config();

//Configuracion de express
const app = express();
app.use(express.json());

//Configuracion handlebars
app.engine("handlebars",engine());
app.set("view engine","handlebars");
app.set("views",path.resolve("./src/views"))


//Coneccion a la base de datos
mongoose.connect(process.env.MONGO_URI,{dbName:"Ecommerce"})
.then( () => console.log("Conectado a la base de datos"))
.catch( (err) => console.log("Error al conectarse a la base de datos",err))



//Rutas de los productos
app.use("/",productsRouter);

//Rutas de los carritos
app.use("/api/carts",cartsRouter)
app.use("/api/carts/:cid",cartsRouter)
app.use("/api/carts/:cid/products/:pid",cartsRouter)

//Damos de alta al servidor
app.listen(8080,() => {
   console.log("Servidor corriendo en el puerto 8080");
});