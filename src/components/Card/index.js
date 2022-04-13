import React from 'react';
import styles from './Card.module.scss';
import ContentLoader from 'react-content-loader';
import AppContest from '../../context';

function Card({
  id,
  onFavorite,
  title,
  imageUrl,
  price,
  onPlus,
  favorited = false,
  added = false,
  loading = false,
}) {
  const { isItemAdded } = React.useContext(AppContest);
  const [isFavorite, setIsFavorite] = React.useState(favorited);
  const obj = { id, parentId: id, title, imageUrl, price };

  const onClickPlus = () => {
    onPlus(obj);
  };

  const onClickFavorite = () => {
    onFavorite(obj);
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.card}>
      {loading ? (
        <ContentLoader
          speed={1}
          width={210}
          height={260}
          viewBox="0 0 210 260"
          backgroundColor="#f2f2f2"
          foregroundColor="#fcfcfc">
          <rect x="6" y="36" rx="10" ry="10" width="150" height="91" />
          <rect x="6" y="143" rx="3" ry="3" width="150" height="15" />
          <rect x="6" y="162" rx="3" ry="3" width="93" height="15" />
          <rect x="6" y="199" rx="8" ry="8" width="80" height="24" />
          <rect x="124" y="191" rx="8" ry="8" width="32" height="32" />
        </ContentLoader>
      ) : (
        <>
          <div className={styles.favorite} onClick={onFavorite}>
            {onFavorite && (
              <img
                src={isFavorite ? '/img/heart-liked.svg' : '/img/heart-unliked.svg'}
                onClick={onClickFavorite}
                alt="unliked"
              />
            )}
          </div>
          <img width={133} height={112} src={imageUrl} alt="sneakers" />
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена</span>
              <b>{price} руб.</b>
            </div>
            {onPlus && (
              <img
                className={styles.plus}
                onClick={onClickPlus}
                src={isItemAdded(id) ? '/img/btn-checked.svg' : '/img/btn.svg'}
                alt="Plus"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
export default Card;
