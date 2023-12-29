const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const uri = 'mongodb+srv://<username>:<password>@cluster0.kokuqbc.mongodb.net/'
const PORT = 3000;
const jwtSecretKey = '@#$';


app.use(cors()); // Use cors middleware

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hi');
})

app.post('/signup', async (req, res) => {
    const dbClient = new MongoClient(uri);
    const { email, password } = req.body;

    const generateUserId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await dbClient.connect();
        const database = dbClient.db('app-data');
        const users = database.collection('users');

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            res.status(409).send('User already exists. Please login');
        }

        const sanitizedEmail = email.toLowerCase();

        const data = {
            user_id: generateUserId,
            hashedPassword: hashedPassword,
            email: sanitizedEmail
        }

        const insertedUser = await users.insertOne(data);

        const token = jwt.sign({ insertedUser, sanitizedEmail }, jwtSecretKey, { expiresIn: 60 * 24 });

        res.status(201).json({ 'token': token, 'userId': generateUserId, 'email': sanitizedEmail });

    } catch (err) {
        res.status(500).json({ 'messgae': err });
    }
})

// Returns all the users
app.get('/users', async (req, res) => {
    const dbClient = new MongoClient(uri);

    try {
        await dbClient.connect();
        const database = dbClient.db('app-data');
        const users = database.collection('users');

        const returnedUsers = await users.find().toArray();
        res.json(returnedUsers);

    } finally {
        await dbClient.close();
    }
})

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));