const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const uri = 'mongodb+srv://admin:6pwz4sTe8efS2GTn@cluster0.kokuqbc.mongodb.net/'
const PORT = 3000;
const jwtSecretKey = '@#$';


app.use(cors());

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hi');
})

// Logs in a user
app.post('/login', async (req, res) => {
    const dbClient = new MongoClient(uri);
    const { email, password } = req.body;

    try {
        await dbClient.connect();
        const database = dbClient.db('app-data');
        const users = database.collection('users');

        const existingUser = await users.findOne({ email });

        if (existingUser && (await bcrypt.compare(password, existingUser.hashedPassword))) {

            const token = jwt.sign({ userId: existingUser.user_id, email }, jwtSecretKey, { expiresIn: 60 * 24 });
            res.status(200).json({ token, UserId: existingUser.user_id });
        } else {
            res.status(404).send('User doesn\'t exist or incorrect password');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Creates a new user
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

        res.status(201).json({ token, UserId: generateUserId });

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

// Updates a user
app.put('/user', async (req, res) => {
    const dbClient = new MongoClient(uri);

    const formdata = req.body.formData;

    try {
        await dbClient.connect();
        const database = dbClient.db('app-data')
        const user = database.collection('users');

        const query = { user_id: formdata.user_id };
        const updateDocument= {
            $set:{
                first_name: formdata.first_name,
                dob_day: formdata.dob_day,
                dob_month: formdata.dob_month,
                dob_year: formdata.dob_year,
                show_gender: formdata.show_gender,
                gender_identity: formdata.gender_identity,
                gender_interest: formdata.gender_interest,
                url: formdata.url,
                matches: formdata.matches
            }
        }

        const insertedUser = await user.updateOne(query, updateDocument);
        res.status(200).send(insertedUser);
        console.log(insertedUser);

    } catch (err) {
        res.status(500).json(err);
    }finally{
        await dbClient.close();
    }
})

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));