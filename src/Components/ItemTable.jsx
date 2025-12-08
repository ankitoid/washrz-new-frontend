import React from 'react'
import { Table } from 'react-bootstrap';

const ItemTable = ({menuItems, priceConfig, deleteTask}) => {
  return (
    <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Type</th>
                    <th>WearType</th>
                    <th>Weight/Quantity</th>
                    <th>Price</th>
                    {deleteTask ? <th>Remove Items</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {menuItems.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <b style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>No Data</b>
                      </td>
                    </tr>
                  ) : (
                    menuItems.map((item, index) => {
                      let price = item.Price;
                      if(item.wearType !== '-')
                      {
                        price = priceConfig[item.type] && priceConfig[item.type][item.wearType]
                        ? item.weight * priceConfig[item.type][item.wearType]
                        : 0;
                      }
                      return (
                        <tr key={index}>
                          <td>{item.group}</td>
                          <td>{item.type}</td>
                          <td>{item.wearType}</td>
                          <td>{item.wearType === '-' ? `${item.weight} unit` : `${item.weight} kg`}</td>
                          <td>&#x20B9;{price}</td>
                          {deleteTask ? <td>
                            <button className='btn btn-danger pl-5 d-flex justify-content-center' onClick={() => deleteTask(index)}>x</button>
                          </td> : null}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
  )
}

export default ItemTable