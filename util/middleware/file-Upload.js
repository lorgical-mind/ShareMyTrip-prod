const multer = require("multer");
const { uuid } = require("uuidv4");

const extentions = {
    "image/png":"png",
    "image/jpg":"jpg",
    "image/jpeg":"jpeg"
};

const fileUpload = multer({
    limits:500000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"uploads/photos");
        },
        filename:(req,file,cb)=>{
            const ext = extentions[file.mimetype];
            cb(null,uuid() + "."+ext)
        }
    }),
    fileFilter:(req,file,cb)=>{
        const isValid = !!extentions[file.mimetype];
        const error = isValid? null :new Error("Invalid mime type");
        cb(error,isValid)
    }
});

module.exports = fileUpload;    