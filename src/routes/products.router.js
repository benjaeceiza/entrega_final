import { Router } from "express";
import { ProductModel } from "../models/product.model.js";

const router = Router();

//  Ruta que trae los productos paginados

router.get("/products",  async (req,res) => {

 const {page = 1 , limit=10, sort, category} = req.query;
 const result = await ProductModel.paginate({},{page,limit,lean:true})

 //  Filtramos por categoria si es que existe
 if(category){
    result.docs = result.docs.filter(product => product.category == category);
 }
 

//  Ordenamos de manera ascendente o descendente si es que ingrean un sort
 
     if(sort == "asc"){
        
         result.docs.sort((a, b) => (a.price > b.price ? 1 : a.price < b.price ? -1 : 0))
     }
    
     if(sort == "desc"){
        
          result.docs.sort((a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0))
     }
    
 //Renderizamos la vista products y mandamos los productos y los valores de las paginas
    res.render("products", {
        products:result.docs,
        hasPrevPage:result.hasPrevPage,
        hasNextPage:result.hasNextPage,
        prevPage:result.prevPage,
        nextPage:result.nextPage,
        page:result.page,
        totalPages:result.totalPages,
        limit:limit,
        sort:sort
    })
})

//Ruta que filtra el producto y muestra el detalle del mismo

router.get("/products/:pid", async (req,res) => {
    const {pid} = req.params;
    const productMongo = await ProductModel.findById(pid);
    const product = productMongo.toObject();


    
    
    res.render("productDetail",{product});
    
})

export default router;
