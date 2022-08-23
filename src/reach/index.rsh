'reach 0.1';

export const main = Reach.App(() => {
    const Alice = Participant('Alice', {
        getSale_details: Fun([], Object({
            nftId: Token,
            minBid: UInt,
            Time: UInt,
        })),
        seeBid: Fun([Address, UInt], Null),
        showOutcome: Fun([Address, UInt], Null),
    });
    const Bobs = API('Bobs', {
        bid: Fun([UInt], Tuple(Address, UInt)),
    });
    const Bob = ParticipantClass('Bob', {
        seeBid: Fun([Address, UInt], Null),
        showOutcome: Fun([Address, UInt], Null),
        optIn: Fun([Token], Null),
    });
    init();

    Alice.only(() => {
        const { nftId, minBid, Time } = declassify(interact.getSale_details());
    });
    Alice.publish(nftId, minBid, Time);
    const amt = 1;
    commit();
    Alice.pay([[amt, nftId]]);

    Bob.interact.optIn(nftId);
    Bob.interact.seeBid(Alice, minBid);

    const end = lastConsensusTime() + Time;
    const [
        highestBidder,
        lastPrice,
        isFirstBid,
    ] = parallelReduce([Alice, minBid, true])
        .invariant(balance(nftId) == amt && balance() == (isFirstBid ? 0 : lastPrice))
        .while(lastConsensusTime() <= end)
        .api_(Bobs.bid,
            (bid) => {
                check(bid > lastPrice, "bid is too low,go higher");
                return [bid, (notify) => {
                    notify([highestBidder, lastPrice]);
                    if (!isFirstBid) {
                        transfer(lastPrice).to(highestBidder);
                    }
                    const who = this;
                    Alice.interact.seeBid(who, bid);
                    Bob.interact.seeBid(who, bid);
                    return [who, bid, false];
                }];
            }
        )
        .timeout(absoluteTime(end), () => {
            Alice.publish();
            return [highestBidder, lastPrice, isFirstBid];
        });

    transfer(amt, nftId).to(highestBidder);
    if (!isFirstBid) {
        transfer(lastPrice).to(Alice);
    }
    Alice.only(() => {
        interact.showOutcome(highestBidder, lastPrice);
    });
    Bob.only(() => {
        interact.showOutcome(highestBidder, lastPrice);
    });

    commit();
    exit();
});
