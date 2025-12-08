import React, { useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import { instance } from "../config";
import ItemTable from "./ItemTable";
import axios from "../config";

function BillModal({
  billShow,
  setBillShow,
  total,
  currObj,
  handledelete,
  priceConfig,
}) {
  const [dis, setdis] = useState(0);
  console.log("this is curr obj --> ", currObj);
  const { contactNo, customerName, address } = currObj;
  const addOrder = async () => {
    try {
      const res = await axios.post(`/addOrder`, currObj,   {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
      const sendTemRes = await instance.post(
        `/sendTemplateMessage?whatsappNumber=${currObj.contactNo}`,
        {
          template_name: "automated_collection_successfull",
          broadcast_name: "automated_collection_successfull",
          parameters: [
            {
              name: "name",
              value: currObj.customerName,
            },
            {
              name: "total_Bill",
              value: (total - total * (dis / 100)).toFixed(2),
            },
          ],
        }
      );
      handledelete(currObj.id);
    } catch (error) {
      console.log("this is error", error);
    }
  };
  return (
    <Modal show={billShow} onHide={() => setBillShow(false)} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Your Total Bill</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Customer Info:</h5>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <div>
            <p>Name:</p>
            <p>Contact:</p>
            <p>Address:</p>
          </div>
          <div>
            <p>{customerName}</p>
            <p>{contactNo}</p>
            <p>{address}</p>
          </div>
        </div>
        <h5>Added Items:</h5>
        {currObj.items && (
          <Card>
          <Card.Body>
          <ItemTable
            priceConfig={priceConfig}
            menuItems={currObj.items}
            deleteTask={null}
          />
          </Card.Body>
          </Card>
        )}
        <h5 style={{marginTop:"10px"}}>Billing Info:</h5>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <div>
            <div style={{marginBottom:"2px"}}>Total Bill is:</div>
            <div style={{marginBottom:"2px"}}>Discount :</div>
            <div>Discounted Bill is: </div>
          </div>
          <div>
            <div style={{marginBottom:"2px"}}> &#x20B9;{total}</div>
            <div style={{marginBottom:"2px"}}>
              <input
                type={"number"}
                value={dis}
                onChange={(e) => {
                  setdis(e.target.value);
                  currObj.price = (
                    total -
                    total * (e.target.value / 100)
                  ).toFixed(2);
                  console.log("prceee", currObj.price);
                }}
              />
            </div>
            <div>&#x20B9;{(total - total * (dis / 100)).toFixed(2)}</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setBillShow(false);
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            addOrder();
            setBillShow(false);
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BillModal;
