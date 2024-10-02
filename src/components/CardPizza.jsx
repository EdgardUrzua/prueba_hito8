import { useCart } from "../context/CartContext";
import styles from "../styles/CardPizza.module.css";
import PropTypes from 'prop-types';

function CardPizza({ id, nombre, descripcion, precio, imagen, ingredientes }) {
  const { addToCart } = useCart();

  return (
    <div className={styles.card}>
      <img src={imagen} className={styles['card-img-top']} alt={nombre} />
      <div className={styles['card-body']}>
        <h5 className={styles['card-title']}>{nombre}</h5>
        <p className={styles['card-text']}>Descripción: {descripcion}</p>
        <p className={styles['card-text']}>Ingredientes: {ingredientes.join(", ")}</p>
        <p className={styles['card-text']}>${precio}</p>
        <button className="btn btn-dark" onClick={() => addToCart({ id, nombre, precio, imagen })}>
          🛒 Añadir
        </button>
      </div>
    </div>
  );
}

CardPizza.propTypes = {
  id: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
  precio: PropTypes.number.isRequired,
  imagen: PropTypes.string.isRequired,
  ingredientes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default CardPizza;
