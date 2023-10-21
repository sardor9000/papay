let productController = module.exports;


productController.getAllProducts = async (req, res) => {
    try{
        console.log("GET: cont/getAllProducts");

    }catch(err){
        console.log(`ERROR, cont/getAllProducts, ${err.message}`);
        res.json({state: "fail", message: err.message})
    }
};


productController.addNewPoduct = async (req, res) => {
    try{
        console.log("POST: cont/addNewPoduct");
        // TODO: Product creation develop

        res.send('ok')
    }catch(err){
        console.log(`ERROR, cont/addNewPoduct, ${err.message}`);
    }
};


productController.updateChosenProducts = async (req, res) => {
    try{
        console.log("POST: cont/updateChosenProducts");

    }catch(err){
        console.log(`ERROR, cont/updateChosenProducts, ${err.message}`);
    }
};
 