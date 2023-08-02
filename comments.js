// Create web server
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const comments = require('./comments.json');
const fs = require('fs');
const path = require('path');

// Use cors
app.use(cors());

// Use body-parser
app.use(bodyParser.json());

// Use express.static
app.use(express.static(path.join(__dirname, 'public')));

// GET /comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// POST /comments
app.post('/comments', (req, res) => {
  const newComment = {
    id: Date.now(),
    ...req.body
  };

  comments.push(newComment);

  fs.writeFile('./comments.json', JSON.stringify(comments), err => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      res.json(newComment);
    }
  });
});

// DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  const index = comments.findIndex(comment => comment.id === id);

  if (index !== -1) {
    comments.splice(index, 1);

    fs.writeFile('./comments.json', JSON.stringify(comments), err => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.sendStatus(204);
      }
    });
  } else {
    res.status(404).json({ message: 'Comment not found' });
  }
});

// Start web server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});