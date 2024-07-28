const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User_Routes = require('./routes/user.routes');
const Blog_Routes = require('./routes/blog.routes')

require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());
express.urlencoded({extended:true});

app.use('/api',User_Routes);
app.use('/api/blog',Blog_Routes);

app.use('/public',express.static('public'));

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

app.listen(process.env.PORT,()=>{
    console.log("Server running on ",process.env.PORT);
})