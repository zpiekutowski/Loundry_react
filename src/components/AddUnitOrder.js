import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../properties";

function AddUnitOrder() {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState(null);
  const [idType, setIdType] = useState();
  const [idTypeDescryption, setIdTypeDescryption] = useState("");
  const [tag, setTag] = useState("");
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch(URL + "/sunit/all", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setOrderType(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  function handleSelect(id, descryption) {
    setIdType(id);
    setIdTypeDescryption(descryption);
  }

  function handleConfim() {
    const orderUnit = {
      type: { id: idType, descryption: idTypeDescryption },
      tag,
      comment,
      price,
    };

    fetch(URL + "/new_order/add_unit", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(orderUnit),
    })
      .then((res) => {
        if (res.status === 200) {
          navigate(-1);
          return null;
        } else if (res.status === 400) {
          return res.json();
        }
      })
      .then((resp) => {
        if(resp !== null){
        alert(Object.keys(resp) + " : " + Object.values(resp));
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function handleBackButton() {
    navigate(-1);
  }

  return (
    <div>
      <p> Dodaj usluge</p>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>OPIS</th>
            <th>WYBIERZ</th>
          </tr>
        </thead>
        <tbody>
          {orderType &&
            orderType.map((item) => (
              <tr key={item.id}>
                <th>{item.id}</th>
                <th>{item.descryption}</th>
                <th>
                  <button
                    onClick={() => {
                      handleSelect(item.id, item.descryption);
                    }}
                  >
                    Wybierz
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>

      <div>
        <div>
          Typ zamowienia:
          <input
            type="text"
            disabled
            value={idType && idType + "  " + idTypeDescryption}
          ></input>
        </div>
      </div>
      <div>
        <div>
          <label>TAG:</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          ></input>
        </div>
        <div>
          <label>UWAGI OPIS</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></input>
        </div>
        <div>
          <label>CENA</label>
          <input
            type="number"
            min="0.00"
            max="1000.00"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <br />
      <div>
        <button onClick={handleBackButton}>POWROT</button>
        <button onClick={handleConfim}>POTWIERDZ</button>
      </div>
    </div>
  );
}
export default AddUnitOrder;
