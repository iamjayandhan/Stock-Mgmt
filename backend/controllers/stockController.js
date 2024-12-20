const { db } = require('../firebase/firebaseConfig');

// Create a stock item
exports.createStock = async (req, res) => {
    try {
      const { name, qty } = req.body;
      console.log("Received data:", req.body); // Log incoming data
      if (!name || !qty) {
        return res.status(400).send({ error: 'Name and quantity are required' });
      }
      const createdAt = new Date().toISOString();
      await db.collection('stocks').add({ name, qty, createdAt });
      res.status(201).send({ message: 'Stock added successfully' });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
};  

// Get all stock items
exports.getStocks = async (req, res) => {
    try {
        const stocks = await db.collection('stocks').get();
        const stockList = stocks.docs.map(doc => ({
            id: doc.id, // Include the document ID
            ...doc.data() // others! name, qty, createdAt
        }));

        console.log('Inside getStocks', stockList);
        res.status(200).json(stockList);
    } catch (error) {
        console.error('Error fetching stocks:', error);
        res.status(500).send({ error: 'Failed to fetch stocks' });
    }
};

// Update a stock item
exports.updateStock = async (req, res) => {
    console.log("Inside updateStock "+req.body);
    try {
      const { id } = req.params;
      const { name, qty } = req.body;
      await db.collection('stocks').doc(id).update({ name, qty });
      res.status(200).send({ message: 'Stock updated successfully' });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };
  
// Deleting stock with ID
exports.deleteStock = async (req, res) => {
    console.log("Deleting stock with ID:", req.params.id);
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ error: 'Stock ID is required' });
      }
      await db.collection('stocks').doc(id).delete();
      res.status(200).send({ message: 'Stock deleted successfully' });
    } catch (error) {
      console.error('Error deleting stock:', error);
      res.status(500).send({ error: error.message });
    }
  };
  