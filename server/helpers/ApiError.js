// ApiError.js: Custom Error class to handle API-specific errors

class ApiError extends Error {
    // Constructor takes a message and an optional status code
    constructor(message, statusCode) {
      super(message); // Call the parent class constructor with the message
      this.statusCode = statusCode; // Set the status code for the error
    }
  }
  
  export { ApiError };