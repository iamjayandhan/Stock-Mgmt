import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Home.css';
import { format } from 'date-fns';

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newStock, setNewStock] = useState({ name: '', qty: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  // Fetch stocks on page load!
  useEffect(() => {
    fetchStocks();
  }, []);

  const handleOpenEditModal = (stock) => {
    setSelectedStock(stock);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStock(null);
  };

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stocks');
      console.log('Stocks fetched:', response.data);
      setStocks(response.data); 
    } catch (error) {
      console.error('Error fetching stocks:', error);
      toast.error('Failed to load stocks!');
    }
  };
  
  const handleAddStock = async () => {
    console.log(newStock.name && newStock.qty);
    if (newStock.name && newStock.qty) {
      const qty = parseInt(newStock.qty, 10);
      
      if (isNaN(qty) || qty <= 0) {
        toast.warn('Please enter a valid quantity greater than 0!');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:5000/api/stocks', {
          name: newStock.name,
          qty: qty,  // Ensure you're sending 'qty' to the backend
        });
  
        setStocks([...stocks, response.data]);
        setNewStock({ name: '', qty: '' });
        setShowModal(false);
        toast.success('Stock added successfully!');
      } catch (error) {
        console.error('Error adding stock:', error);
        setShowModal(false);
        toast.error('Failed to add stock!');
      }
    } else {
      toast.warn('Please fill in all fields!');
    }
      fetchStocks();
  };
  
  const handleDeleteStock = async (id) => {
    console.log('Deleting stock with ID:', id);
    if (!id) {
      console.error("Stock ID is missing");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/stocks/${id}`);
      setStocks(stocks.filter((stock) => stock.id !== id));
      toast.success('Stock deleted successfully!');
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast.error('Failed to delete stock!');
    }
  };
  
  const handleEditStock = async (id, updatedStock) => {
    const qty = parseInt(updatedStock.qty, 10);
    if (isNaN(qty) || qty <= 0) { 
      toast.warn('Please enter a valid quantity greater than 0!');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:5000/api/stocks/${id}`, updatedStock);
      setStocks(
        stocks.map((stock) => (stock.id === id ? { ...stock, ...response.data } : stock))
      );
      toast.success('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock!');
    }
    fetchStocks();
  };
  
  const filteredStocks = stocks.filter(stock => {
    if (stock && stock.name) {
      return stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  const formatDate = (date) => {
    if (date) {
      return format(new Date(date), 'MMM dd, yyyy');
    }
    return 'Invalid Date';
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal')) {
      setShowModal(false);
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>Stock Management</h1>
        <p>Manage your inventory with ease.</p>
      </header>

      <main className="content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button
            className="new-stock-btn"
            onClick={() => setShowModal(true)}
          >
            New Stock
          </button>
        </div>

        <div className="stock-list">
          <h2>Available Stocks</h2>
          <table className="stock-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date Created</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock, index) => (
                  <tr key={stock.id}>  
                    <td>{stock.name}</td>
                    <td>{formatDate(stock.createdAt)}</td>
                    <td>{stock.qty}</td>
                    <td>
                      <button
                        onClick={() => handleOpenEditModal(stock)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStock(stock.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No stocks found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isEditModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <h3>Edit Stock</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditStock(selectedStock.id, selectedStock);
              handleCloseEditModal();
            }}
          >
            <label>
              Name
              <input
                type="text"
                value={selectedStock.name}
                className='modal-input'
                placeholder="Stock Name"
                onChange={(e) =>
                  setSelectedStock({ ...selectedStock, name: e.target.value })
                }
                required
              />
            </label>
            <label>
              Quantity
              <input
                type="number"
                className='modal-input'
                value={selectedStock.qty}
                placeholder="Quantity"
                onChange={(e) =>
                  setSelectedStock({ ...selectedStock, qty: e.target.value })
                }
                required
              />
            </label>
            <div className='modal-buttons'>
              <button type="submit" className='modal-btn save-btn'>Save</button>
              <button type="button" className='modal-btn cancel-btn' onClick={handleCloseEditModal}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {showModal && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <h3>Add New Stock</h3>
            <input
              type="text"
              placeholder="Stock Name"
              value={newStock.name}
              onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
              className="modal-input"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newStock.qty}
              onChange={(e) => setNewStock({ ...newStock, qty: e.target.value })}
              className="modal-input"
              required
            />
            <div className="modal-buttons">
              <button onClick={handleAddStock} className="modal-btn save-btn">
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="modal-btn cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2024 Stock Management - All Rights Reserved</p>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Home;
