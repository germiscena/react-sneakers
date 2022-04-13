import React from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer/index';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AppContext from './context';
import Orders from './pages/Orders';

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [cartOpened, setCartOpened] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [favorites, setFavorites] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      const cartResponse = await axios.get('https://6231db6b59070d92733cb82a.mockapi.io/cart');
      const favoritesResponse = await axios.get(
        'https://6231db6b59070d92733cb82a.mockapi.io/favorites',
      );
      const itemsResponse = await axios.get('https://6231db6b59070d92733cb82a.mockapi.io/items');
      setIsLoading(false);

      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setItems(itemsResponse.data);
    }
    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
    if (findItem) {
      setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
      axios.delete(`https://6231db6b59070d92733cb82a.mockapi.io/cart/${findItem.id}`);
    } else {
      const { data } = await axios.post('https://6231db6b59070d92733cb82a.mockapi.io/cart', obj);
      setCartItems((prev) => [...prev, data]);
    }
  };

  const onAddToFavorite = async (obj) => {
    if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
      axios.delete(`https://6231db6b59070d92733cb82a.mockapi.io/favorites/${obj.id}`);
      setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
    } else {
      const { data } = await axios.post(
        'https://6231db6b59070d92733cb82a.mockapi.io/favorites',
        obj,
      );
      setFavorites((prev) => [...prev, data]);
    }
  };

  const onRemoveItem = (id) => {
    axios.delete(`https://6231db6b59070d92733cb82a.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        setCartOpened,
        cartItems,
        favorites,
        items,
        isItemAdded,
        onAddToFavorite,
        setCartItems,
        onAddToCart,
      }}>
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />
        <Header onClickCart={() => setCartOpened(true)} />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
              />
            }
          />
          <Route
            exact
            path="/favorites"
            element={<Favorites onAddToFavorite={onAddToFavorite} />}
          />

          <Route exact path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
