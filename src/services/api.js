import axios from 'axios';

// Using empty baseURL when proxy is configured in package.json
const api = axios.create({
  baseURL: '', // Empty because we're using the proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Database services
const databaseService = {
  // Check database connection
  checkConnection: async () => {
    try {
      const response = await api.get('/db-status');
      return response.data;
    } catch (error) {
      console.error('Database connection check failed:', error);
      throw error;
    }
  },

  // Get all tables
  getTables: async () => {
    try {
      const response = await api.get('/tables');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      throw error;
    }
  },

  // Get table structure
  getTableStructure: async (tableName) => {
    try {
      const response = await api.get(`/tables/${tableName}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch structure for table ${tableName}:`, error);
      throw error;
    }
  },

  // Create new table
  createTable: async (tableData) => {
    try {
      const response = await api.post('/tables', tableData);
      return response.data;
    } catch (error) {
      console.error('Failed to create table:', error);
      throw error;
    }
  },

  // Delete table
  deleteTable: async (tableName) => {
    try {
      const response = await api.delete(`/tables/${tableName}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete table ${tableName}:`, error);
      throw error;
    }
  },

  // Add column to table
  addColumn: async (tableName, columnData) => {
    try {
      const response = await api.post(`/tables/${tableName}/columns`, columnData);
      return response.data;
    } catch (error) {
      console.error(`Failed to add column to ${tableName}:`, error);
      throw error;
    }
  },

  // Delete column from table
  deleteColumn: async (tableName, columnName) => {
    try {
      const response = await api.delete(`/tables/${tableName}/columns/${columnName}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete column ${columnName} from ${tableName}:`, error);
      throw error;
    }
  },

  // Add foreign key
  addForeignKey: async (tableName, foreignKeyData) => {
    try {
      const response = await api.post(`/tables/${tableName}/foreign-keys`, foreignKeyData);
      return response.data;
    } catch (error) {
      console.error(`Failed to add foreign key to ${tableName}:`, error);
      throw error;
    }
  },

  // Add index
  addIndex: async (tableName, indexData) => {
    try {
      const response = await api.post(`/tables/${tableName}/indexes`, indexData);
      return response.data;
    } catch (error) {
      console.error(`Failed to add index to ${tableName}:`, error);
      throw error;
    }
  }
};

export { databaseService };
export default api;
