import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno } from '@reach-sh/stdlib/ask.mjs';


const stdlib = loadStdlib();
const startingBalance = stdlib.parseCurrency(10000);

const accAlice = await stdlib.newTestAccount(startingBalance);
const Bobs = await stdlib.newTestAccounts(10, startingBalance);
console.log('Hello Alice and Bobsssssss')
const ctcAlice = accAlice.contract(backend);
const myNFT = await stdlib.launchToken(accAlice, "NFT", "NFT01", { supply: 1 });
const minbid = await ask('Please input minimum bid for the program: ')
const time = await ask('enter deadline for auction: ')
const enter_action = async (bobs, bids) => {
    try {
        const who = bobs
        const acc = who.getAddress()
        const ctc = who.contract(backend, ctcAlice.getInfo());
        const new_bid = stdlib.parseCurrency(bids)
        who.tokenAccept(myNFT.id)
        await ctc.apis.Bobs.bid(new_bid);
    } catch (error) {
        console.log(error)
    }

}

await Promise.all([
    ctcAlice.p.Alice({
        getSale_details: () => {
            return {
                nftId: myNFT.id,
                minBid: stdlib.parseCurrency(parseInt(minbid)),
                Time: parseInt(time)
            }

        },
        seeBid: (add, num) => {
            console.log(`Alice saw ${add} and their bid ${num}`)
        },
        showOutcome: (add, num) => {
            console.log(`Winner of auction is ${add} and their bid ${num}`)
        },

    }),
    await enter_action(Bobs[0], 500),
    await enter_action(Bobs[1], 1000),
    await enter_action(Bobs[2], 1200),
    await enter_action(Bobs[3], 1300),
    await enter_action(Bobs[4], 1700),
    await enter_action(Bobs[5], 2000),
    await enter_action(Bobs[6], 2500),
    await enter_action(Bobs[7], 3000),
    //await enter_action(Bobs[8], 30),
    //await enter_action(Bobs[9], 1900),
]);

const showuserBalance = async (acc, name) => {
    const amt = await stdlib.balanceOf(acc);
    const amtNFT = await stdlib.balanceOf(acc, myNFT.id);
    console.log(`${name} has ${stdlib.formatCurrency(amt)} ${stdlib.standardUnit} and ${amtNFT} of the NFT`);
};
await showuserBalance(accAlice, 'Alice')
await showuserBalance(Bobs[0], 'Bob1')
await showuserBalance(Bobs[1], 'Bob2')
await showuserBalance(Bobs[2], 'Bob3')
await showuserBalance(Bobs[3], 'Bob4')
await showuserBalance(Bobs[4], 'Bob5')
await showuserBalance(Bobs[5], 'Bob6')
await showuserBalance(Bobs[6], 'Bob7')
await showuserBalance(Bobs[7], 'Bob8')
process.exit()
