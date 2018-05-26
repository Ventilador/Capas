const express = require('express');
const app = express();

require('./menu')(app);
require('./threads')(app);
app.listen(5000, 'localhost', function (err) {
    console.log('started');
});