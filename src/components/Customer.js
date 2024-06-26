import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {URL} from "../properties";


function Customer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState(null);
  const [refresh, setRefresh] = useState(false);

  function handlerAddCustomer() {
    navigate("/customer/add");
  }

  function handlerEditCustomer(id) {
    navigate("/customer/edit/" + id);
  }

  function handlerClearSearch() {
    setSearch("");
    setRefresh((refresh) => !refresh);
  }

  function handlerSearch() {
    fetch(URL + "/customer/find?find=" + search)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setCustomers(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function handlerDeleteCustomer(id) {
    if (window.confirm("Czy chcesz usunac klienta?")) {
      try {
        const result = await fetch(
          URL + "/customer/delete/" + id,
          {
            method: "DELETE",
          }
        );
        if (result.ok) {
          alert("Poprawnie usunieto klinta");
          setRefresh((refresh) => !refresh);
        } else {
          const res = await result.json();
          alert("Nie mozna usunac klienta: "+ res.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  useEffect(() => {
    fetch(URL + "/customer/all")
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setCustomers(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [refresh]);

  return (
    <div className="main_frame">
      <div className="title">
        <h3>MENU KLIENTA </h3> </div>
      <div style={{ display: "flex" }}>
        <button className="btn1"
         onClick={handlerAddCustomer}>DODAJ KLIENTA</button>
        <input className="input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button className="btn1" onClick={handlerSearch}>SZUKAJ</button>
        <button className="btn1" onClick={handlerClearSearch}>WYCZYŚĆ</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nazwa</th>
            <th>Addres</th>
            <th>Telefon</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {customers &&
            customers.map((item) => (
              <tr key={item.id}>
                <th>{item.id}</th>
                <th>{item.name}</th>
                <th>{item.addres}</th>
                <th>{item.phone}</th>
                <th>
                  <button className="btn1"
                    onClick={() => {
                      handlerEditCustomer(item.id);
                    }}
                  >
                    Aktualizacja
                  </button>
                  <button className="btn1"
                    onClick={() => {
                      handlerDeleteCustomer(item.id);
                    }}
                  >
                    Usuń
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default Customer;
