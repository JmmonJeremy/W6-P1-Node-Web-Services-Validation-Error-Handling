const mongodb = require('../db/connect');
const { ObjectId } = require('bson');

// fuction to return all contacts
const getAllContacts = async (req, res) => {
  /*
    #swagger.summary = "Getting ALL CONTACTS with added schema to meet mastery API DOCUMENTATION requirements"
    #swagger.responses[200] = { 
        description: "OK", 
        '@schema': { 
              "type": "object",
              "properties": {
                "firstName": {
                  "example": "any"
                },
                "lastName": {
                  "example": "any"
                },
                "email": {
                  "example": "any"
                },
                "favoriteColor": {
                  "example": "any"
                },
                "birthday": {
                  "example": "any"
                }
                } 
              } 
            } 
          } 
        }    
   */
  try {
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get all "documents" in other words table rows or entries
    const result = await collection.find();
    // Turn each entry into an item in a list
    const contactsInfoList = await result.toArray();
    // See if there is anything in the table or "collection" & report
    var entries = contactsInfoList.length;
    if (entries === 0) {
      console.log('No documents found in the contacts collection.');
      return res.status(404).json({ message: 'No contacts found.' });
    } else {
      console.log(`There are "${entries}" documents in the contacts collection.`);
    }
    // Get & report the name of the 1st entry in the collection
    console.log(
      `"${contactsInfoList[0].firstName} ${contactsInfoList[0].lastName}" is the "first & last Name" for the 1st "contacts collection entry"`
    );
    // Set header and get 1st entry
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contactsInfoList);
  } catch (error) {
    console.error('Error fetching data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// function to get 1 contact
const getSpecificContact = async (req, res) => {
  /*
    #swagger.description = "Demo SELECT 1 contact options:
    Bryan's _id:      66f77d6c74ad0f43e4341169
    Victoria's _id:   66f77d6c74ad0f43e434116a
    Ammon's _id:      66f77d6c74ad0f43e434116b
    Miriam's _id:     67083f1820e41367f6a90c05
    Elizabeth's _id:  67083f1820e41367f6a90c06
    Demon's _id:  66fe08c7b9dffdc00f411ba4"
    #swagger.summary = "Getting 1 CONTACT with added schema to meet mastery API DOCUMENTATION requirements"
    #swagger.responses[200] = { 
      description: "OK", 
      '@schema': { 
            "type": "object",
            "properties": {
              "firstName": {
                "example": "any"
              },
              "lastName": {
                "example": "any"
              },
              "email": {
                "example": "any"
              },
              "favoriteColor": {
                "example": "any"
              },
              "birthday": {
                "example": "any"
              }
              } 
            } 
          } 
        } 
      }  
   */
  try {
    // Create a variable to hold the object of the contact id
    const contactId = new ObjectId(req.params.id.toString());
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get a specific entry from the "document"
    const result = await collection.find({ _id: contactId });
    // Turn the entry into an item in a list
    const contactsInfoList = await result.toArray();
    // See if there is anything in the table or "collection" & report
    var entries = contactsInfoList.length;
    if (entries === 0) {
      console.log('No contact found in the contacts collection matches.');
      return res.status(404).json({ message: 'No matching contact found.' });
    } else {
      console.log(`There is "${entries}" matching contact in the contacts collection.`);
    }
    // Get & report the name of the 1st entry in the collection - the only entry
    console.log(
      `"${contactsInfoList[0].firstName} ${contactsInfoList[0].lastName}" is the "first & last Name" for the matching contact in the "contacts collection entry"`
    );
    // Set header and get 1st - only entry
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contactsInfoList[0]);
  } catch (error) {
    console.error('Error fetching data: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// function to post or create a contact
const createContact = async (req, res) => {
  /*
    #swagger.description = 'Demo CREATE contact info:
    _id:            66fe08c7b9dffdc00f411ba4
    firstName:      Demo,
    lastName:       Fanny,
    email:          demo1@gmail.com,
    favoriteColor:  White,
    birthday:       01/01/01'
  */
  try {
    // Log the request body to check if it's being parsed
    console.log(`The following is prepped to be added:\n ${JSON.stringify(req.body, null, 2)}`);
    // Create the contact to be created
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
      ...(req.body._id && { _id: new ObjectId(req.body._id) })
    };
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Insert the new contact into the database
    const actionResult = await collection.insertOne(contact);
    // Return the id # and success
    console.log(actionResult);
    res.status(201).json(actionResult);
  } catch (error) {
    console.error('Error inserting data: ', error);
    res.status(500).json({ message: 'Error occured while creating contact.' });
  }
};

// function to update a contact's info
const updateContact = async (req, res) => {
  /*
    #swagger.description = 'Demo UPDATE contact info:
    _id:            66fe08c7b9dffdc00f411ba4
    firstName:      Demonstration,
    lastName:       Funny,
    email:          1demo1@gmail.com,
    favoriteColor:  Rainbow,
    birthday:       01/01/1001'
  */
  try {
    // Create a variable to hold the object of the contact id
    const contactId = new ObjectId(req.params.id.toString());
    // Create the contact to be created
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    // Get the database object & report name
    const db = mongodb.getDb().db();
    console.log('Connected to DB:', db.databaseName);
    // Get the "user" "collection" in other words table
    const collection = db.collection('contacts');
    // Get a specific entry from the "document"
    const result = await collection.findOne({ _id: contactId });
    if (!result) {
      console.log('No matching contact found to update.');
      return res.status(404).json({ message: 'No matching contact found to update.' });
    }
    const name = result.firstName + ' ' + result.lastName;
    console.log(
      `${name}'s contact info with the id of "${contactId}" is being updated as follows:\n${JSON.stringify(req.body, null, 2)}`
    );
    // Update the matching contact
    const actionResult = await collection.replaceOne({ _id: contactId }, contact);

    // Check if a contact was updated
    if (actionResult.matchedCount === 0) {
      console.log('No matching contact found to update.');
      return res.status(404).json({ message: 'No matching contact found to update.' });
    } else {
      const message = `The contact "${name}" with the id of "${contactId}" was successfully updated in the contacts collection as requested.`;
      console.log(message);
      // Return the id # and success
      // res.status(200).json(message);
      res.status(204).send();
    }
  } catch (error) {
    console.error('Error inserting data: ', error);
    res.status(500).json({ message: 'Error occured while updating contact.' });
  }
};

// function to remove or delete a contact
const removeContact = async (req, res) => {
  /*
    #swagger.description = "Demo DELETE 1 contact:
    Demo or Demonstration's _id:  66fe08c7b9dffdc00f411ba4"
    #swagger.summary = "Deleting 1 CONTACT with added schema to meet mastery API DOCUMENTATION requirements"
    #swagger.responses[200] = { 
        description: "OK", 
        '@schema': { 
            "type": "object",
            "properties": {
              "successNotification": {
                "type": "string",
                "example": "The contact (name) with the id of (contactId) was successfully deleted from the contacts collection as requested."
                } 
              } 
            } 
          } 
        }    
   */
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
    if (!result) {
      console.log('No matching contact found to delete.');
      return res.status(404).json({ message: 'No matching contact found to delete.' });
    }
    const name = result.firstName + ' ' + result.lastName;
    console.log(`The contact "${name}" with the id of "${contactId}" is being deleted.`);
    // Update the matching contact
    const actionResult = await collection.deleteOne({ _id: contactId });

    // Check if a contact was updated
    if (actionResult.deletedCount === 0) {
      console.log('No matching contact found to delete.');
      return res.status(404).json({ message: 'No matching contact found to delete.' });
    } else {
      const message = `The contact "${name}" with the id of "${contactId}" was successfully deleted from the contacts collection as requested.`;
      console.log(message);
      // Return the id # and success
      res.status(200).json(message);
    }
  } catch (error) {
    console.error('Error inserting data: ', error);
    res.status(500).json({ message: 'Error occured while trying to remove the contact.' });
  }
};

module.exports = {
  getAllContacts,
  getSpecificContact,
  createContact,
  updateContact,
  removeContact
};
