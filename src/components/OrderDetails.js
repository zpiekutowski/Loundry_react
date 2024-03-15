import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { URL } from "../properties";

function OrderDetails() {
  const { idOrder } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(URL + "/order/" + idOrder, {
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

  function handleBack() {
    navigate(-1);
  }

  return (
    <div>
      {order && (
        <div>
          <div>Zamowienie nr:{"  " + order.id}</div>
          <div>Planowany dzien wydania:{"  " + order.planedFinishDate
          .toString().split("-").reverse().join("-")}</div>
          <div>Zamownie z dnia: {"  " + order.startDate
          .toString().split("-").reverse().join("-")}</div>
          <div>Klient:{order.customer.id + " - " + order.customer.name} </div>
          <div> Adres: {order.customer.addres} </div>
          <div> Telefon: {order.customer.phone}</div>
          <div>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID.</th>
                  <th>RODZAJ</th>
                  <th>TAG LABEL</th>
                  <th>UWAGI</th>
                  <th>Cena</th>
                  <th>Data zakonczenia</th>
                  <th>AKCJA</th>
                </tr>
              </thead>
              <tbody>
                {order &&
                  order.unitOrders &&
                  order.unitOrders.map((item) => (
                    <tr key={item.id}>
                      <th>{item.id}</th>
                      <th>{item.type.id + " : " + item.type.descryption}</th>
                      <th>{item.tagLabel}</th>
                      <th>{item.comment}</th>
                      <th>{item.unitPrice.toFixed(2)}</th>
                      <th>{((item.finishDate === null) && "WTRAKCIE")
                      || (item.finishDate
                        .toString().split("-").reverse().join("-"))}</th>
                      <th>
                        <button>Edytuj</button>
                        <button>WYKONANE</button>
                      </th>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            SUMA:{order.price}
            <div>
              {(order.isPaid === true && "ZAPLACONO") ||
                (order.isPaid === false && "PLATNE PRZY ODBIORZE")}
            </div>
          </div>
          <div> {} </div>
        </div>
      )}
      <div>
        <button onClick={handleBack}>POWROT</button>
      </div>
    </div>
  );
}
export default OrderDetails;
