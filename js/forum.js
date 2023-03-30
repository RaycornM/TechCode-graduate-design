const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const posts = [
  { title: '帖子标题1', author: '用户名1', date: '2023-03-30' },
  { title: '帖子标题2', author: '用户名2', date: '2023-03-29' },
  { title: '帖子标题3', author: '用户名3', date: '2023-03-28' },
];

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/new-post', (req, res) => {
  const { title, author, date } = req.body;
  posts.unshift({ title, author, date });
  res.status(201).json({ message: '帖子已创建' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
