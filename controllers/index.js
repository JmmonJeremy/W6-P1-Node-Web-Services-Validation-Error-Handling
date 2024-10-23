const nameFunction = (req, res) => {
  /*
    #swagger.description = "Name of someone close to me (my 4 year old daughter)"
    #swagger.summary = "Dislaying name for home CONTACTS page with added schema to meet mastery API DOCUMENTATION requirements"
    #swagger.responses[200] = { 
        description: "OK", 
        '@schema': { 
            "type": "object",
            "properties": {
              "successNotification": {
                "type": "string",
                "example": "Miriam Olivia Suchanski"
                } 
              } 
            } 
          } 
        }    
   */
  try {
    // Your normal logic here
    res.json('Miriam Olivia Suchanski');
  } catch (error) {
    // Handle any errors and return a 500 status
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { nameFunction };
