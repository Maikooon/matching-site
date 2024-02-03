const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB (replace 'your-database-url' with your actual MongoDB connection string)
mongoose.connect('mongodb://localhost/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a mongoose schema for your data
const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Render the form using EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

// Handle form submission
app.post('/add', (req, res) => {
    // Create a new user instance with data from the form
    const newUser = new User({
        name: req.body.name,
        mail: req.body.mail,
        age: req.body.age
    });

    // Save the user to the database
    newUser.save((err) => {
        if (err) {
            console.error(err);
            res.send('Error saving to database');
        } else {
            res.send('Data saved to database');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
