const express = require('express');
const app = express();

const PORT = 3000;

//serve static files from /app directory (this is for CSS and JS files to be served)
app.use(express.static('app'));

// Initialize server on port 3000
app.listen(PORT, () => {
    console.log("listening on port ", PORT);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/app/index.html");
});