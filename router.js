
const express = require("express");
const router = express.Router(); // Expressni ichidsn routerni olib chiqdik
const memberController = require("./controllers/memberController")

// Router orqali turli xil routerlarni shakillantiramiz
// memberga dahldor routerlar
router.get("/", memberController.home);
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
 

// ROUTERLAR qaysi API bilan kelgan Addreesni qayerga borishini xal qiladi
// boshqa routerlar
router.get("/menu", (req, res) =>{
    res.send("Menu sahifadasiz");
})

router.get("/community", (req, res) =>{
    res.send("Jamiyat sahifadasiz")
})

module.exports = router  // Faylni export qildik