const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//    console.log(req.ips);
//    res.send('Hello world!');
// });

app.set('trust proxy', false);

app.all('/',(req, res) => {
   console.log(req.ip);
   res.send('Hello world1!');
})

app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`);
});