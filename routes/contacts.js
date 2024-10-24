const express = require('express');
const validation = require('../middleware/contacts-validation.js');

const contactsController = require('../controllers/contacts');

const router = express.Router();

router.get('/', contactsController.getAllContacts);
router.get('/:id', contactsController.getSpecificContact);
router.post(
  '/',
  validation.contactsRules(),
  validation.newContactEmailRule(),
  validation.checkContactData,
  contactsController.createContact
);
router.put(
  '/:id',
  validation.contactsRules(),
  validation.updateContactEmailRule(),
  validation.checkContactData,
  contactsController.updateContact
);
router.delete('/:id', contactsController.removeContact);

module.exports = router;
