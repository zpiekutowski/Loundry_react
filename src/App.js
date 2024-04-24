import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Customer from "./components/Customer";
import NewOrder from "./components/NewOrder";
import NotFound from "./components/NotFound";
import Header_main from "./components/Header_main";
import Home from "./components/Home";
import AddCustomer from "./components/AddCustomer";
import EditCustomer from "./components/EditCustomer";
import Administration from "./components/Administration";
import ChooseCustomer from "./components/ChooseCustomer";
import AddUnitOrder from "./components/AddUnitOrder";
import EditUnitOrder from "./components/EditUnitOrder";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";
import EditUnitOrderInProgres from "./components/EditUnitOrderInProgres";
import UnitOrders from "./components/UnitOrders";
import ArchiveOrders from "./components/ArchiveOrders";
import ArchiveOrderDetails from "./components/ArchiveOrderDetails";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Header_main />
        <Routes>
          <Route path="/laundry" element={<Home />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/new_order" element={<NewOrder />} />
          <Route path="/admin" element={<Administration/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/orders/units" element={<UnitOrders />} />
          <Route path="/archive" element={<ArchiveOrders />} />
          
                    
          
          //dodatkowe
          <Route path="/customer/add" element={<AddCustomer />} />
          <Route path="/customer/edit/:custId" element={<EditCustomer />} />
          <Route path="/new_order/set_customer" element={<ChooseCustomer />} />
          <Route path="/new_order/add_unit_order" element={<AddUnitOrder />} />
          <Route path="/new_order/edit_unit_order/:idRow" element={<EditUnitOrder />} />
          <Route path="/orders/detils/:idOrder" element={<OrderDetails />} />
          <Route path="/orders/edit_unit_order/:idUnitOrder" element={<EditUnitOrderInProgres />} />
          <Route path="/archive/order/:idOrder" element={<ArchiveOrderDetails />} />
          
          

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
