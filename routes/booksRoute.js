// import express from 'express';
// import { Book } from '../models/bookModel.js';

// const router = express.Router();



// router.post('/', async (request , response) => {
//     try{
//       if(!request.body.title ||
//         // !request.body.author ||
//         // !request.body.publishYear||
//         !request.body.statusshop

//     ){
//         return response.status(400).send({
//             message: 'send all required fields :title, status shop',
//         });
//     }  
//     const newBook ={
//         title: request.body.title,
//         // author: request.body.author,
//         // publishYear:request.body.publishYear,
//         statusshop:request.body.statusshop,
//     };

//     const book = await Book.create(newBook);

//     return response.status(201).send(book);

//     } catch(error){
//         console.log(error.message);
//         response.status(500).send({message : error.message});
//     }
// });



// router.get('/:id' , async (request , response)=>{
//     try{
//     const {id} = request.params;

//     const book = await Book.findById(id);
//     return response.status(200).json(book);
//     }catch (error){
//         console.log(error.message);
//         response.status(500).send({message: error.message});
    
//     }
    
//     });
    


// router.get('/' , async (request , response)=>{
// try{
// const books = await Book.find({});
// return response.status(201).json({
//     count: books.length ,
//     data: books

// });
// }catch (error){
//     console.log(error.message);
//     response.status(500).send({message: error.message});

// }

// });

// router.put('/:id' , async (request , response)=>{
//     try{
//         if(!request.body.title ||
//             // !request.body.author ||
//             // !request.body.publishYear
//             !request.body.statusshop
//         ){
//             return response.status(400).send({
//                 message: 'send all required fields :title, author, publishYear',
//             });
//     }
//     const {id} = request.params;
//     const result = await Book.findByIdAndUpdate(id,request.body);
//     if (!result){
//         return response.status(404).json({message : 'book not found'});
//     }
//     return response.status(200).send({message: 'book updated successfully'});
// }catch (error){
//     console.log(error.message);
//     response.status(500).send({message: error.message})
// }
// });


// router.delete('/:id' , async (request , response)=>{
//     try{
//         const {id} = request.params;
//         const result = await Book.findByIdAndDelete(id);
//       if(!result){
//         return response.status(404).json({message: 'book not found'})
//       }
//       return response.status(200).send({message: 'book deleted successfully'});
//     }
//     catch (error){
//     console.log(error.message);
//     response.status(500).send({message: error.message})
// }
// });

// export default router;

import express from 'express';
import { authenticateUser } from '../authMiddleware.js'; // Import the authentication middleware
import { Book } from '../models/bookModel.js';

const router = express.Router();

// Add a new book
router.post('/', authenticateUser, async (request, response) => {
  try {
    if (!request.body.title || !request.body.statusshop) {
      return response.status(400).send({
        message: 'send all required fields: title, statusshop',
      });
    }

    const newBook = {
      title: request.body.title,
      statusshop: request.body.statusshop,
      ownerId: request.user.uid, // Associate the book with the logged-in user's ID
    };

    const book = await Book.create(newBook);
    return response.status(201).send(book);

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get a specific book by ID
router.get('/:id', authenticateUser, async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);
    if (!book) {
      return response.status(404).json({ message: 'Book not found' });
    }

    // Check if the logged-in user owns the book
    if (book.ownerId !== request.user.uid) {
      return response.status(403).json({ message: 'Permission denied: Not the owner' });
    }

    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get all books
router.get('/', authenticateUser, async (request, response) => {
  try {
    const books = await Book.find({ ownerId: request.user.uid }); // Fetch only books owned by the logged-in user
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Update a book by ID
router.put('/:id', authenticateUser, async (request, response) => {
  try {
    const { id } = request.params;

    if (!request.body.title || !request.body.statusshop) {
      return response.status(400).send({
        message: 'send all required fields: title, statusshop',
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return response.status(404).json({ message: 'Book not found' });
    }

    // Check if the logged-in user owns the book
    if (book.ownerId !== request.user.uid) {
      return response.status(403).json({ message: 'Permission denied: Not the owner' });
    }

    // Update the book
    book.title = request.body.title;
    book.statusshop = request.body.statusshop;
    await book.save();

    return response.status(200).send({ message: 'Book updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete a book by ID
router.delete('/:id', authenticateUser, async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);
    if (!book) {
      return response.status(404).json({ message: 'Book not found' });
    }

    // Check if the logged-in user owns the book
    if (book.ownerId !== request.user.uid) {
      return response.status(403).json({ message: 'Permission denied: Not the owner' });
    }

    await Book.findByIdAndDelete(id);
    return response.status(200).send({ message: 'Book deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
