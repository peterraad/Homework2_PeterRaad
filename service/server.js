require('dotenv').config();
const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

const ProductRoutes = require('../routes/productroutes');
const UserRoutes = require('../routes/userroutes');

const app = Express();

app.use(BodyParser.json());

app.use('/products', ProductRoutes);
app.use('/users', UserRoutes);
(async () => {
  await Mongoose.connect(process.env.SERVER_SECRET, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  app.listen(process.env.PORT);
})();
