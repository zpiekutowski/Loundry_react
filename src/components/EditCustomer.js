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
    <div>
      <div>
        <p>Nowy Klient</p>
        <form>
          <div>
            <label>ID</label>
            <input type="text" value={id} disabled="disabled"></input>
          </div>

          <div>
            <label>Nazwa</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>

          <div>
            <label>Adres</label>
            <input
              type="text"
              value={addres}
              onChange={(e) => setAddres(e.target.value)}
            ></input>
          </div>
          <div>
            <label>Telefon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></input>
          </div>
        </form>
        <div>
          <button onClick={() => navigate(-1)}>Powrot</button>
          <button onClick={handlerSubmit}>SUBMIT</button>
        </div>
      </div>
    </div>
  );
}
export default EditCustomer;
