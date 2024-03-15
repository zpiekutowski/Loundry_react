import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../properties";

function ChooseCustomer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState(null);
  const [refresh, setRefresh] = useState(false);

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

  function handleSearch() {
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
  function handleClearSearch() {
    setSearch("");
    setRefresh(!refresh);
  }

  function handleChooseCustomer(id) {
    fetch(URL + "/new_order/setcustomer/" + id, {
        method: "POST",
        credentials: "include",
      })
        .then((res) => {
          if (res.status === 200) {
            navigate(-1);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
  }

  return (
    <div>
      <p>Obsluga wyboru klienta</p>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button onClick={handleSearch}>Szukaj</button>
        <button onClick={handleClearSearch}>Wyczysc</button>
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
                      handleChooseCustomer(item.id);
                    }}
                  >
                    WYBIERZ
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default ChooseCustomer;
