const express  =  require("express");
const {check} = require("express-validator");
const placeRoutes = require("../controlers/place-cont");
const fileUpload = require("../util/middleware/file-Upload.js");
const checkAuth = require("../util/middleware/check-auth");
const router = express.Router();

router.get("/:pid",placeRoutes.getPlaceById)

router.get("/user/:uid",placeRoutes.getPlacesByUserId)

router.use(checkAuth);
router.post("/",fileUpload.single("image"),[ 
    check("title").not().isEmpty(), 
    check("description").isLength({min:5}),
    check("address").not().isEmpty()
    ],
placeRoutes.createPlace)

router.patch("/:pid",[ 
    check("title").not().isEmpty(),
    check("description").isLength({min:6})
],placeRoutes.updatePlace)

router.delete("/:pid",placeRoutes.deletePlace)

module.exports =router;