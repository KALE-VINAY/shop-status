import mongoose from "mongoose";

const bookSchema = mongoose.Schema(

    {
        title: {
            type: String,
            required: true,
        },
        imgUrl: {
            type: String,
            required: true,
        },
        // publishYear: {
        //     type: Number,
        //     required: true,
        // },
        statusshop : {
            type: String,
            required: true,
            // default: "closed"
        },
        
    },
    {
        timestamps:true,
    }

);


export const Book = mongoose.model('book', bookSchema);


