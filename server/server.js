const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', {
    bundleSrc: process.env.NODE_ENV === 'production' ? '/bundle.js' : 'http://localhost:8081/bundle.js'
  });
});

const server = app.listen(app.get('port'), () => {
  const address = server.address();
  console.log(`Server listening on ${address.port}`);
});
