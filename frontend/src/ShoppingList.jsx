import React, { useEffect, useState } from 'react';
import './shopping.css';

function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchShoppingItems();
  }, []);

  const fetchShoppingItems = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/items`);
      const data = await response.json();
      setShoppingList(data);
    } catch (err) {
      console.error('Error fetching shopping items:', err);
    }
  };

  const handleInputChange = (event) => {
    setNewItem(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const addItem = async () => {
    if (newItem.trim() !== '') {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newItem, quantity: quantity }),
        });

        if (response.ok) {
          const data = await response.json();
          setShoppingList([
            ...shoppingList,
            { id: data.id, name: data.name, quantity: data.quantity },
          ]);
          setNewItem('');
          setQuantity(1);
        } else {
          console.error('Failed to add item');
        }
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleCheckItem = (itemId) => {
    const updatedList = shoppingList.map((item) =>
      item.id === itemId ? { ...item, picked: !item.picked } : item
    );
    setShoppingList(updatedList);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND}/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedList = shoppingList.filter((item) => item.id !== itemId);
        setShoppingList(updatedList);
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="shoppinglist">
      <h1>Shopping List</h1>
      <ul>
        {shoppingList.length === 0 && (
          <li className="empty-list">Your shopping list is empty!</li>
        )}
        {shoppingList.map((item) => (
          <li key={item.id} className={`list-item${item.picked ? ' list-item--checked' : ''}`}>
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={item.picked}
                onChange={() => handleCheckItem(item.id)}
              />
            </div>
            <span>{item.name} - Quantity: {item.quantity}</span>
            <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="add-item">
        <input
          type="text"
          value={newItem}
          onChange={handleInputChange}
          placeholder="Add new item..."
        />
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min={1}
          placeholder="Quantity"
        />
        <button onClick={addItem}>Add</button>
      </div>
    </div>
  );
}

export default ShoppingList;
