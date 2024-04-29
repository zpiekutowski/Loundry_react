import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../properties";

function AddUnitOrder() {
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState(null);
  const [idType, setIdType] = useState(null);
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
    if (idType === null || price.length === 0 || tag.length === 0) {
      alert("POPRAW");
    } else {
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
          if (resp !== null) {
            alert(Object.keys(resp) + " : " + Object.values(resp));
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }

  function handleBackButton() {
    navigate(-1);
  }

  return (
    <div className="main_frame">
      <div>
        <h3> Dodaj usługę</h3>
      </div>

      <div className="frame">
        <div className="left_frame">
          <div>
            <div className="intut-customer">
              <div className="title_form">Typ:</div>
              <div>{idType && idType + "  " + idTypeDescryption}</div>
            </div>
          </div>

          <div className="intut-customer">
            <div className="title_form">TAG:</div>
            <input
              maxLength={6}
              className="input_tag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            ></input>
          </div>
          <div className="intut-customer">
            <div className="title_form">Opis:</div>
            <textarea
              maxLength={100}
              className="input; input_comments "
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="intut-customer">
            <div className="title_form">CENA</div>
            <input
              className="input_price"
              type="number"
              min="0.00"
              max="4000.00"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <br />
          <div>
            <button className="btn" onClick={handleBackButton}>
              POWROT
            </button>
            <button className="btn" onClick={handleConfim}>
              OK
            </button>
          </div>
        </div>

        <div className="right_frame">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>OPIS</th>
                <th></th>
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
                        className="btn1"
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
        </div>
      </div>
    </div>
  );
}
export default AddUnitOrder;
