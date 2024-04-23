import { useState, useEffect } from "react";
import { URL } from "../properties";
import { useNavigate } from "react-router-dom";

function ArchiveOrders() {
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [next, setNext] = useState(false);
  const [prev, setPrev] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const LINE_NUMBER = 10;
  

  useEffect(() => {
    handleFetch();
  }, [refresh]);

  async function handleFetch() {
    try {
      const result = await fetch(
        URL + "/archive/page?page=" + page + "&size=" + LINE_NUMBER,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await result.json();
      setOrders(data);
      setNext(data.last);
      setPrev(data.first);
    } catch (err) {
      console.log(err.message);
    }
  }

  function handleSearch(){
    const idNumber = parseInt(search);
    if(Number.isInteger(idNumber)){
      console.log(idNumber);
      navigate("/archive/order/" + idNumber);
    }
    else{
        alert("Niewlasciwy format");
    }
  }


  function handleDetails(orderId) {
    navigate("/archive/order/" + orderId);
  }

  function handleNext(){
    setPage(page+1);
    setRefresh(!refresh);
  }

 function handlePrev(){
     setPage(page-1);
     setRefresh(!refresh);
  }



  return (
    <div>
      <div>ARCHIWUM</div>
      <button onClick={handlePrev} disabled={prev}>PREV</button>
      <button onClick={handleNext} disabled={next}>NEXT</button>
      
      <input type="text" 
      value={search} 
      onChange={(e) => setSearch(e.target.value)}></input>
      <button onClick={handleSearch}>SZUKAJ</button>
      

      <table className="styled-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Klient</th>
            <th>Data Przyjęcia</th>
            <th>Data wydania</th>
            <th>Cena</th>
            <th>AKCJA</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.content.map((item) => (
              <tr key={item.id}>
                <th>{item.id}</th>
                <th>{item.customer}</th>
                <th>
                  {item.startDate.toString().split("-").reverse().join("-")}
                </th>
                <th>
                  {item.pickupDate.toString().split("-").reverse().join("-")}
                </th>
                <th>{item.price.toFixed(2)}</th>

                <th>
                  <button
                    onClick={() => {
                      handleDetails(item.id);
                    }}
                  >
                    SZCZEGOLY
                  </button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export default ArchiveOrders;
