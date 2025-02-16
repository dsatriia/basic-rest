const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Library untuk membuat token unik
const fs = require('fs'); // Untuk membaca dan menulis file
const app = express();
const port = 3000;

app.use(express.json());

// Simulasi "tabel users" dan "tabel tokens"
const users = [
  { id: 1, username: 'admin', password: 'password123' },
  { id: 2, username: 'user', password: 'userpassword' }
];

const tokens = []; // Simulasi tabel tokens: [{ token: '...', userId: 1 }]

// Endpoint untuk login dan menghasilkan token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = uuidv4(); // Token unik
    tokens.push({ token, userId: user.id });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid username or password' });
});

// Middleware untuk validasi token
const tokenAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];

  const tokenEntry = tokens.find(t => t.token === token);

  if (tokenEntry) {
    const user = users.find(u => u.id === tokenEntry.userId);
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Gunakan middleware token di semua route selain /login
app.use(tokenAuthMiddleware);

// File untuk menyimpan data pelanggan
const customersFilePath = './customers.json';

// Helper function untuk membaca data pelanggan
const readCustomers = () => {
  if (!fs.existsSync(customersFilePath)) {
    fs.writeFileSync(customersFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(customersFilePath, 'utf8'));
};

// Helper function untuk menulis data pelanggan
const writeCustomers = (customers) => {
  fs.writeFileSync(customersFilePath, JSON.stringify(customers, null, 2));
};

// Get all customers
app.get('/customers', (req, res) => {
  const customers = readCustomers();
  res.json(customers);
});

// Get one customer
app.get('/customers/:id', (req, res) => {
  const customers = readCustomers();
  const customer = customers.find(c => c.id === req.params.id);

  if (customer) {
    res.json(customer);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});

// Add new customer
app.post('/customers', (req, res) => {
  const customers = readCustomers();
  const newCustomer = { id: uuidv4(), ...req.body };
  customers.push(newCustomer);
  writeCustomers(customers);
  res.status(201).json(newCustomer);
});

// Update customer
app.put('/customers/:id', (req, res) => {
  const customers = readCustomers();
  const customerIndex = customers.findIndex(c => c.id === req.params.id);

  if (customerIndex !== -1) {
    customers[customerIndex] = { ...customers[customerIndex], ...req.body };
    writeCustomers(customers);
    res.json(customers[customerIndex]);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});

// Delete customer
app.delete('/customers/:id', (req, res) => {
  const customers = readCustomers();
  const customerIndex = customers.findIndex(c => c.id === req.params.id);

  if (customerIndex !== -1) {
    const deletedCustomer = customers.splice(customerIndex, 1);
    writeCustomers(customers);
    res.json(deletedCustomer[0]);
  } else {
    res.status(404).json({ message: 'Customer not found' });
  }
});

// Endpoint untuk logout
app.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  const tokenIndex = tokens.findIndex(t => t.token === token);

  if (tokenIndex !== -1) {
    tokens.splice(tokenIndex, 1); // Hapus token dari "database token"
    return res.json({ message: 'Logged out successfully' });
  }

  res.status(401).json({ message: 'Invalid token' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Press Ctrl+C to stop`);
});
