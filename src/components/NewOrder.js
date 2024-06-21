import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { URL } from "../properties";

function NewOrder() {
  const navigate = useNavigate();
  const [activeOrderFlag, setActiveOrderFlag] = useState(false);
  const [order, setOrder] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [palnedFinishDate, setPlanedfinishDate] = useState(null);

  useEffect(() => {
    setOrder(null);
    fetch(URL + "/new_order/current", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setActiveOrderFlag(true);
          return res.json();
        } else if (res.status === 204) {
          setActiveOrderFlag(false);
        } else {
          throw new Error("Status error");
        }
      })
      .then((resp) => {
        setOrder(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [refresh]);

  function handlerNewOrder() {
    fetch(URL + "/new_order/new", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setActiveOrderFlag(true);
          setRefresh(!refresh);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  function handleCancelButton() {
    fetch(URL + "/new_order/cancel_order", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setActiveOrderFlag(false);
          setRefresh(!refresh);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function handleChooseCustomer() {
    navigate("/new_order/set_customer");
  }

  function handleAddUnitOrder() {
    navigate("/new_order/add_unit_order");
  }

  function handleRemoveUnit(id) {
    if (window.confirm("Czy chcesz usunac pozycje?")) {
      fetch(URL + "/new_order/remove_unit/" + id, {
        method: "POST",
        credentials: "include",
      })
        .then((res) => {
          if (res.status === 200) {
            setRefresh(!refresh);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }
  function handelEditUnit(idRow) {
    navigate("/new_order/edit_unit_order/" + idRow);
  }

  function handlePlanedFinshDateChange(event) {
    const date = { date: event.target.value };

    fetch(URL + "/new_order/set_planed_finish_date", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(date),
    })
      .then((res) => {
        if (res.status === 200) {
          setRefresh(!refresh);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function handleIsPay() {
    fetch(URL + "/new_order/set_is_paid/" + !order.isPaid, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setRefresh(!refresh);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function handleSubmitOrder() {
    if (Object.keys(order.unitOrders).length === 0 || order.customer === null) {
      alert("Zamowienie nie jest kompletne");
    } else {
      fetch(
        URL +
          "/new_order/save_order?print=" +
          window.confirm("Drukować etykiety?"),
        {
          method: "POST",
          credentials: "include",
        }
      )
        .then((res) => {
          if (res.status === 200) {
            setRefresh(!refresh);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }

  return (
    <div className="main_frame">
      {!activeOrderFlag && (
        <div className="title">
          <h3>BRAK AKTYWNEGO ZAMÓWIENIA</h3>
          <button className="btn" onClick={handlerNewOrder}>
            NOWE ZAMÓWIENIE
          </button>
        </div>
      )}

      {activeOrderFlag && (
        <div className="title">
          <h3>SKŁADANIE ZAMÓWIENIA</h3>
          <div>
            <button className="btn" onClick={handleChooseCustomer}>
              KLIENT
            </button>
            <button className="btn" onClick={handleAddUnitOrder}>
              DODAJ USŁUGĘ
            </button>
          </div>
          <br />
          <div>
            <div>
              <div className="tilte_fill">
                <div className="title_form">Data: </div>
                <div className="fill">
                  {order &&
                    order.startDate
                      .toString()
                      .split("-")
                      .reverse()
                      .join("-")}{" "}
                </div>
              </div>
            </div>

            <div className="tilte_fill">
              <div className="title_form">Klient:</div>
              <div className="fill">
                {order && order.customer && order.customer.name}{" "}
              </div>
            </div>
            <div className="tilte_fill">
              <div className="title_form">Adres:</div>

              <div className="fill">
                {order && order.customer && order.customer.addres}{" "}
              </div>
            </div>
            <div className="tilte_fill">
              <div className="title_form"> Telefon:</div>

              <div className="fill">
                {order && order.customer && order.customer.phone}{" "}
              </div>
            </div>

            <table className="styled-table">
              <thead>
                <tr>
                  <th>Lp.</th>
                  <th>RODZAJ</th>
                  <th>TAG LABEL</th>
                  <th>UWAGI</th>

                  <th>CENA</th>
                  <th>AKCJA</th>
                </tr>
              </thead>
              <tbody>
                {order &&
                  order.unitOrders &&
                  order.unitOrders.map((item) => (
                    <tr key={item.rowNumber}>
                      <th>{item.rowNumber}</th>
                      <th>{item.type.id + " : " + item.type.descryption}</th>
                      <th>{item.tag + " - " + item.tagNo}</th>
                      <th className="tr-comments">{item.comment}</th>

                      <th>{item.price.toFixed(2)}</th>

                      <th>
                        <button
                          className="btn1"
                          onClick={() => {
                            handleRemoveUnit(item.rowNumber);
                          }}
                        >
                          USUŃ
                        </button>
                        <button
                          className="btn1"
                          onClick={() => {
                            handelEditUnit(item.rowNumber);
                          }}
                        >
                          EDYTUJ
                        </button>
                      </th>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="tilte_fill">
              <div className="title_form1">SUMA:</div>
              <div className="">{order && order.price.toFixed(2)}</div>
            </div>

            <div className="tilte_fill">
              <div className="title_form1">Data zakonczenia: {"  "}</div>
              <input
                type="date"
                value={order && order.planedFinishDate}
                onChange={handlePlanedFinshDateChange}
              ></input>
            </div>
            <div className="tilte_fill">
              <div className="title_form1">Płatność:</div>
              <input 
                type="checkbox"
                onChange={handleIsPay}
                checked={order && order.isPaid}
              ></input>
              <div>{order && order.isPaid === true && "ZAPŁACONO"}</div>
              <div>
                {order && order.isPaid === false && "PŁATNE PRZY ODBIORZE"}
              </div>
            </div>
            <div className="space"></div>
            <div>
              <button className="btn" onClick={handleCancelButton}>
                ANULUJ ZAMÓWIENIE
              </button>
              <button className="btn" onClick={handleSubmitOrder}>
                ZAKOŃCZ ZAMÓWIENIE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default NewOrder;
