import { Link } from "react-router-dom";

function Header_main() {
  return (
    <div> 
    <div className="header">
      <ul>
        <li>
          <Link to="/laundry">Home</Link>
        </li>

        <li>
          <Link to="/new_order">Nowe Zamowienie</Link>
        </li>
        <li>
          <Link to="/orders">Zamówienia</Link>
        </li>
        <li>
          <Link to="/orders/units">Zadania</Link>
        </li>
        <li>
          <Link to="/customer">Klienci</Link>
        </li>
        <li>
          <Link to="/archive">Archiwum</Link>
        </li>
        <li>
          <Link to="/admin">Administracja</Link>
        </li>

      </ul>
    </div>
    <div className="background_header"></div>
    </div>
  );
}
export default Header_main;
