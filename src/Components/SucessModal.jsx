import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NestedDropdown from './MultiSelector';
import { Card, Table } from 'react-bootstrap';
import '../App.css';
import { toast, ToastContainer } from 'react-toastify';
import ItemTable from './ItemTable';

function Example({ showSuc, setShowSuc, setBillShow, setTotal, setCurrObj, setPriceConfig }) {
  const [menuItems, setMenuItems] = useState([]);

  const handleClose = () => setShowSuc(false);

  const deleteTask = (index) => {
    const filteredItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(filteredItems);
  };

  const priceConfig = {
    'Wash and Fold': {
      'Wearable': 80,
      'Non-Wearable': 100,
    },
    'Wash and Iron': {
      'Wearable': 100,
      'Non-Wearable': 120,
    },
  };

  const total = menuItems.reduce((acc, item) => {
    const price = priceConfig[item.type] && priceConfig[item.type][item.wearType]
      ? item.weight * priceConfig[item.type][item.wearType]
      : item.Price;
    return acc + price;
  }, 0);

  console.log("hii===->> ", priceConfig)

  return (
    <>
      <Modal show={showSuc} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Card.Title>Added Items</Card.Title>
              <ItemTable priceConfig={priceConfig} menuItems={menuItems} deleteTask={deleteTask}/>
            </Card.Body>
          </Card>

          <NestedDropdown menuItems={menuItems} setMenuItems={setMenuItems} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setBillShow(true);
            setShowSuc(false);
            setTotal(total);
            setCurrObj((prev)=>{return {...prev, items: [...menuItems], price: total}})
            setPriceConfig({...priceConfig})
          }}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default Example;
