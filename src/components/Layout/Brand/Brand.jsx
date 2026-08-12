import { Link } from 'react-router-dom';

import logo from '../../../assets/logo.svg';
import { ROUTES } from '../../../constants/routes';
import styles from './Brand.module.css';

export default function Brand() {
  return (
    <Link className={styles.brand} to={ROUTES.analytics} aria-label="Northstar analytics home">
      <span className={styles.mark}>
        <img src={logo} alt="" />
      </span>
      <span>
        <strong>Northstar</strong>
        <small>Business intelligence</small>
      </span>
    </Link>
  );
}
