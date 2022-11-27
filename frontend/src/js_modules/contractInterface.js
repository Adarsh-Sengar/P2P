import Web3 from 'web3';

let web3, abi, contract;
const gasLimit = 3000000;

// Turns coordinates into the form for the blockchain of [int, int] ([lat, lng])
function __blockifyCoords(loc){
    return [
        Math.round(parseFloat(loc.lat) * 1000000),
        Math.round(parseFloat(loc.lng) * 1000000)
    ]
}

// intialize with portnumber , contract Addrrees , abiInterface
async function initBlockchain(portNumber, contractAddress, abiInterface) {
    web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:"+portNumber));

    contract = new web3.eth.Contract(abiInterface);
    contract.options.address = contractAddress;

    return contract;
}

// function to set Driver
function setDriver(ethereumAddress){
    return new Promise ((resolve, reject) => {
        contract.methods.driveRequest().send({from: ethereumAddress, gas: gasLimit}).then((value) => {
            resolve();
        })
    })
}

// function to request a ride and also set rider address
// start , end loc are location
// ridecost is the cost of the ride
// ethereumAddress is the address of rider
function requestRide(startLoc, endLoc, rideCost, ethereumAddress){
    const startLatLng = __blockifyCoords(startLoc);
    const endLatLng = __blockifyCoords(endLoc);

    return new Promise((resolve, reject) => {
        contract.methods.rideRequest(startLatLng, endLatLng, rideCost).send({from: ethereumAddress, gas: gasLimit}).then((value) => {
            console.log(value)
            resolve(value);
        })
    })

}

// function to accept the ride 
// rider number is from getnumber that identifies a user
// timeToArraive is the number of seconds the driver has to get to the rider before penalty


function acceptJob(riderNumber, timeToArrive, ethereumAddress){

    const now = Math.round(new Date().getTime() / 1000); //current time in seconds

    const timeRemaining = now + timeToArrive;

    contract.methods.pickRider(riderNumber, timeRemaining).send({from: ethereumAddress, gas: gasLimit}).then((value) => {
        console.log(value)
    })
}


//Method called when requesting the current available rides
//ethereumAddress string with the etheruem address of the driver looking for rides

function getCurrentRides(ethereumAddress){
    contract.methods.getWaitingRiders().send({from: ethereumAddress, gas: gasLimit}).then((value) => {
        console.log('RIDES EMITTED')
    }).catch(error => console.log("ERROR: CANNOT GET WAITING RIDERS\n" + error +'\nGAS AMOUNT'+gasLimit));
}

// Resets a user so they are not 1. matched to anyone 2. locations are wiped
//string with the ethereum address of the user to reset
// integer value in wei to cost the user by reseting user
function resetUser(ethereumAddress, feeAmount){
    feeAmount = parseInt(feeAmount).toString();
    return new Promise((resolve, reject) => {
        contract.methods.userReset().send({from: ethereumAddress, gas: gasLimit, value: web3.utils.toWei(feeAmount, 'wei')}).then((value) => {
            console.log('RESET THE USER');
            resolve();
        });
    })
}


 //loc   object containing both .lat and .lng attributes. These attributes should be strings, not callables loc
 // ethereumAddress   string with the ethereum address of driver
function informRider(loc, ethereumAddress) {
    const locLatLng = __blockifyCoords(loc);
    contract.methods.informRider(locLatLng).send({from: ethereumAddress, gas: gasLimit}).then( val => {
        console.log('Sent inform rider message');
    }).catch(error => console.log('Error: not close enough to the rider. Please move closer'))
}

// Get the User number in the blockchain list. Used for matching in the ride progress page

// ethereumAddress   String ethereum address of the requester

// Promise that when resolves returns the number (an int) for the user

function getMyRiderNumber(ethereumAddress){
    return new Promise ((resolve, reject) => {
        contract.methods.getNumber().call({from: ethereumAddress}).then(number => {
            resolve(parseInt(number));
        })
    })
}

// amount              Integer amount to pay (in wei right now)
//ethereumAddress  String ethereum address of the sender
function payDriver(amount, ethereumAddress){
    amount = parseInt(amount).toString();
    contract.methods.payDriver().send({from: ethereumAddress, gas: gasLimit, value: web3.utils.toWei(amount, 'wei')}).then( value => {
        console.log('Paid driver')
    }).catch('Error paying driver')
}

export {
    initBlockchain,
    setDriver,
    requestRide,
    getCurrentRides,
    acceptJob,
    resetUser,
    informRider,
    getMyRiderNumber,
    payDriver
}
