import { useState } from "react";
import { useEffect } from "react";
import { URL } from "../properties";
import { useNavigate } from "react-router-dom";

function UnitOrders() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const [unitOrders, setUnitOrders] = useState(null);
  const [unitOrdersFiltered, setUnitOrdersFiltered] = useState(null);

  const [readyNotDisplay, setReadyNotDisplay] = useState(false);
  const [labelSearch, setLabelSearch] = useState("");
  const [commentSearch, setCommentSearch] = useState("");
  const [pickUpDateSearch, setPickUpDateSearch] = useState("");

  useEffect(() => {
    fetch(URL + "/unit_order/all", {
      method: "GET",
      credentials: "include",
    })
      .then((respond) => {
        return respond.json();
      })
      .then((respond) => {
        setUnitOrders(respond);
        setUnitOrdersFiltered(respond);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  async function handleSearch() {
    console.log(readyNotDisplay);
    console.log(pickUpDateSearch);
    console.log(commentSearch);
    console.log(labelSearch);
    const comparisionDate = new Date(pickUpDateSearch);
    const result = await unitOrders.filter(
        (n) =>
          (!readyNotDisplay || n.finishDate === null) 
          && n.tagLabel.toLowerCase().includes(labelSearch) 
          && n.comment.toLowerCase().includes(commentSearch) 
          && ((pickUpDateSearch === "") || ((new Date(n.pickUpDate)) <= comparisionDate))
      )
    console.log(result);
    await setUnitOrdersFiltered(result);
    }

  function handleClearSearch(){
    document.getElementById("tagLabel").value = "";  
    document.getElementById("pickUpDate").value = "";  
    document.getElementById("comment").value = "";  
    document.getElementById("readyCheck").checked = false; 
    setReadyNotDisplay(false);
    setLabelSearch("");
    setCommentSearch("");
    setPickUpDateSearch(""); 
 
    handleSearch();
    }

  function handleReadyOrderCheck() {
    if (document.getElementById("readyCheck").checked) {
      setReadyNotDisplay(true);
    } else {
      setReadyNotDisplay(false);
    }
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

  return (
    <div>
      <div>ZADANIA</div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID.</th>
            <th>RODZAJ</th>
            <th>TAG LABEL</th>
            <th>UWAGI</th>
            <th>Cena</th>
            <th>Data wykonania</th>
            <th>Wydanie Dnia</th>
            <th>AKCJA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th></th>
            <th>FILTRY</th>
            <th>
              <input
                type="text"
                id="tagLabel"
                onChange={(e) => {
                  setLabelSearch(e.target.value.toLowerCase());
                }}
              ></input>
            </th>
            <th>
              <input
                type="text"
                id="comment"
                onChange={(e) => setCommentSearch(e.target.value.toLowerCase())}
              ></input>
            </th>
            <th></th>
            <th>
              <input
                id="readyCheck"
                type="checkbox"
                onChange={handleReadyOrderCheck}
              ></input>
            </th>
            <th>
              <input
                type="date"
                id="pickUpDate"
                onChange={(e) => setPickUpDateSearch(e.target.value)}
              ></input>
            </th>
            <th>
              <button onClick={handleSearch}>SZUKAJ</button>
              <button onClick={handleClearSearch}>WYCZYSC</button>
            </th>
          </tr>

          {unitOrdersFiltered &&
            unitOrdersFiltered.map((item) => (
              <tr key={item.id}>
                <th>{item.id}</th>
                <th>{item.type.id + " : " + item.type.descryption}</th>
                <th>{item.tagLabel}</th>
                <th>{item.comment}</th>
                <th>{item.price.toFixed(2)}</th>
                <th>
                  {(item.finishDate === null && "WTRAKCIE") ||
                    (item.finishDate !== null &&
                      item.finishDate
                        .toString()
                        .split("-")
                        .reverse()
                        .join("-"))}
                </th>
                <th>
                  {item.pickUpDate.toString().split("-").reverse().join("-")}
                </th>
                <th>
                  <button onClick={() => handleEditButton(item.id)}>
                    Edytuj
                  </button>
                  {item.finishDate === null && (
                    <button onClick={() => handleReadyButton(item.id)}>
                      WYKONANE
                    </button>
                  )}
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default UnitOrders;
