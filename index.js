const express = require('express');
const app = express();
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login')
const logoutRoute = require('./routes/logout')
const error = require('./middlewares/error');
const {logger} = require('./logging/logging');
const config = require('config');
const userRoute = require('./routes/users');
const {client} = require('./db/userdb');

if(!config.get('jwtPrivateKey'))
{
   logger.error('FATAL ERROR: jwtPrivateKey is not defined');
   process.exit(1);
}

app.use(express.json());
app.use('/api/users', userRoute(client));
app.use('/api/register', registerRoute(client));
app.use('/api/login',loginRoute(client));
app.use('/api/logout',logoutRoute(client));
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));

