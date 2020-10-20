import React, { useState, useEffect } from "react";
import database from "./firebase";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import zondongoImage from "./zodongo.png";

function App() {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  const [userorders, setUserOrders] = useState([]);
  // const [errors, setError] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState();

  const [orderstotal, setOrdersTotal] = useState();
  const [newOrderTotal, setNewOrdersTotal] = useState();

  useEffect(() => {
    setLoading(true);
    console.log();
    database
      .collection("OrderRecords")
      .orderBy("status")
      .onSnapshot((snapshot) => {
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
        newOrders();
        setLoading(false);
      });
  }, []);

  const newOrders = () => {
    setLoading(true);
    database
      .collection("OrderRecords")
      .where("status", "==", "false")
      .orderBy("date", "desc")
      .onSnapshot((snapshot) => {
        const fetchedOrders = [];
        snapshot.docs.map((doc) => {
          //get that document id and save it with the data
          const fetchedOrder = {
            id: doc.id,
            ...doc.data(),
          };
          fetchedOrders.push(fetchedOrder);
        });
        setNewOrdersTotal(fetchedOrders.length);
        setLoading(false);
      });
  };

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
      .collection("ZodongoUsers")
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
      <div className="header">
        <h1>Zodongo Foods, Order Management </h1>
      </div>
      <div className="OrderList">
        <div className="Orderheading">
          <h1>ORDERS</h1>

          <div className="neworderscount">{newOrderTotal}</div>
        </div>

        {allOrders
          ? allOrders.map((order) => (
              <div
                className="Order"
                key={order.date}
                onClick={() => selectOrder(order)}
              >
                <p>Order# : {order.date}</p>
                <p>Time: {moment(order.date).format("ddd DD/MM/YYYY LTS")}</p>
                <span>Status:</span>

                <span
                  className={`banner ${
                    order.status === "true" ? "active" : "cancel"
                  }`}
                ></span>
              </div>
            ))
          : null}
      </div>

      <div className="viewside">
        {loading ? (
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : null}

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
            <img src={zondongoImage} alt="image" />

            <div className="cardbody">
              <h1>Welcome, Zodongo!</h1>

              <p>
                Manage All Orders in one place. All Orders are Delievered in
                Real Time and so There is no need to refresh the browser
              </p>
              <p></p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
