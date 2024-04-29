import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { URL } from "../properties";

function ArchiveOrderDetails() {
  const navigate = useNavigate();
  const { idOrder } = useParams();
  const [order, setOrder] = useState(null);

  function handleBack() {
    navigate(-1);
  }

  useEffect(() => {
    handleFetch();
  }, []);

  async function handleFetch() {
    try {
      const result = await fetch(URL + "/archive/order/" + idOrder, {
        method: "GET",
        credentials: "include",
      });
      if (result.status === 200) {
        const data = await result.json();
        setOrder(data);
      } else if (result.status === 204) {
        setOrder(null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="main_frame">
      {order === null && (
        <div>
          <h3>ZAMOWINIE NR:{"  " + idOrder}</h3>
          <h3>NIE ISTNIEJE</h3>
        </div>
      )}

      {order && (
        <div>
          <h3>ZAMOWINIE NR:{order.id} </h3>
          <div>KLIENT: </div>
          <div className="tilte_fill">
            <div className="title_form"></div>
            <div className="fill">
              {order.customer.id + "  " + order.customer.name}
            </div>
          </div>

          <div className="tilte_fill">
            <div className="title_form"></div>
            <div className="fill">{order.customer.addres}</div>
          </div>
          <div className="tilte_fill">
            <div className="title_form"></div>
            <div className="fill">{order.customer.phone}</div>
          </div>
          <div className="space"></div>
          <div className="tilte_fill">
            <div className="title_form">CENA:</div>
            <div className="fill">{order.price}</div>
          </div>
          <div className="space"></div>

          <div className="space"></div>
          <div className="tilte_fill">
            <div className="title_form1">DATA PRZYJECIA:</div>
            <div className="fill">
              {order.startDate.toString().split("-").reverse().join("-")}
            </div>
          </div>

          <div className="tilte_fill">
            <div className="title_form1">DATA PLANOWANA:</div>
            <div className="fill">
              {order.planedFinishDate.toString().split("-").reverse().join("-")}
            </div>
          </div>

          <div className="tilte_fill">
            <div className="title_form1">DATA ODBIORU:</div>
            <div className="fill">
              {order.pickupDate.toString().split("-").reverse().join("-")}
            </div>
          </div>

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
                    <th className="tr-comments">{item.comment}</th>
                    <th>{item.unitPrice.toFixed(2)}</th>
                    <th>
                      {item.finishDate
                        .toString()
                        .split("-")
                        .reverse()
                        .join("-")}
                    </th>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="btn" onClick={handleBack}>
        POWROT
      </button>
    </div>
  );
}
export default ArchiveOrderDetails;
