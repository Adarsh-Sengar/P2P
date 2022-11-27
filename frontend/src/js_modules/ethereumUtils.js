import web3 from 'web3';

// address checker
function isValidAddress(address) {
    address = (typeof(address) === 'string' || address instanceof String) ? address : address.toString();
    return web3.utils.isAddress(address);
}

export  {
    isValidAddress
}