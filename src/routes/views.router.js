import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

//Ruta que trae los productos paginados

router.get("/products",  async (req,res) => {

 const {page = 1 , limit = 1} = req.query;
 const result = await ProductModel.paginate({},{page,limit,lean:true})

    res.render("products", {
        products:result.docs,
        hasPrevPage:result.hasPrevPage,
        hasNextPage:result.hasNextPage,
        prevPage:result.prevPage,
        nextPage:result.nextPage,
        page:result.page,
        totalPages:result.totalPages
    })
})

//Ruta que filtra el producto y muestra el detalle del mismo

router.get("/products/:pid", async (req,res) => {
    const {pid} = req.params;
    const product = await ProductModel.findById(pid);
    console.log(product.thumbnails[0]);
    
    
    res.render("productDetail",{product});
    
})

export default router;
