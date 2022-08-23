import './App.css';
import { loadStdlib } from '@reach-sh/stdlib';
import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';
import * as backend from './reach/build/index.main.mjs'
import { useState } from 'react';
import { views, Loader } from './utils/';
import { ConnectAccount, PasteContractInfo, SelectRole, ViewAuction, ViewWinner, WaitForAttacher } from './screens';


const reach = loadStdlib('ALGO');
reach.setWalletFallback(reach.walletFallback( { providerEnv: 'TestNet', MyAlgoConnect } ));
// const fmt = (x) => reach.formatCurrency(x, 4);

function App() {
  const [ account, setAccount ] = useState({})
  const [ view, setView ] = useState(views.CONNECT_ACCOUNT)
  const [ contractInfo, setContractInfo ] = useState(`{"type":"BigNumber","hex":"0x0"}`)
  const [ contract, setContract ] = useState()
  // const [ nftID, setNftId ] = useState('')
  const [ bid, setBid ] = useState([
    // { address: '0x0blahblah', bid: 2 },
    // { address: '0x0blahblah', bid: 2 },
    // { address: '0x0blahblah', bid: 2 },
    // { address: '0x0blahblah', bid: 2 },
  ])
  const [ winner, setWinner ] = useState({ address: '0x0blahblah', bid: 2 })

  const reachFunctions = {
    connect: async (secret, mnemonic = false) => {
      let result = ""
      try {
        const account = mnemonic ? await reach.newAccountFromMnemonic(secret) : await reach.getDefaultAccount();
        setAccount(account);
        setView(views.DEPLOY_OR_ATTACH);
        result = 'success';
      } catch (error) {
        result = 'failed';
      }
      return result;
    },

    setAsDeployer: (deployer = true) => {
      if(deployer){
        setView(views.SET_TOKEN_INFO);
      }
      else{
        setView(views.PASTE_CONTRACT_INFO);
      }
    },

    deploy: async (name, url, minBid) => {
      setView(views.DEPLOYING);
      const contract = account.contract(backend);
      const NFT = await reach.launchToken(account, name, 'NFT', { supply: 1, url })
      // setNftId(NFT.id)
      backend.Alice(contract, {
        ...Alice,
        getSale_details: () => {
          return {
            nftId: NFT.id,
            minBid,
            Time: 50
          }
        }
      });
      const ctcInfo = JSON.stringify(await contract.getInfo(), null, 2)
      setContractInfo(ctcInfo);
      setView(views.WAIT_FOR_ATTACHER)
    },

    attach: (contractInfo) => {
      const contract = account.contract(backend, JSON.parse(contractInfo));
      setContract(contract)
      backend.Bob(contract, Bob)
      setView(views.ATTACHING)
    }
  }

  const Common = {
    seeBid: ( address, bid) => {
      setBid(b => {
        const copy = [...b]
        copy.push({
          address,
          bid: parseFloat(bid)
        })
        return copy
      })
    },

    showOutcome: (address, bid) => {
      setWinner({
        address,
        bid: parseFloat(bid)
      })
      setView(views.VIEW_WINNER)
    }
  }

  const Alice = {
    ...Common,
  }

  const Bob = {
    ...Common,

    optIn: async (tokenID) => {
      setView(views.OPT_IN)
      const id = reach.bigNumberToNumber(tokenID) //accept token
      await account.tokenAccept(id)
      setView(views.VIEW_AUCTION)
    }
  }

  
  return (
    <div className="App">
      <div className='top'>
        <h1>NFT AUCTION</h1>
      </div>
      <header className="App-header">
        {
          view === views.CONNECT_ACCOUNT && 
          <ConnectAccount connect={reachFunctions.connect}/>
        }

        {
          view === views.DEPLOY_OR_ATTACH &&
          <SelectRole deploy={reachFunctions.deploy} attach={() => setView(views.PASTE_CONTRACT_INFO)}/>
        }

        {
          (view === views.DEPLOYING || view === views.ATTACHING) &&
          <Loader />
        }

        {
          view === views.OPT_IN && 
          <>
            <Loader />
            <h5>Opting Into NFT. . .</h5>
          </>
        }

        {
          view === views.PASTE_CONTRACT_INFO &&
          <PasteContractInfo attach={reachFunctions.attach}/>
        }

        {
          view === views.WAIT_FOR_ATTACHER &&
          <WaitForAttacher info={contractInfo} bid={bid}/>
        }

        {
          view === views.VIEW_AUCTION &&
          <ViewAuction 
            bid={bid} 
            placeBid={async (amount) => {
              try {
                await contract.apis.Bobs.bid(amount)
                return true
              } catch (error) {
                console.log(error)
                return false
              }
            }}
          />
        }

        {
          view === views.VIEW_WINNER &&
          <ViewWinner winner={winner} reset={() => setView(views.DEPLOY_OR_ATTACH)}/>
        }
      </header>
    </div>
  );
}

export default App;
