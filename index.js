const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Sample data with at lease three different categories
let books = [
  { id: 1, title: "first book", author: "Saliou gueye" },
  { id: 2, title: "second book", author: "Saliou gueye" },
  { id: 3, title: "third boo", author: "Saliou gueye" },
];
// app.get('/index.html',(req,res)=>{
//     res.send(index.html);
// });
app.use(express.static("public"));
// GET all books
app.get("/books", (req, res) => {
  res.json(books);
});

// GET a single book by ID
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// POST a new book
app.post("/books", (req, res) => {
  const { title, author } = req.body;
  const newBook = {
    id: books.length + 1,
    title,
    author,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT to update a book
app.put("/books/:id", (req, res, next) => {
  try {
    const book = books.find((b) => b.id === req.params.id);
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
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted", book: deleted[0] });
});
// this is my filter part
// i decide to choice a stardard methode filtering by the name of the author
app.get("/books", (req, res) => {
  const { author, genre } = req.query;

  let filteredBooks = books;

  if (author) {
    filteredBooks = filteredBooks.filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );
  }

  if (genre) {
    filteredBooks = filteredBooks.filter(
      (book) => book.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  res.json(filteredBooks);
});
// Start the server
app.listen(PORT, () => {
  console.log(`📚 Book API running http://localhost:${PORT}`);
});
