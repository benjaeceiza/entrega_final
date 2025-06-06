import { Router } from "express";
import { CartModel } from "../models/cart.model.js";
const router = Router();
import "../models/product.model.js"



//GET


// Ruta que trae un cart en especifico con sus productos
router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const cartMongo = await CartModel.findById(cid).populate("products.product");;
    const cart = cartMongo.toObject()

    res.render("carts", { cart })


})


//Ruta que crea un nuevo cart vacion
router.post("/", async (req, res) => {

    const cart = {
        products: [],
        total: 0
    }

    try {
        await CartModel.insertOne(cart);
        res.json({ message: "Carrito creado con exito!" })

    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message })
    }
})


//POST


//Ruta que agrega un producto a un carrito en especifico
router.post("/:cid/products/:pid", async (req, res) => {

    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);

    //Verificamos si el id que ingreso es valido
    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" })
    }
    //Verificamos si el producto ya existe dentro del carrtio
    const existingProduct = cart.products.find(p => p.product.toString() === pid);

    //Si existe aumentamos en 1 el quantity   
    if (existingProduct) {
        existingProduct.quantity++

    } else {
        //Si no existe lo agregamos al carrito
        cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    //Mostramos como queda el carrito
    const CartWhitproducts = await CartModel.findById(cid).populate("products.product");
    res.json(CartWhitproducts)
})


//PUT

//	Ruta que reemplaza el contenido completo del carrito con un arreglo nuevo de productos desde el body
router.put("/:cid", async (req,res) => {
     const { cid } = req.params;
     const cart = await CartModel.findById(cid);
     const newArrayProducts = req.body;

     //Verificamos si existe el carrito
    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado"})
    }

   cart.products = newArrayProducts;
   await cart.save();

    const CartWhitNewProducts = await CartModel.findById(cid).populate("products.product");
    res.json(CartWhitNewProducts)
    
})


//Ruta que 	actualiza la cantidad de un producto en el carrito desde el body
router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    
    const newQuantity = req.body;


    //Verificamos si existe el carrito
    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado"})
    }

    //Verificamos si existe el producto dentro del carrito  
    const existingProduct = cart.products.find(p => p.product.toString() === pid)

    if (!existingProduct) {
        return res.status(404).json({ message: "Este carrito no contiene el producto solicitado" })
    }

    //Si existe modificamos la cantidad del producto por el valor pasado por body 
    existingProduct.quantity = newQuantity.quantity;
    await cart.save();

    //Mostramos el resultado del carrito
    const CartWhitNewQuantity = await CartModel.findById(cid).populate("products.product");
    res.json(CartWhitNewQuantity)

})


//DELETE

//Ruta que elimina un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);



    //Verificamos si existe el carrito
    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado"})
    }

    //Verificamos si existe el producto dentro del carrito  
    const existingProduct = cart.products.find(p => p.product.toString() === pid)

    if (!existingProduct) {
        return res.status(404).json({ message: "Este carrito no contiene el producto solicitado" })
    }

    //Filtramos el producto a eliminar
    cart.products = cart.products.filter(p => p.product.toString() != pid)

    await cart.save()

    //Mostramos el carrito resultante
    res.json({ message: "Producto eliminado correctamente", carrito: cart.products })
})


//Ruta que vacia un carrito en especifico
router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid);

    //Verificamos si existe el carrito
    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado"})
    }
   
    //Vaciamos el carrito
    cart.products = [];
    await cart.save()

    //Mostramos el resultado
    res.json({ message: "Carrito vaciado correctamente", carrito: cart.products })
})

export default router;