import { Link } from "react-router-dom";

function Header_main() {
  return (
    <div className="header">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/new_order">Nowe Zamowienie</Link>
        </li>
        <li>
          <Link to="/orders">Zamowienia</Link>
        </li>
        <li>
          <Link to="/orders/units">Zlecenia</Link>
        </li>
        <li>
          <Link to="/customer">Klienci</Link>
        </li>
        <li>
          <Link to="/admin">Administracja</Link>
        </li>

      </ul>
    </div>
  );
}
export default Header_main;
