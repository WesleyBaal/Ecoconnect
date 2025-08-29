import { useState, useEffect } from 'react';
import { useMockData } from '../contexts/MockDataContext';
import { useAuth } from '../contexts/AuthContext';

export const useItems = (filters = {}) => {
  const { getItems, createItem, updateItem, deleteItem, getUserItems } = useMockData();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchItems = () => {
      setLoading(true);
      try {
        const result = getItems(filters);
        setItems(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Erro ao buscar itens:', error);
        setItems([]);
        setPagination({});
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [getItems, JSON.stringify(filters)]);

  const addItem = async (itemData) => {
    if (!user) return null;
    const newItem = createItem(itemData, user.id);
    return newItem;
  };

  const editItem = async (id, updates) => {
    if (!user) return false;
    updateItem(id, updates, user.id);
    return true;
  };

  const removeItem = async (id) => {
    if (!user) return false;
    deleteItem(id, user.id);
    return true;
  };

  const getUserItemsList = () => {
    if (!user) return [];
    return getUserItems(user.id);
  };

  return {
    items,
    loading,
    pagination,
    addItem,
    editItem,
    removeItem,
    getUserItems: getUserItemsList
  };
};
