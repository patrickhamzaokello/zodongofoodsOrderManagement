import React, { useState, useEffect } from "react";
import database from "./firebase";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { ColorLensOutlined } from "@material-ui/icons";

function App() {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  const [userorders, setUserOrders] = useState([]);
  const [errors, setError] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState();

  const [orderstotal, setOrdersTotal] = useState();

  useEffect(() => {
    //this is where the code runs
    setLoading(true);
    database.collection("OrderRecords").onSnapshot((snapshot) => {
      const fetchedOrders = [];
      snapshot.docs.map((doc) => {
        //get that document id and save it with the data
        const fetchedOrder = {
          id: doc.id,
          ...doc.data(),
        };
        fetchedOrders.push(fetchedOrder);
      });
      setAllOrders(fetchedOrders);
      setOrdersTotal(fetchedOrders.length);
      setLoading(false);
    });
  }, []);

  const selectOrder = (order) => {
    setLoading(true);
    setSelectedOrder(order);
    getUSerDetails(order);
    database
      .collection("OrderRecords")
      .doc(order.date)
      .collection("Order")
      .onSnapshot((snapshot) => {
        const fetchedUserOrders = [];
        snapshot.docs.map((doc) => {
          //get that document id and save it with the data
          const fetcheduserOrder = {
            id: doc.id,
            ...doc.data(),
          };
          fetchedUserOrders.push(fetcheduserOrder);
        });
        setUserOrders(fetchedUserOrders);
        setLoading(false);
      });
  };

  const getUSerDetails = (order) => {
    setLoading(true);
    database
      .collection("brews")
      .doc(order.userid)
      .onSnapshot((snapshot) => {
        const fetchedUserDetails = [];
        //get that document id and save it with the data
        const fetcheduserDetail = {
          id: snapshot.id,
          ...snapshot.data(),
        };
        fetchedUserDetails.push(fetcheduserDetail);
        setUserDetails(fetchedUserDetails);
        setLoading(false);
      });
  };

  const confirmOrder = (selectedOrder) => {
    database
      .collection("OrderRecords")
      .doc(selectedOrder.id)
      .update({ status: "true" });
  };

  const cancelOrder = (selectedOrder) => {
    database
      .collection("OrderRecords")
      .doc(selectedOrder.id)
      .update({ status: "false" });
  };

  return (
    <main>
      <div class="header">
        <h1>Zodongo Foods</h1>
      </div>
      <div className="OrderList">
        <h1>ORDERS</h1>


        {allOrders
          ? allOrders.map((order) => (
              <div
                className="Order"
                key={order.date}
                onClick={() => selectOrder(order)}
              >
                <p>Order: {order.date}</p>
                <span>
                  | Status:
                  {order.status}
                </span>

                <span
                  className={`banner ${order.status == "true" ? "active" : ""}`}
                ></span>
              </div>
            ))
          : null}
      </div>

      <div className="viewside">
        {loading ? <div class="lds-ring"><div></div><div></div><div></div><div></div></div> : null}

        {selectedOrder ? (
          <div>
            <div className="actionbuttons">
              <p
                className="confirmbtn"
                onClick={() => confirmOrder(selectedOrder)}
              >
                Confirm Order
              </p>
              <p
                className="cancelorder"
                onClick={() => cancelOrder(selectedOrder)}
              >
                Cancel Order
              </p>
            </div>
            <div className="userDetails">
              {userDetails.map((user) => (
                <div className="user" key={user.id}>
                  <p>Name: {user.name}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Email: {user.email}</p>
                </div>
              ))}
            </div>

            <div className="tablewrapper">
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Price</th>
                    <th scope="col">Qtn</th>
                    {/* <th scope="col">Desc</th> */}
                  </tr>
                </thead>
                <tbody>
                  {userorders.map((cart) => (
                    <tr key={cart.id} onClick={() => selectOrder(cart)}>
                      <td>{cart.name}</td>
                      <td>UGX {cart.price}</td>
                      <td>{cart.quantity}</td>
                      {/* <td>{cart.description}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/zodongo-foods.appspot.com/o/Custom%20Size%20%E2%80%93%201.png?alt=media&token=31e7c76a-afe9-4fc5-a9b8-ee0b3ed8f671"
              alt="image"
            />

            <div className="cardbody">
              <h1>Welcome Back!</h1>

              <p>Manage All Orders in one place. All Orders are Delievered in Real Time and so There is no need to refresh the browser</p>
              <p></p>
          
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

export default App;
