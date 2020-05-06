import express from 'express'
import dotenv from 'dotenv'
import errorHandler from "./utilities/errorHandler"
import mongoose from 'mongoose'
import routes from './routes'
import bodyparser from 'body-parser'




dotenv.config()



const app = express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));


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
});

require('./config/passport')


//Routes
app.use(routes)


//ErrorHandler
errorHandler(app);

app.listen(process.env.PORT, () => {
    console.log(`app started at ${ process.env.PORT }`);
});









