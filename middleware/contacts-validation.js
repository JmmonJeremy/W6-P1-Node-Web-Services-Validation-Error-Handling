const { body, validationResult } = require('express-validator');
const validationHelpers = require('../helpers/utilities');
const validate = {};

/*  **********************************
 *  Contact Data Validation Rules
 * ********************************* */
validate.newContactEmailRule = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body('email')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Email Address Field Error') // when empty or invalid this message is sent rather than "Invalid value" when empty
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (email) => {
        const emailExists = await validationHelpers.checkExistingEmail(email);
        if (emailExists) {
          throw new Error('This email already exists.');
        }
      })
  ];
};

/*  **********************************
 *  Contact Data Validation Rules
 * ********************************* */
validate.updateContactEmailRule = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body('email')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Email Address Field Error') // when empty or invalid this message is sent rather than "Invalid value" when empty
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage('A valid email is required.')
      .custom(async (email, { req }) => {
        // Get the contactId from req.params.id
        const contactId = req.params.id;
        const emailExists = await validationHelpers.checkExistingEmailExceptUpdatingOne(
          email,
          contactId,
          req
        );
        if (emailExists) {
          throw new Error('This email already exists.');
        }
      })
  ];
};

/*  **********************************
 *  Contact Data Validation Rules
 * ********************************* */
validate.contactsRules = () => {
  // List of valid colors
  const validColors = [
    'Red',
    'Green',
    'Blue',
    'Yellow',
    'Purple',
    'Orange',
    'Black',
    'White',
    'Gray',
    'Brown',
    'Pink',
    'Teal',
    'Cyan',
    'Magenta',
    'Violet',
    'Indigo',
    'Turquoise',
    'Lavender',
    'Beige',
    'Maroon',
    'Navy',
    'Aqua',
    'Lime',
    'Peach',
    'Coral',
    'Mint',
    'Olive',
    'Burgundy',
    'Gold',
    'Silver',
    'Ivory',
    'Crimson',
    'Chartreuse',
    'Tan',
    'Amber',
    'Plum',
    'Copper',
    'Sapphire',
    'Emerald',
    'Rose',
    'Fuchsia',
    'Periwinkle',
    'Rainbow',
    'All'
  ];

  return [
    // firstname is required and must be string
    body('firstName')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('First Name Field Error') // when empty or invalid this message is sent rather than "Invalid value" when empty
      .isLength({ min: 1 })
      .withMessage('Please provide a first name.'), // on error this message is sent.

    // lastname is required and must be string
    body('lastName')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Last Name Field Error') // when empty or invalid this message is sent rather than "Invalid value" when empty
      .isLength({ min: 2 })
      .withMessage('Last name must contain at least 2 characters.'), // on error this message is sent.

    // favoriteColor is required and must be a string
    body('favoriteColor')
      .trim()
      .escape()
      .notEmpty()
      .withMessage('Favorite color is required')
      .isString()
      .withMessage('Favorite color must be a string')
      .matches(/^[A-Z][a-zA-Z]*$/) // Start with a capital letter and only alphabetic characters
      .custom((value) => {
        if (!validColors.includes(value)) {
          throw new Error('Color must be a valid color.');
        }
        return true;
      })
      .withMessage(
        'Color must begin with a capital letter and be a valid color from the color list.'
      ), // on error this message is sent.

    // birthday is optional but must be a string if provided
    body('birthday')
      .trim()
      .notEmpty()
      .withMessage('Birthday is required.')
      .matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(\d{2}|\d{4})$/)
      .withMessage('Birthday must be in the format MM/DD/YY or MM/DD/YYYY. (e.g., 12/12/76).')
  ];
};

/* ********************************************************************
 * Check data and return errors or continue to create or update contact
 * ****************************************************************** */
validate.checkContactData = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

module.exports = validate;
