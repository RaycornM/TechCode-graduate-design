const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const dayjs = require('dayjs');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hz13316362896dym',
  database: 'db_techcode'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'TechCode-graduate-design')));
// 路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/forum', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'forum.html'));
});

app.get('/post', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'post.html'));
});

app.get('/compare', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'compare.html'));
});

app.get('/evaluation', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'evaluation.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'product.html'));
});

app.get('/login_register', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'login_register.html'));
});

// 模拟API

app.post('/api/new-post', (req, res) => {
  const { title, author, date } = req.body;
  posts.unshift({ title, author, date });
  res.status(201).json({ message: '帖子已创建' });
});

app.get('/api/posts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  db.query('SELECT COUNT(*) as totalPosts FROM posts', (error, results) => {
    if (error) {
      console.error('查询数据库时发生错误:', error);
      res.status(500).json({ message: '服务器错误' });
    } else {
      const totalPosts = results[0].totalPosts;
      const totalPages = Math.ceil(totalPosts / limit);

      db.query('SELECT * FROM posts LIMIT ? OFFSET ?', [limit, offset], (error, results) => {
        if (error) {
          console.error('查询数据库时发生错误:', error);
          res.status(500).json({ message: '服务器错误' });
        } else {
          // 将查询结果中的日期转换为字符串格式
          const formattedResults = results.map(post => {
            return {
              ...post,
              created_at: post.created_at.toISOString().split('T')[0]
            };
          });

          console.log('查询结果:', formattedResults);
          res.json({ posts: formattedResults, totalPages });
        }
      });
    }
  });
});

app.get('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
    if (err) {
      res.status(500).json({ message: '服务器错误' });
      return;
    }
    res.json(results[0]);
    res.sendFile(path.join(__dirname, 'TechCode-graduate-design', 'post.html'));
  });
});

app.get('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const query = 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC';
  db.query(query, [postId], (err, results) => {
    if (err) {
      res.status(500).json({ message: '服务器错误' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/comments', (req, res) => {
  db.query('SELECT * FROM comments', (err, results) => {
    if (err) {
      res.status(500).json({ message: '服务器错误' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/comments', (req, res) => {
  const { postId, author, content } = req.body;
  const newComment = { post_id: postId, author, content };

  db.query('INSERT INTO comments SET ?', newComment, (err) => {
    if (err) {
      res.status(500).json({ message: '服务器错误' });
      return;
    }
    res.status(201).json({ message: '评论已创建' });
  });
});

app.get('/api/products', (req, res) => {
  db.query('SELECT id, brand, model, type FROM products', (err, results) => {
    if (err) {
      res.status(500).json({ message: '服务器错误' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
    if (err) {
      res.status(500).json({ message: '服务器错误' });
      return;
    }
    res.json(results[0]);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
