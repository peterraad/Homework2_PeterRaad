const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

// using require to pull other modules - this imports the product as an object

const ProductRoutes = require('../routes/productroutes');
const UserRoutes = require('../routes/userroutes');

const app = Express();

app.use(BodyParser.json());

app.use('/products', ProductRoutes);
app.use('/users', UserRoutes);
(async () => {
  // environment variable set in configuration of the WS environment
  await Mongoose.connect(process.env.SERVER_SECRET, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  app.listen(process.env.PORT);
})();

// applies all the product routes here
