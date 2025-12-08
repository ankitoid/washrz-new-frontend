import React from 'react'
import { ClockLoader } from 'react-spinners'

const Loader = ({loading, setLoading}) => {
  return (
 <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%" , width:"100%"}}>
 {loading ? <ClockLoader
          color={"#008080"}
          loading={loading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
        /> : null}
 </div>
  )
}

export default Loader