import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShoppingList from './ShoppingList';


  test('renders Shopping List component', () => {
    render(<ShoppingList />);
    const headingElement = screen.getByText(/Shopping List/);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders Add button and input box for adding new item', () => {
    render(<ShoppingList />);
    const addButton = screen.getByText(/Add/);
    const inputBox = screen.getByPlaceholderText(/Add new item.../);
    const quantityInput = screen.getByPlaceholderText(/Quantity/);

    expect(addButton).toBeInTheDocument();
    expect(inputBox).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
  });
