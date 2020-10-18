import React, { useState, useEffect } from "react";
import database from "./firebase";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

function App() {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  const [userorders, setUserOrders] = useState([]);
  const [errors, setError] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState();

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
        console.log(fetchedUserDetails);
        setLoading(false);
      });
  };

  return (
    <main>
      <div className="OrderList">
        <h1>AllOrders</h1>

        {allOrders
          ? allOrders.map((order) => (
              <div
                className="Order"
                key={order.date}
                onClick={() => selectOrder(order)}
              >
                <p>{order.date}<span>| Status:
                {order.status}</span></p>
              </div>
            ))
          : null}
      </div>

      <div className="viewside">
        {loading ? <p>Loading..</p> : null}

        {selectedOrder ? (
          <div>
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
        ) : 
        
        <img src="https://image.freepik.com/free-psd/web-banner-template-japanese-restaurant_23-2148203260.jpg" alt="image"/>
        
        }
      </div>
    </main>
  );
}

export default App;
