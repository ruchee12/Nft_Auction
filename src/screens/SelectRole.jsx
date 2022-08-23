import { useState } from 'react'
import './index.css'

export function SelectRole({deploy, attach}){
  const [ deployer, setDeployer ] = useState(false)
  const [ url, setUrl ] = useState(
    'https://picsum.photos/200/300'
  )
  const [ name, setName ] = useState('')
  const [ minBid, setMinBid ] = useState(1)
  return(
    <div className='section'>
      {
        deployer ?
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <h4>NFT and Auction Setup</h4>
          <div className='form-row'>
            <label>Starting Bid</label>
            <input 
              className='text-input' 
              type={'number'}
              value={minBid}
              onChange={e => setMinBid(e.target.value)}
            />
          </div>
          <div className='form-row'>
            <label>NFT Name</label>
            <input 
              className='text-input' 
              type={'text'} 
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className='form-row'>
            <label>Url to NFT info</label>
            <input 
              className='text-input' 
              type={'text'}
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>
          <button className='button' onClick={() => deploy(name, url, parseFloat(minBid))}>Launch Auction</button>
        </div>
        :
        <>
          <button className='button' onClick={() => setDeployer(true)}>Deploy Contract</button>
          <hr />
          <button className='button' onClick={() => attach()}>Attach to existing contract</button>
        </> 
      }
    </div>
  )
}