import { useEffect, useState } from "react";
import { URL } from "../properties";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(true);

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
  }, [refresh]);

function handleDetails(orderId){
    navigate("/orders/detils/" + orderId);
}

async function handleCloseOrder(orderId){
  if (window.confirm("Potwierdz wydanie zamowienia nr: " + orderId)) {
    const respond = await fetch(URL + "/order/close/" + orderId,{
      method: "POST",
      credentials: "include",
      });
      const result = await respond.json();
      if (result.status === true) {
        alert("Wydano zamowienie: " + orderId);
        setRefresh(!refresh);

      } else {
        alert("Wydanie zamowienia nie powiodło się");
      }
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
