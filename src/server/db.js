
// In-memory data store
const store = {
  leads: [],
  emails: [],
  nextLeadId: 1,
  nextEmailId: 1
};

// Function to emulate connecting to a database
const connectDB = async () => {
  try {
    console.log('Using in-memory data store instead of MongoDB');
    return { connection: { host: 'local', name: 'in-memory' } };
  } catch (error) {
    console.error(`Error initializing in-memory data store: ${error.message}`);
    process.exit(1);
  }
};

// Helper function to get a new ID for leads
const getNextLeadId = () => {
  const id = store.nextLeadId.toString();
  store.nextLeadId++;
  return id;
};

// Helper function to get a new ID for emails
const getNextEmailId = () => {
  const id = store.nextEmailId.toString();
  store.nextEmailId++;
  return id;
};

module.exports = {
  connectDB,
  store,
  getNextLeadId,
  getNextEmailId
};
