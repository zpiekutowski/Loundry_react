import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { URL } from "../properties";

function OrderDetails() {
  const { idOrder } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
  function handleReadyButton(id) {
    fetch(URL + "/unit_order/set_finish_date/" + id, {
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
        if (resp !== null && resp !== undefined) {
          alert(Object.keys(resp) + " : " + Object.values(resp));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function handlePrint() {
    try {
      const respond = await fetch(URL + "/order/print/" + idOrder, {
        method: "GET",
        credentials: "include",
      });
      
      if (respond.status === 200) {
        alert("Wydrukowano poprawnie");
      } else {
        alert("Blad wydruku");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="main_frame">
      {order && (
        <div>
          <h3>Zamowienie nr:{"  " + order.id}</h3>
          <div className="tilte_fill">
            <div className="title_form">Z dnia:</div>
            <div className="fill">
              {"  " + order.startDate.toString().split("-").reverse().join("-")}
            </div>
          </div>

          <div className="tilte_fill">
            <div className="title_form"> Na dzień:</div>
            <div className="fill">
              {order.planedFinishDate.toString().split("-").reverse().join("-")}
            </div>
          </div>
          <div className="tilte_fill">
            <div className="title_form">Klient:</div>
            <div className="fill">
              {order.customer.id + " - " + order.customer.name}{" "}
            </div>
          </div>
          <div className="tilte_fill">
            <div className="title_form">Adres:</div>
            <div className="fill"> {order.customer.addres} </div>
          </div>

          <div className="tilte_fill">
            <div className="title_form">Telefon:</div>
            <div className="fill">{order.customer.phone}</div>
          </div>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {order &&
                  order.unitOrders &&
                  order.unitOrders.map((item) => (
                    <tr key={item.id}>
                      <th>{item.id}</th>
                      <th>{item.type.id + " : " + item.type.descryption}</th>
                      <th>{item.tagLabel + " - " + 
                      item.tagLabelNo }</th>
                      <th className="tr-comments">{item.comment}</th>
                      <th>{item.unitPrice.toFixed(2)}</th>
                      <th>
                        {(item.finishDate === null && "WTRAKCIE") ||
                          (item.finishDate !== null &&
                            item.finishDate
                              .toString()
                              .split("-")
                              .reverse()
                              .join("-"))}
                      </th>
                      <th className="tr-action">
                        <button
                          className="btn1"
                          onClick={() => handleEditButton(item.id)}
                        >
                          EDYTUJ
                        </button>
                        {item.finishDate === null && (
                          <button
                            className="btn1"
                            onClick={() => handleReadyButton(item.id)}
                          >
                            WYKONANE
                          </button>
                        )}
                      </th>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="tilte_fill">
            <div className="title_form1">SUMA:</div>
            <div>{order.price.toFixed(2)}</div>
          </div>
          
          <div className="tilte_fill">
          <div className="title_form1"></div>
            {(order.isPaid === true && "ZAPŁACONO") ||
              (order.isPaid === false && "PŁATNE PRZY ODBIORZE")}
          </div>

          <div></div>
        </div>
      )}
      <div className="space"></div>
      <div>
        <button className="btn" onClick={handleBack}>
          POWROT
        </button>
        <button className="btn" onClick={handlePrint}>
          DRUKUJ
        </button>
      </div>
    </div>
  );
}
export default OrderDetails;
