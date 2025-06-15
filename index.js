const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample data with at lease three different categories
let books = [
  { id: 1, title: "My first book", author: "Saliou" },
  { id: 2, title: "my second book", author: "Saliou Gueye" }
];
// app.get('/index.html',(req,res)=>{
//     res.send(index.html);
// });
app.use(express.static('public'));
// GET all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET a single book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// POST a new book
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  const newBook = {
    id: books.length + 1,
    title,
    author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT to update a book
app.put('/books/:id', (req, res, next) => {
  try {
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      throw error;
    }

    const { title, author } = req.body;
    if (!title || !author) {
      const error = new Error("Title and author are required");
      error.status = 400;
      throw error;
    }

    book.title = title;
    book.author = author;

    res.json(book);
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
});

// DELETE a book
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted", book: deleted[0] });
});

// Start the server
app.listen(PORT, () => {
  console.log(`📚 Book API running at http://localhost:${PORT}`);
});
