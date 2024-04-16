import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { URL } from "../properties";

function ArchiveOrderDetails() {
  const navigate = useNavigate();
  const { idOrder } = useParams();
  const [order, setOrder] = useState(null);

  function handelBack() {
    navigate(-1);
  }

  useEffect(() => {
    fetch(URL + "/archive/order/" + idOrder, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setOrder(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>
      <div>Szczegoly zamowienia</div>
      {order && (
        <div>
          <div>ZAMOWINIE NR:{"  " + order.id} </div>
          <div>KLIENT: </div>
          <div>{order.customer.id + "  " + order.customer.name}</div>
          <div>{"  " + order.customer.addres}</div>
          <div>{"  " + order.customer.phone}</div>
          <div>CENA: {"  " + order.price}</div>
          <div>DATA PRZYJECIA: {"  " + order.startDate.toString().split("-").reverse().join("-")}</div>
          <div>
            DATA PLANOWANEGO ZAKONCZENIA: {"  " + order.planedFinishDate.toString().split("-").reverse().join("-")}
          </div>
          <div>DATA ODBIORU: {"  " + order.pickupDate.toString().split("-").reverse().join("-")}</div>

          <table className="styled-table">
            <thead>
              <tr>
                <th>ZAD ID</th>
                <th>TYP</th>
                <th>TAG</th>
                <th>UWAGI</th>
                <th>CENA JEDN</th>
                <th>WYK DNIA</th>
              </tr>
            </thead>
            <tbody>
              {order &&
                order.unitOrdersArchive.map((item) => (
                  <tr key={item.id}>
                    <th>{item.id}</th>
                    <th>{item.type.id + " " + item.type.descryption}</th>
                    <th>{item.tagLabel}</th>
                    <th>{item.comment}</th>
                    <th>{item.unitPrice.toFixed(2)}</th>
                    <th>{item.finishDate.toString().split("-").reverse().join("-")}</th>
                    
                    
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handelBack}>POWROT</button>
    </div>
  );
}
export default ArchiveOrderDetails;
