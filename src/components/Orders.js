import { useEffect, useState } from "react";
import { URL } from "../properties";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(true);
  const [ordersOrginal, setOrdersOrginal] = useState(null);

  const [orderSearch, setOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerIdSearch, setCustomerIdSearch] = useState("");
  


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
        setOrdersOrginal(resp);
        clearAllSearch();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [refresh]);

  function handleDetails(orderId) {
    navigate("/orders/detils/" + orderId);
  }

  useEffect(()=>{
    if (ordersOrginal !== null) {
      const result = ordersOrginal.filter(
        (n) => 
        n.id.toString().includes(orderSearch) &&
        n.customerName.toLowerCase().includes(customerSearch) &&
        n.customerId.toString().includes(customerIdSearch)
      );
      setOrders(result);
    }},[orderSearch, customerSearch, customerIdSearch]);
  
function clearAllSearch(){
  document.getElementById("orderSearch").value = "";
  document.getElementById("customerSearch").value = "";
  document.getElementById("customerIdSearch").value = "";

  setCustomerSearch("");
  setOrderSearch("");
  setCustomerIdSearch("");
}

    function handleClearSearch(){
      clearAllSearch();
      setRefresh(!refresh);
    }

  async function handleCloseOrder(orderId) {
    if (window.confirm("Potwierdz wydanie zamowienia nr: " + orderId)) {
      const respond = await fetch(URL + "/order/close/" + orderId, {
        method: "POST",
        credentials: "include",
      });
      if (respond.status === 200) {
        alert("Wydano zamowienie: " + orderId);
        setRefresh(!refresh);

      } else {
        alert("Wydanie zamowienia nie powiodło się");
      }
    }
  }



  return (
    <div className="main_frame">
      <div className="title">
        <h3>AKTYWNE ZAMÓWIENIA</h3></div>
      <div>
        <table className="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>K#</th>
              <th>Klient</th>
              <th>LP</th>
              <th>Data Przyjęcia</th>
              <th>Na kiedy</th>
              <th>Cena</th>
              <th>Status</th>
              <th></th>
            </tr>
            <tr>
              <th>
                <input className="input_tag_search"
                  type="text"
                  id="orderSearch"
                  onChange={(e) => {
                    setOrderSearch(e.target.value.toLowerCase());
                  }}
                ></input>
              </th>
              <th>
              <input className="input_tag_search"
                  type="text"
                  id="customerIdSearch"
                  onChange={(e) => {
                    setCustomerIdSearch(e.target.value.toLowerCase());
                  }}
                ></input>
              </th>
              <th>
              <input className="input_comments_search"
                  type="text"
                  id="customerSearch"
                  onChange={(e) => {
                    setCustomerSearch(e.target.value.toLowerCase());
                  }}
                ></input>
              </th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th> 
                <button className="btn1" onClick={handleClearSearch}>WYCZYSC</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((item) => (
                <tr key={item.id}>
                  <th>{item.id}</th>
                  <th>{item.customerId}</th>
                  <th>{item.customerName}</th>
                  <th>{item.unitQtn}</th>
                  <th>{item.startingDate.toString().split("-").reverse().join("-")}</th>
                  <th>{item.planedFinishDate.toString().split("-").reverse().join("-")}</th>
                  <th>{item.price.toFixed(2)}</th>
                  <th>{
                    (item.ready && "DO WYDANIA")
                    || (!item.ready && "")
                  }</th>

                  <th className="tr-action">
                    <button className="btn1"
                      onClick={() => { handleDetails(item.id) }}>
                      SZCZEGOLY
                    </button>
                    {item.ready && <button className="btn1"
                      onClick={() => { handleCloseOrder(item.id) }}>
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
