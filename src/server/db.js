
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
    // Add some sample data for testing
    if (store.leads.length === 0) {
      store.leads.push({
        id: getNextLeadId(),
        name: "John Sample",
        email: "john@sample.com",
        requestType: "Product Demo",
        message: "I'd like to learn more about your product",
        status: "new",
        source: "website",
        score: 75,
        interactions: 0,
        interactionsData: [],
        lastActivity: "Just now",
        isGuest: false,
        createdAt: new Date(),
        analysis: "This lead appears to be interested in the product features"
      });
    }
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
