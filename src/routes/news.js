
const express = require('express');
const router = express.Router();

const newsControllers = require('../app/controllers/NewsControllers');

router.use('/:slug', newsControllers.show)



router.use('/', newsControllers.index)



module.exports = router;
