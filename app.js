const fs = require("fs");
const express =  require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error")  
const mongoose = require("mongoose");

const routes = require("./routes/places-routes")
const UserRoutes = require("./routes/users-routes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use(bodyParser.json())

app.use("/uploads/photos",express.static(path.join('uploads','photos')));

app.use("/api/places",routes)
app.use("/api/users",UserRoutes)

app.use((error,req, res, next) => {
    const err = new HttpError('Could not find this route.', 404);
    return next(error);
  });
  
  app.use((error, req, res, next) => {
    if(req.file){
      fs.unlink(req.file.path, err =>{
        console.log(err)
      });

    }
    if (res.headerSent) {
      return next(error);
    }
    
    res.status(500).json({ message: error.message || 'An unknown error occurred!' });
  });
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nvao0js.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,{
useNewUrlParser: true,
useUnifiedTopology: true
}
)
.then(()=>{
app.listen(PORT , ()=>{
  console.log(`your app is running on port ${PORT}`)
});
console.log(`your app is running on port ${PORT}`)
})
.catch((err)=>{
    console.log(err);
})
