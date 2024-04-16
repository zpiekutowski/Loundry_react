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
      fetch(URL + "new_order/remove_unit/" + id, {
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

    fetch(URL + "new_order/set_planed_finish_date", {
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
    fetch(URL + "new_order/set_is_paid/" + !order.isPaid, {
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
      
      fetch(URL + "/new_order/save_order?print=" + window.confirm("Drukować etykiety?"), {
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

  return (
    <div>
      {!activeOrderFlag && (
        <div>
          <p>BRAK AKTYWNEGO ZAMOWIENIA</p>
          <button onClick={handlerNewOrder}>Nowe zamowienie</button>
        </div>
      )}

      {activeOrderFlag && (
        <div>
          <p>SKLADANE ZAMOWIENIE:</p>
          <div>
            <button onClick={handleChooseCustomer}>KLIENT</button>
            <button onClick={handleAddUnitOrder}>DODAJ USLUGE</button>
          </div>
          <br />
          <div>
            <div>
              Data:{" "}
              {order &&
                order.startDate.toString().split("-").reverse().join("-")}{" "}
            </div>
            <div>
              Klient:
              {order && order.customer && order.customer.name}{" "}
            </div>
            <div>
              Adres:
              {order && order.customer && order.customer.addres}{" "}
            </div>
            <div>
              Telefon:
              {order && order.customer && order.customer.phone}{" "}
            </div>

            <table className="styled-table">
              <thead>
                <tr>
                  <th>Lp.</th>
                  <th>RODZAJ</th>
                  <th>TAG LABEL</th>
                  <th>UWAGI</th>

                  <th>Cena</th>
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
                      <th>{item.tag}</th>
                      <th>{item.comment}</th>

                      <th>{item.price.toFixed(2)}</th>

                      <th>
                        <button
                          onClick={() => {
                            handleRemoveUnit(item.rowNumber);
                          }}
                        >
                          Usun
                        </button>
                        <button
                          onClick={() => {
                            handelEditUnit(item.rowNumber);
                          }}
                        >
                          Edytuj
                        </button>
                      </th>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div>
              SUMA: {"  "}
              {order && order.price.toFixed(2)}{" "}
            </div>
            <div>
              <label>Data zakonczenia {"  "}</label>
              <input
                type="date"
                value={order && order.planedFinishDate}
                onChange={handlePlanedFinshDateChange}
              ></input>
            </div>
            <div style={{ display: "flex" }}>
              <label>Platnosc: {"  "}</label>
              <input
                type="checkbox"
                onChange={handleIsPay}
                checked={order && order.isPaid}
              ></input>
              <div>{order && order.isPaid === true && "ZAPLACONO"}</div>
              <div>
                {order && order.isPaid === false && "PLATNE PRZY ODBIORZE"}
              </div>
            </div>
            <div>
              <button onClick={handleCancelButton}>ANULUJ ZAMOWIENIE</button>
              <button onClick={handleSubmitOrder}>ZAKONCZ ZAMOWIENIE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default NewOrder;
