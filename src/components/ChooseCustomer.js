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
  function handleBack(){
    navigate(-1);
  }

  return (
    <div className="main_frame">
      <div className="title">
        <h3>WYBIERZ KLIENTA</h3>
      </div>

      <div className="tilte_fill">
      <button className="btn1" onClick={handleBack}>POWRÓT</button>
        <input className="input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button className="btn1" onClick={handleSearch}>SZUKAJ</button>
        <button className="btn1" onClick={handleClearSearch}>WYCZYŚĆ</button>
        
        
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
                  <button className="btn1"
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
