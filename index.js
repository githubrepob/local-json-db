const fs = require("fs");

/**
 * LocalJSONDB - A simple JSON-based local database for Node.js projects.
 * This class provides methods to perform basic CRUD operations and query data.
 */
class LocalJSONDB {
  /**
   * Constructor initializes the database file.
   * If the file does not exist, it creates one with an empty array as default content.
   *
   * @param {string} filePath - Path to the JSON file used as the database.
   */
  constructor(filePath) {
    this.filePath = filePath;
    // Ensure the database file exists; if not, create an empty one.
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), "utf8");
    }
  }

  /**
   * Reads the database content.
   *
   * @returns {Array} The array of records from the database.
   */
  read() {
    const data = fs.readFileSync(this.filePath, "utf8");
    return JSON.parse(data);
  }

  /**
   * Writes data to the database file.
   *
   * @param {Array} data - The array of records to write to the database.
   */
  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
  }

  /**
   * Creates a new record in the database.
   *
   * @param {Object} record - The record to be added.
   * @returns {Object} The created record with a unique ID.
   */
  create(record) {
    const data = this.read();
    const newRecord = { id: Date.now(), ...record };
    data.push(newRecord);
    this.write(data);
    return newRecord;
  }

  /**
   * Updates an existing record in the database by ID.
   *
   * @param {number} id - The ID of the record to update.
   * @param {Object} updatedFields - The fields to update in the record.
   * @returns {Object|null} The updated record, or null if no record with the given ID was found.
   */
  update(id, updatedFields) {
    const data = this.read();
    const index = data.findIndex((record) => record.id === id);
    if (index === -1) return null; // Record not found

    const updatedRecord = { ...data[index], ...updatedFields };
    data[index] = updatedRecord;
    this.write(data);
    return updatedRecord;
  }

  /**
   * Deletes a record from the database by ID.
   *
   * @param {number} id - The ID of the record to delete.
   * @returns {boolean} True if the record was deleted, false if no record with the given ID was found.
   */
  delete(id) {
    const data = this.read();
    const newData = data.filter((record) => record.id !== id);
    if (newData.length === data.length) return false; // No record deleted

    this.write(newData);
    return true;
  }

  /**
   * Queries the database using a custom filter function.
   *
   * @param {Function} filterFn - A function to filter the records.
   * @returns {Array} The array of records that match the filter criteria.
   */
  query(filterFn) {
    const data = this.read();
    return data.filter(filterFn);
  }
}

// Export the LocalJSONDB class for use in other modules.
module.exports = LocalJSONDB;
