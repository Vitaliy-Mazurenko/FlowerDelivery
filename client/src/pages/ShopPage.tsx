import React, { useState, useEffect } from 'react';
import { getShops, getFlowers, toggleFavorite } from '../services/api';
import { Shop, Flower, CartItem } from '../types';

const ShopPage: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [sortBy, setSortBy] = useState<string>('dateAdded');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const fetchedShops = await getShops();
        setShops(fetchedShops);
        if (fetchedShops.length > 0) {
          setSelectedShop(fetchedShops[0]._id); // Select the first shop by default
        }
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };
    fetchShops();
  }, []);

  useEffect(() => {
    const fetchFlowers = async () => {
      if (selectedShop) {
        try {
          const { flowers: fetchedFlowers, totalPages, currentPage: fetchedCurrentPage } =
            await getFlowers(selectedShop, sortBy, currentPage, 8);
          setFlowers(fetchedFlowers);
          setTotalPages(totalPages);
          setCurrentPage(fetchedCurrentPage);
          console.log('Fetched flowers:', fetchedFlowers);
          console.log('Total pages:', totalPages);
          console.log('Current page:', fetchedCurrentPage);
        } catch (error) {
          console.error('Error fetching flowers:', error);
        }
      }
    };
    fetchFlowers();
  }, [selectedShop, sortBy, currentPage]);

  const handleShopSelect = (shopId: string) => {
    setSelectedShop(shopId);
    setCurrentPage(1); // Reset pagination when shop changes
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset pagination when sort changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddToCart = (flower: Flower) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === flower._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === flower._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...flower, quantity: 1 }];
      }
    });
    alert(`Added ${flower.name} to cart!`);
  };

  const handleToggleFavorite = async (flowerId: string) => {
    try {
      const updatedFlower = await toggleFavorite(flowerId);
      setFlowers((prevFlowers) =>
        prevFlowers.map((flower) =>
          flower._id === updatedFlower._id ? updatedFlower : flower
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="shop-page">
      <div className="shops-sidebar">
        <h2>Shops:</h2>
        {shops.map((shop) => (
          <button
            key={shop._id}
            onClick={() => handleShopSelect(shop._id)}
            className={selectedShop === shop._id ? 'active' : ''}
          >
            {shop.name}
          </button>
        ))}
      </div>

      <div className="flowers-content">
        <div className="controls">
          <label htmlFor="sortBy">Sort by:</label>
          <select id="sortBy" value={sortBy} onChange={handleSortChange}>
            <option value="dateAdded">Date</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div className="flower-list">
          {flowers.map((flower) => (
            <div key={flower._id} className="flower-card">
              <img src={flower.image || './img/flowers-1.jpg'} alt={flower.name} />
              <div>
              <button onClick={() => handleToggleFavorite(flower._id)}>
                {flower.isFavorite ? '❤️' : '\u2661'}
              </button>
              <span className="flower-name">{flower.name}</span></div>
              <div>
              <span className="flower-price">${flower.price.toFixed(2)}</span>
              
              <button onClick={() => handleAddToCart(flower)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={currentPage === page}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
