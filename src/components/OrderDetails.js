import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { URL } from "../properties";

function OrderDetails() {
  const { idOrder } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [refresh, setRefresh] =  useState(false);

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
    }, [refresh]);

  function handleBack() {
    navigate(-1);
  }

  function handleEditButton(id) {
    navigate("/orders/edit_unit_order/" + id);
  }
  function handleReadyButton(id){
    fetch(URL + "/unit_order/set_finish_date/"+id, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setRefresh(!refresh);
        } else {
          return res.json();
        }
      })
      .then((resp) => {
         if(resp !== null && resp !== undefined){
        alert(Object.keys(resp) + " : " + Object.values(resp));
        }
      })
      .catch((err) => {
         console.log(err);
      });
  }


  return (
    <div>
      {order && (
        <div>
          <div>Zamowienie nr:{"  " + order.id}</div>
          <div>
            Zamownie z dnia:{" "}
            {"  " + order.startDate.toString().split("-").reverse().join("-")}
          </div>
          
          <div>
            Planowany dzien wydania:
            {"  " +
              order.planedFinishDate.toString().split("-").reverse().join("-")}
          </div>
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
                      <th>
                        {(item.finishDate === null && "WTRAKCIE") ||
                         (item.finishDate !== null && item.finishDate
                            .toString()
                            .split("-")
                            .reverse()
                            .join("-"))}
                      </th>
                      <th>
                        <button onClick={() => handleEditButton(item.id)}>
                          Edytuj
                        </button>
                        {item.finishDate === null && <button onClick={() => handleReadyButton(item.id)}>
                          WYKONANE
                        </button>}
                      </th>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            SUMA:{order.price.toFixed(2)}
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
