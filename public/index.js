const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public'));
// Sample in-memory data
let books = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho" }
];


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
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const { title, author } = req.body;
  book.title = title;
  book.author = author;
  res.json(book);
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
