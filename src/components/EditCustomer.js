import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { URL } from "../properties";

function EditCustomer() {
  const { custId } = useParams();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [addres, setAddres] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(URL + "/customer/" + custId)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setId(resp.id);
        setName(resp.name);
        setAddres(resp.addres);
        setPhone(resp.phone);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  async function handlerSubmit() {
    const customer = { id, name, addres, phone };
    try {
      const result = await fetch(URL + "/customer/update/" + custId, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(customer),
      });
      if (result.ok) {
        alert("Klien zostal zautualizowany");
        navigate(-1);
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
      <div className="title">
        <h3>Nowy Klient</h3>
        <form>

        <div className="intut-customer">
            <div className="title_form">ID {" - "} {id}</div>
            
          </div>

          <div className="intut-customer">
            <div className="title_form">Nazwa</div>
            <input className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>

          <div className="intut-customer">
            <div className="title_form">Adres</div>
            <input className="input"
              type="text"
              value={addres}
              onChange={(e) => setAddres(e.target.value)}
            ></input>
          </div>
          <div className="intut-customer">
            <div className="title_form">Telefon</div>
            <input className="input"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></input>
          </div>
        </form>
        <div className="space"></div>
        <div>
          <button className="btn" onClick={() => navigate(-1)}>Powrot</button>
          <button className="btn" onClick={handlerSubmit}>OK</button>
        </div>
      </div>
    </div>
  );
}
export default EditCustomer;
