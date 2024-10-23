const express = require('express');

const contactsController = require('../controllers/contacts');

const router = express.Router();

router.get('/', contactsController.getAllContacts);
router.get('/:id', contactsController.getSpecificContact);
router.post('/', contactsController.createContact);
router.put('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.removeContact);

module.exports = router;
