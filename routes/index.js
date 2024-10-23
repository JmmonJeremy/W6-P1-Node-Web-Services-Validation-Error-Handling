const routes = require('express').Router();

const myController = require('../controllers');

routes.get('/', myController.nameFunction);
routes.use('/contacts', require('./contacts'));
routes.use('/', require('./swagger'));

module.exports = routes;
