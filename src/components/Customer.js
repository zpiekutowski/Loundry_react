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
          alert("Blad usuniecia");
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
    <div>
      <p>Menu Klienta: </p>
      <div style={{ display: "flex" }}>
        <button onClick={handlerAddCustomer}>Dodaj Klienta</button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button onClick={handlerSearch}>Szukaj</button>
        <button onClick={handlerClearSearch}>Wyczysc</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nazwa</th>
            <th>Addres</th>
            <th>Telefon</th>
            <th>ACTION</th>
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
                  <button
                    onClick={() => {
                      handlerEditCustomer(item.id);
                    }}
                  >
                    Aktualizacja
                  </button>
                  <button
                    onClick={() => {
                      handlerDeleteCustomer(item.id);
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
export default Customer;
