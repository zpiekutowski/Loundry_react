import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { URL } from "../properties";

function EditUnitOrderInProgres() {
  const { idUnitOrder } = useParams();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState(null);

  const [idType, setIdType] = useState();
  const [idTypeDescryption, setIdTypeDescryption] = useState("");
  const [tagLabel, setTagLabel] = useState("");
  const [tagLabelNo, setTagLabelNo] = useState("");
  const [comment, setComment] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [finishDate, setFinishDate] = useState("");

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

    fetch(URL + "/unit_order/" + idUnitOrder, {
      method: "GET",
      credentials: "include",
    })
      .then((respond) => {
        return respond.json();
      })
      .then((respond) => {
        setIdType(respond.type.id);
        setIdTypeDescryption(respond.type.descryption);
        setTagLabel(respond.tagLabel);
        setTagLabelNo(respond.tagLabelNo);
        setComment(respond.comment);
        setUnitPrice(respond.unitPrice);
        setFinishDate(respond.finishDate);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  function handleSubmit() {
    if (window.confirm("Potwiedz edycje zamowienia")) {
      const orderUnit = {
        id: idUnitOrder,
        type: { id: idType, descryption: idTypeDescryption },
        tagLabel,
        tagLabelNo,
        comment,
        unitPrice,
        finishDate,
      };
      fetch(URL + "/unit_order/save", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(orderUnit),
      })
        .then((res) => {
          if (res.status === 200) {
            navigate(-1);
          } else if (res.status === 400) {
            return res.json();
          }
        })
        .then((resp) => {
          if (resp !== null && resp !== undefined) {
            alert(Object.keys(resp) + " : " + Object.values(resp));
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }

  function handleESC() {
    navigate(-1);
  }
  function handleSelect(id, descryption) {
    setIdType(id);
    setIdTypeDescryption(descryption);
  }

  return (
    <div className="main_frame">
      <div>
        <h3> Edycja zadanie nr: {idUnitOrder} </h3>
      </div>
      <div className="frame">

        <div className="left_frame">
          <div className="intut-customer">
            <div className="title_form">Typ:</div>
            <div>{idType && idType + "  " + idTypeDescryption}</div>
          </div>

          <div>
            <div className="intut-customer">
              <div className="title_form">TAG:</div>
              <input
                maxLength={3}
                className="input_tag"
                type="text"
                value={tagLabel}
                onChange={(e) => setTagLabel(e.target.value)}
              ></input>
              <input
                maxLength={5}
                className="input_tag"
                type="text"
                value={tagLabelNo}
                onChange={(e) => setTagLabelNo(e.target.value)}
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
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
              />
            </div>
          </div>
          <br />
          <div>
            <button className="btn" onClick={handleESC}>
              POWROT
            </button>
            <button className="btn" onClick={handleSubmit}>
              ZAPISZ
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
                      <button className="btn1"
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
export default EditUnitOrderInProgres;
