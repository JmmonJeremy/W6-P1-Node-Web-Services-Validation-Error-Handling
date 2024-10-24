const mongodb = require('../db/connect');
const { ObjectId } = require('bson');

/* *****************************************************
 *   Check for Existing Duplicate Email for New Contact
 * *************************************************** */
const checkExistingEmail = async (new_email, req, res) => {
  try {
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get a specific entry from the "document"
    const result = await collection.find({ email: new_email });
    // Turn the entry into an item in a list
    const contactsInfoList = await result.toArray();
    // See if there is anything in the table or "collection" & report
    var entries = contactsInfoList.length;
    if (entries === 0) {
      console.log('No contact found in the contacts collection matches.');
      return entries;
    } else {
      console.log(`There is already"${entries}" email like this in the contacts collection.`);
      return entries;
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/* ***********************************************
 *   Get Email String from Database for 1 Contact
 * ********************************************* */
const getEmailById = async (req, res) => {
  try {
    // Create a variable to hold the object of the contact id
    const contactId = new ObjectId(req.params.id.toString());
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get a specific entry from the "document"
    const result = await collection.findOne({ _id: contactId });

    // Check if a contact was found
    if (!result) {
      console.log('No contact found in the contacts collection matches.');
      return null;
    } else {
      // Return the email
      return result.email;
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/* **********************************************************
 *   Check for Existing Duplicate Email for Updating Contact
 * ******************************************************** */
const checkExistingEmailExceptUpdatingOne = async (new_email, contactId, req, res) => {
  try {
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);

    // Get the "contacts" collection
    const collection = db.collection('contacts');

    // Get the existing email for the specified contact
    const existingContactEmail = await getEmailById({ params: { id: contactId } }, res);

    // If there was an error getting the email or no email returned, return
    if (typeof existingContactEmail === 'object' && existingContactEmail.status === 404) {
      return 0; // No contact found, so return 0
    }

    // Check for existing emails except for the current contact's email
    const result = await collection.find({ email: new_email }).toArray();

    // Filter out the existing email of the contact being updated
    const entries = result.filter((contact) => contact.email !== existingContactEmail).length;

    if (entries === 0) {
      console.log('No contact found in the contacts collection matches.');
      return entries;
    } else {
      console.log(`There is already "${entries}" email(s) like this in the contacts collection.`);
      return entries;
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  checkExistingEmail,
  getEmailById,
  checkExistingEmailExceptUpdatingOne
};
