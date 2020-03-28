'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const router = require('./routes')
const bodyParser = require('body-parser');
const sequelize = require('./models').sequelize;




// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

app.use(bodyParser.json());


// TODO setup your api routes here
app.use("/api/",router)


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {err},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);






// start listening on our port and connecting to database
const server = app.listen(app.get('port'),async  () => {
  try{
  await sequelize.authenticate()
  console.log(`App is connected to database`)
  console.log(`Express server is listening on port ${server.address().port}`);
  }catch(err){
    console.error(`error connecting to database: ${err}`)
  }
});


