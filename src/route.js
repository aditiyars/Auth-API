const express = require('express');
const controller = require('./controller');
const router = express.Router();

router.get('/', controller.getIndex)
router.get('/login', controller.getLogin)
router.get('/register', controller.getRegister)
router.post('/register' , controller.createUser)
router.post('/login' , controller.login)
router.get('/getUser', controller.getUser)
router.get('/forgot', controller.getForgot)
router.post('/forgot', controller.forgot)
router.get('*', controller.notFound)

module.exports = router;