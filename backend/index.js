const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000

// middlewares
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// All Routes
const authRoutes = require('./src/users/userRoute');

app.use('/api/auth', authRoutes);

main().then(()=>console.log('Database connected')).catch((err) => err => console.log(err))
async function main() {
  await mongoose.connect(process.env.DB_URL);
    
app.get("/", (req, res) => {
  res.send("Welcome to Showars Shopping Mall!");
});
}
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})