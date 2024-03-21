import { useEffect, useState } from "react";
import { URL } from "../properties";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(URL + "/order/all", {
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

function handleDetails(orderId){
    navigate("/orders/detils/" + orderId);
}

function handleCloseOrder(orderId){
  if (window.confirm("Potwierdz wydanie zamowienia")) {
      console.log("Wydawanie zamowienia");

  }
}


  return (
    <div>
      <div>AKTYWNE ZAMOWIENIA</div>
      <div>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Klient</th>
              <th>Ilosc pozycji</th>
              <th>Data Przyjęcia</th>
              <th>Na kiedy</th>
              <th>Cena</th>
              <th>Status</th>
              <th>AKCJA</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((item) => (
                <tr key={item.id}>
                  <th>{item.id}</th>
                  <th>{item.customerName}</th>
                  <th>{item.unitQtn}</th>
                  <th>{item.startingDate}</th>
                  <th>{item.planedFinishDate}</th>
                  <th>{item.price.toFixed(2)}</th>
                  <th>{
                  (item.ready && "DO WYDANIA")
                  ||(!item.ready && "WTRAKCIE")
                   }</th>
                  
                  <th>
                    <button onClick={()=>{handleDetails(item.id)}}>
                      SZCZEGOLY
                    </button>
                    {item.ready && <button onClick={()=>{handleCloseOrder(item.id)}}>
                      WYDAJ
                    </button>}
                                        
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Orders;
