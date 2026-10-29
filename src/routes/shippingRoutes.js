const express = require("express");
const router = express.Router();
const { calculateShipping } = require("../controllers/shippingController");

router.post("/calculate", calculateShipping);

module.exports = router;
