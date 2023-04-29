const { URL } = process.env;


function connectDb(){

    
//Database connection
const mongoose = require('mongoose');
// const url ='mongodb+srv://Sagarmak:sagarmak123@cluster0.o0rkibo.mongodb.net/comment?retryWrites=true'
// const url ='mongodb+srv://Sagarmak:sagarmak123@cluster0.o0rkibo.mongodb.net/comment'

mongoose.connect(URL,{
    useNewUrlParser: true,

    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

}

module.exports = connectDb;