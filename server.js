const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize database
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        task TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// HTML template
const getHTML = (todos) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 500px;
      width: 100%;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }
    form {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }
    input[type="text"] {
      flex: 1;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s;
    }
    input[type="text"]:focus {
      outline: none;
      border-color: #667eea;
    }
    button {
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover {
      background: #5568d3;
    }
    .todos {
      list-style: none;
    }
    .todo-item {
      background: #f8f9fa;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }
    .todo-text {
      color: #333;
      font-size: 16px;
    }
    .todo-date {
      color: #999;
      font-size: 12px;
      margin-top: 5px;
    }
    .empty {
      text-align: center;
      color: #999;
      padding: 40px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 My Todos</h1>
    <form action="/add" method="POST">
      <input type="text" name="task" placeholder="What needs to be done?" required>
      <button type="submit">Add</button>
    </form>
    <ul class="todos">
      ${todos.length === 0
        ? '<li class="empty">No todos yet. Add one above!</li>'
        : todos.map(todo => `
          <li class="todo-item">
            <div class="todo-text">${todo.task}</div>
            <div class="todo-date">${new Date(todo.created_at).toLocaleString()}</div>
          </li>
        `).join('')
      }
    </ul>
  </div>
</body>
</html>
`;

// Routes
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.send(getHTML(result.rows));
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).send('Error loading todos');
  }
});

app.post('/add', async (req, res) => {
  const { task } = req.body;
  try {
    await pool.query('INSERT INTO todos (task) VALUES ($1)', [task]);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).send('Error adding todo');
  }
});

// Start server
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
