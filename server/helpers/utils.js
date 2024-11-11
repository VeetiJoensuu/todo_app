// Function to handle cases where a query result may be empty

const emptyOrRows = (result) => {
    if (!result) return []; // If the result is null or undefined, return an empty array
    return result.rows; // Otherwise, return the rows from the result
  };
  
  export { emptyOrRows };
  