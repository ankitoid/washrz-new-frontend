import React from 'react'
import "../style/responsive.css"
import useAuth from '../hooks/useAuth'

const BillCustomerInfo = () => {
  const {currObj: {customerName, contactNo, address} } = useAuth();
  return (
    <>
 {/* <h5 style={{paddingLeft: '20px', paddingTop:'10px', paddingBottom:"10px"}}>Customer Info:</h5> */}
        <div
          style={{
            // display: "flex",
            // justifyContent: "space-around",
            // alignItems:"center",
            border: "2px solid black",
            borderRadius: "5px",
            padding: "20px",
            marginBottom: "25px",
            margin:"10px",
          }}
        >
          <div className='name' style={{display:"inline-block"}}>
            <h6>Name:</h6>
            <p>{customerName}</p>
          </div>

          <div className='name'>
            <h6>Contact:</h6>
            <p >{contactNo}</p>
          </div>


          <div className='name'>
            <h6>Address:</h6>
            <p>{address}</p>
          </div>
        </div>
    </>
  )
}

export default BillCustomerInfo