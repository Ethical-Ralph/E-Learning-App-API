const express = require('express');
const dotenv = require('dotenv');
const errorHandler = require('./src/utilities/errorHandler');
const mongoose = require('mongoose');
const routes = require('./');
const bodyparser = require('body-parser');




dotenv.config()



const app = express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}))


//connect to mongodb using mongoosejs
mongoose.connect(process.env.MONGOCONNECTIONURI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(data => {
    console.log('connected to database')
}).catch(err => console.log(err));

mongoose.connection.once('open', () => {
    console.log('mongodb connected')
})

require('./src/config/passport')


//Routes
app.use(routes)


//ErrorHandler
errorHandler(app);

app.listen(process.env.PORT, () => {
    console.log(`app started at ${ process.env.PORT }`);
});









