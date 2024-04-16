import { useState, useEffect } from "react";
import { URL } from "../properties";
import { useNavigate } from "react-router-dom";

function ArchiveOrders() {
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(URL + "/archive/page?page=" + 0 + "&size=" + 5, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setOrders(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  function handleDetails(orderId) {
    
    navigate("/archive/order/" + orderId);
  }

  return (
    <div>
      <div>Archiwum</div>
        <button>PREV</button>
        <button>NEXT</button> 

      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Klient</th>
            <th>Data Przyjęcia</th>
            <th>Data wydania</th>
            <th>Cena</th>
            <th>AKCJA</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((item) => (
              <tr key={item.id}>
                <th>{item.id}</th>
                <th>{item.customer}</th>
                <th>{item.startDate.toString().split("-").reverse().join("-")}</th>
                <th>{item.pickupDate.toString().split("-").reverse().join("-")}</th>
                <th>{item.price.toFixed(2)}</th>

                <th>
                  <button
                    onClick={() => {
                      handleDetails(item.id);
                    }}
                  >
                    SZCZEGOLY
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default ArchiveOrders;
