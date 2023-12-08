
const express = require("express");
const router = express.Router(); // Expressni ichidsn routerni olib chiqdik
const memberController = require("./controllers/memberController")
const productController = require("./controllers/productController")
const restaurantController = require("./controllers/restaurantController")
const orderController = require("./controllers/orderController")


/* *************************
*            REST API       *
****************************/
// Router orqali turli xil routerlarni shakillantiramiz
// member related routers
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
    "/member/:id",
    memberController.retrieveAuthMember,
    memberController.getChosenMember
);
 

// ROUTERLAR qaysi API bilan kelgan Addreesni qayerga borishini xal qiladi
// Product related routers
router.post(
    "/products",
    memberController.retrieveAuthMember,
    productController.getAllProducts
);

router.get(
    "/products/:id",
    memberController.retrieveAuthMember,
    productController.getChosenProduct
);
    
// Restaurant related routers
router.get(
    "/restaurants",
    memberController.retrieveAuthMember,
    restaurantController.getRestaurants
);

router.get(
    "/restaurants/:id",
    memberController.retrieveAuthMember,
    restaurantController.getChosenRestaurant
);


// Order related routers
router.post(
    "/orders/create",
    memberController.retrieveAuthMember,
    orderController.createOrder
);

module.exports = router  // Faylni export qildik