const connectToMongoDB = require('./mongodb');
const express = require('express')
connectToMongoDB();


const app = express();
const port = 5000;

app.use(express.json());

app.use('/cloudbook/auth', require('./routes/auth'));
app.use('/cloudbook/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})