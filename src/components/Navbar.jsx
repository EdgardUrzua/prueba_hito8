import styles from "../styles/Navbar.module.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import formatCurrency from "../utils/formatcurrency";

function Navbar() {
  const { token, logout } = useUser();
  const { total } = useCart();

  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-container']}>
        
        <Link className={styles['navbar-brand']} to="/">
          🍕 Home
        </Link>

        <div className={styles['nav-links']}>
          <ul>
            {token ? (
              <>
                <li>
                  <Link className={styles['nav-link']} to="/profile">
                    🔓 Profile
                  </Link>
                </li>
                <li>
                  <button className={styles['nav-link']} onClick={logout}>
                    🔒 Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className={styles['nav-link']} to="/login">
                    🔐 Login
                  </Link>
                </li>
                <li>
                  <Link className={styles['nav-link']} to="/register">
                    🔐 Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <Link to="/cart" className={styles['cart-button']}>
          <button className={styles['btn-outline-primary']}>
            🛒 {formatCurrency(total)}
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

