const Express = require('express');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');

// using require to pull other modules - this imports the product as an object
const Product = require('./models/product');
const User = require('./models/user');
const UserService = require('./database.service');

const app = Express();

app.use(BodyParser.json());

const doActionThatMightFailValidation = async (request, response, action) => {
  try {
    await action();
  } catch (e) {
    response.sendStatus(
      // if the code is 11000 or the stack is saying validationerror or reason is undefined or reason code
      // is ERR_ASSERTION then send back response code 400 otherwise 500
      e.code === 11000
      || e.stack.includes('ValidationError')
      || (e.reason !== undefined && e.reason.code === 'ERR_ASSERTION')
        ? 400 : 500,
    );
  }
};

app.get('/products', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    // if this part throws an exception where it doesn't find the object specified o
    // r something then it will go to the funcion above and evaluate
    // whether the response should be 4 or 500
    // request.query is the search query the user types in for the request
    // '-_id -__v' this ignores a bunch of stuff except for the id
    // we do not want the await inside the response.json in this controller we want it in a separate service
    response.json(await Product.find(request.query).select('-_id -__v'));
  });
});
app.get('/users', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    // if this part throws an exception where it doesn't find the object specified or something then it will go to the funcion above and evaluate
    // whether the response should be 4 or 500
    // request.query is the search query the user types in for the request
    // '-_id -__v' this ignores a bunch of stuff except for the id
    // we do not want the await inside the response.json in this controller we want it in a separate service
    response.json();
  });
});

app.get('/products/:sku', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    const getResult = await Product.findOne({ sku: request.params.sku }).select('-_id -__v');
    if (getResult != null) {
      response.json(getResult);
    } else {
      response.sendStatus(404);
    }
  });
});

app.post('/products', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    await new Product(request.body).save();
    response.sendStatus(201);
  });
});

app.delete('/products', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus((await Product.deleteMany(request.query)).deletedCount > 0 ? 200 : 404);
  });
});

app.delete('/products/:sku', async (request, response) => {
  await doActionThatMightFailValidation(request, response, async () => {
    response.sendStatus((await Product.deleteOne({
      sku: request.params.sku,
    })).deletedCount > 0 ? 200 : 404);
  });
});

app.put('/products/:sku', async (request, response) => {
  const { sku } = request.params;
  const product = request.body;
  product.sku = sku;
  await doActionThatMightFailValidation(request, response, async () => {
    await Product.findOneAndReplace({ sku }, product, {
      upsert: true,
    });
    response.sendStatus(200);
  });
});

app.patch('/products/:sku', async (request, response) => {
  const { sku } = request.params;
  const product = request.body;
  delete product.sku;
  await doActionThatMightFailValidation(request, response, async () => {
    const patchResult = await Product
      .findOneAndUpdate({ sku }, product, {
        new: true,
      })
      .select('-_id -__v');
    if (patchResult != null) {
      response.json(patchResult);
    } else {
      response.sendStatus(404);
    }
  });
});

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
