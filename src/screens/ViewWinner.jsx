

export function ViewWinner({winner, reset}){
  const { address, bid } = winner
  return(
    <div className="section">
      <h4>{address} won the auction with a bid of {bid} ALG</h4>
      <button onClick={() => reset()} className="button">New Auction</button>
    </div>
  )
}