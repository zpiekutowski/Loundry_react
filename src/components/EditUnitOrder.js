import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { URL } from "../properties";

function EditUnitOrder() {
  const { idRow } = useParams();
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

    fetch(URL + "/new_order/get_unit_order_DTO/" + idRow, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setIdType(resp.type.id);
        setIdTypeDescryption(resp.type.descryption);
        setTag(resp.tag);
        setComment(resp.comment);
        setPrice(resp.price);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  function handleBackButton() {
    navigate(-1);
  }

  function handleSelect(id, descryption) {
    setIdType(id);
    setIdTypeDescryption(descryption);
  }

  function handleConfim() {
    const orderUnit = {
      rowNumber: idRow,
      type: { id: idType, descryption: idTypeDescryption },
      tag,
      comment,
      price,
    };
    fetch(URL + "/new_order/edit_unit_order_DTO", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(orderUnit),
    })
      .then((res) => {
        if (res.status === 200) {
          navigate(-1);
        }
        else if(res.status === 400){
          return res.json(); 
         }
       })
       .then((resp)=>{
        
        if(resp !== null){
          alert(Object.keys(resp) + " : " + Object.values(resp));
        }

      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <div>
      <p> Edytuj usługę</p>

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
            step="1"
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
export default EditUnitOrder;
