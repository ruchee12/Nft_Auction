import { useState } from "react"
import { Loader } from "../utils"


export function ViewAuction({bid, placeBid}){
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState(false)
  const [ stake, setStake ] = useState(0)

  const makeBid = async () => {
    setLoading(true)
    setError(false)
    const d = await placeBid(parseFloat((stake)))
    setLoading(false)
    if(d === false){
      setError(true)
    }
  }
  return(
    <div className="section">
      <h4>Auction in progress...</h4>
      {
        loading ? 
        <Loader /> :
        <>
          <div style={{  padding: '10px' }}>
            <div className='form-row'>
              <label>Set Your Bid</label>
              <input 
                className='text-input' 
                type={'number'}
                value={stake}
                onChange={e => setStake(e.target.value)}
              />
            </div>
            <button onClick={makeBid} className="button">Place Bid</button>
            {
              error && <p style={{fontSize: '14px',  color: 'red'}}>Your bid must be higher than last bid</p>
            }
          </div>
          {
            bid.length !== 0 ?
            bid.map((stake, index) => (
              <>
                <p style={{fontSize: '17px'}} key={index}>{stake.address} made a bid of {stake.bid}</p>
                {/* <hr style={{width: '100%'}}/> */}
              </>
            ))
            :
            <h4>No bids have been placed yet</h4>
          }
        </>
      }
      
    </div>
  )
}