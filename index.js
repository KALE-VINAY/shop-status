import express from "express";
import { PORT , mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
import booksRoute from './routes/booksRoute.js'
import cors from 'cors';
import shopRoutes from "./routes/shopRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors());

// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET','POST','PUT','DELETE'],
//     allowedHeaders: ['Content-Type'],

// }));


app.get('/', (request , response) => {
    console.log(request);

    return response.status(234).send('welcome to book project');

});

app.use('/books', booksRoute);
// app.use("/api/shops", shopRoutes);

mongoose
.connect(mongoDBURL)
.then(()=>{
     console.log('app is connected to database');
     app.listen( PORT, () => {
        console.log(`app is listening to port : ${PORT}`);
    });
})
.catch((error)=>{
console.log(error);

});