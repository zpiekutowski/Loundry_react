import { useState } from "react";
import { useEffect } from "react";
import {URL} from "../properties";


function Administration() {
  const [servedUnit, setServedUnit] = useState(null);

  const [id, setId] = useState("");
  const [descryption, setDescryption] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [editFlag, setEditFlag] = useState(false);

  useEffect(() => {
    fetch(URL + "/sunit/all")
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setServedUnit(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [refresh]);

  async function handlerAddServedUnit() {
    const servedUnit = { id, descryption };
    try {
      const result = await fetch(URL + "/sunit/add", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(servedUnit),
      });
      if (result.ok) {
        alert("Usluga zostala dodana");
        setRefresh((refresh) => !refresh);
        setDescryption("");
      } else {
        const body = await result.json();
        console.log(body);
        alert("Blad zapisu");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handlerRemoveService(id) {
    if (window.confirm("Czy chcesz usunac usluge?")) {
      try {
        const result = await fetch(URL + "/sunit/delete/" + id, {
          method: "DELETE",
        });
        if (result.ok) {
          alert("Poprawnie usunieto usluge");
          setRefresh((refresh) => !refresh);
        } else {
          alert("Blad usuniecia");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  function handlerEdit(id){
       setEditFlag(true);

       fetch(URL + "/sunit/"+id)
       .then((res) => {
         return res.json();
       })
       .then((resp) => {
         setId(resp.id)
         setDescryption(resp.descryption);
       })
       .catch((err) => {
         console.log(err.message);
       });
  }

function handlerEditCancelButton(){
    setId(0);
    setDescryption("");    
    setEditFlag(false);
}

async function handlerEditSubmitButton(){
    const servedUnit = {id,descryption};
    try {
        const result = await 
        fetch(URL + "/sunit/update/"+id, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(servedUnit),
        });
        if (result.ok) {
          alert("Usługa została zaktualizowana");
          setId(0);
          setDescryption("");
          setEditFlag(false);
          setRefresh(!refresh);
        } else {
          const body = await result.json();
          console.log(body);
          alert("Blad zapisu");
        }
      } catch (error) {
        console.log(error.message);
      }


}


  return (
    <div className="main_frame">
      
      
      { editFlag &&
        <div>
          <h3>EDYTUJ USLUGE:</h3>
          <div>
          {"ID: " + id}  
            <input className="input_su"
              type="text"
              value={descryption}
              onChange={(e) => setDescryption(e.target.value)}
            ></input>
            <button className="btn1" onClick={handlerEditSubmitButton}>ZAPISZ</button>
            <button className="btn1" onClick={handlerEditCancelButton}>CANCEL</button>
          </div>
        </div>
      }
      
      
      { !editFlag &&
        <div className="title">
          <h3>DODAJ USŁUGĘ:</h3>
          <div>
            <input className="input"
              type="text"
              value={descryption}
              onChange={(e) => setDescryption(e.target.value)}
            ></input>
            <button className="btn1" onClick={handlerAddServedUnit}>ZAPISZ</button>
          </div>
        </div>
      }

      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Opis</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {servedUnit &&
            servedUnit.map((item) => (
              <tr key={item.id}>
                <th>{item.id} </th>
                <th>{item.descryption} </th>
                <th>
                  <button className="btn1" onClick={()=>{handlerEdit(item.id)}}>Edycja</button>
                  <button className="btn1"
                    onClick={() => {
                      handlerRemoveService(item.id);
                    }}
                  >
                    Usun
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default Administration;
