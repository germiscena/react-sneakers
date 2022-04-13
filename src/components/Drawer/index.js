import Info from '../info';
import React from 'react';
import axios from 'axios';
import { useCard } from '../../hooks/useCard';
import styles from './Drawer.module.scss';

const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));

function Drawer({ onClose, onRemove, items = [], opened }) {
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [orderId, setOrderId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { cartItems, setCartItems, totalPrice } = useCard();

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post('https://6231db6b59070d92733cb82a.mockapi.io/orders', {
        items: cartItems,
      });
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);

      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete('https://6231db6b59070d92733cb82a.mockapi.io/cart/' + item.id);
        await delay;
      }
    } catch (error) {
      alert('hello');
    }
    setIsLoading(false);
  };
  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
      <div className={styles.drawer}>
        <h2 className="mb-30 d-flex justify-between">
          Корзина
          <img
            className="removeBtn  cu-p"
            src="/img/btn-remove.svg"
            alt="Remove"
            onClick={onClose}
          />
        </h2>

        {items.length > 0 ? (
          <div className="d-flex flex-column flex">
            <div className="items">
              {items.map((obj) => (
                <div key={obj.id} className="cartItem d-flex align-center mb-20">
                  <div
                    style={{ backgroundImage: `url(${obj.imageUrl})` }}
                    className="cartItemImg"></div>
                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} руб.</b>
                  </div>
                  <img
                    onClick={() => onRemove(obj.id)}
                    className="removeBtn"
                    src="/img/btn-remove.svg"
                    alt="Remove"
                  />
                </div>
              ))}
            </div>
            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice}руб.</b>
                </li>
                <li>
                  <span>Налог 5%:</span>
                  <div></div>
                  <b>{Math.round((totalPrice / 100) * 5)} руб.</b>
                </li>
              </ul>
              <button className="greenButton" disabled={isLoading} onClick={onClickOrder}>
                Оформить заказ
                <img src="/img/arrow.svg" alt="arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderComplete ? `Заказ номер ${orderId}  оформлен` : 'Корзина пустая'}
            description={
              isOrderComplete
                ? 'Ожидайте. Курьер скоро с Вами свяжется'
                : 'Добавьте хотя бы одну пару кроссовок!'
            }
            image={isOrderComplete ? '/img/order.jpg' : '/img/empty-cart.jpg'}
          />
        )}
      </div>
    </div>
  );
}
export default Drawer;
