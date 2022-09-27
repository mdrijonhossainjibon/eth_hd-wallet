const express = require('express');
const controller = require('../../controller/index');

// express router object
const router = express.Router();

// wallet routes
router.get('/', controller.createWallet);
router.get('/:address', controller.getBalance);
router.post('/', controller.transferAmount);

module.exports = router;
