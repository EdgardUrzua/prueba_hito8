import formatCurrency from '../utils/formatcurrency';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Cart.module.css';

function Cart() {
  const { cart, addToCart, removeFromCart, deleteFromCart, total } = useCart();
  const { token } = useUser();
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    if (!token) {
      setMessage('Debes iniciar sesión o registrarte para pagar');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/checkouts', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ cart }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el checkout');
      }

      setMessage('Compra exitosa');
    } catch (error) {
      setMessage('Error en la compra: ' + error.message);
    }
  };

  return (
    <div className={styles['cart-container']}>
      <h2>Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div>
          {cart.map((pizza) => (
            <div key={pizza.id} className={styles['cart-item']}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={pizza.imagen}
                    className="img-fluid rounded-start"
                    alt={pizza.nombre}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{pizza.nombre}</h5>
                    <p className="card-text">
                      Precio por unidad: {formatCurrency(pizza.precio)}
                    </p>
                    <p className="card-text">
                      Precio total: {formatCurrency(pizza.precio * pizza.cantidad)}
                    </p>
                    <p className="card-text">Cantidad: {pizza.cantidad}</p>
                    <button
                      className={styles['cart-button']}
                      onClick={() => removeFromCart(pizza.id)}
                    >
                      -
                    </button>
                    <button
                      className={styles['cart-button']}
                      onClick={() => addToCart(pizza)}
                    >
                      +
                    </button>
                    <button
                      className={`${styles['cart-button']} ${styles['cart-button-danger']}`}
                      onClick={() => deleteFromCart(pizza.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {message && <p className={styles['cart-message']}>{message}</p>}
          <h3>Total: {formatCurrency(total)}</h3>
          <Link to="/" className="btn btn-outline-secondary">
            Seguir comprando
          </Link>
          <button className={styles['btn-success']} onClick={handleCheckout}>
            Pagar
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;


