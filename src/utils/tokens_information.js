import { ethers } from "ethers"

const tokens = {
    //BEP-20 TOKEN ADDRESSES
    "0xD6DF932A45C0f255f85145f286eA0b292B21C90B" : ["AAVE", "AAVE", 0],
    "0x831753DD7087CaC61aB5644b308642cc1c33Dc13" : ["QuickSwap", "QUICK", 0],
    "0xb33EaAd8d922B1083446DC23f610c2567fB5180f": ["Uniswap", "UNI", 0],
    "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683": ["The SandBox", "SAND", 0],
    "0xC762043E211571eB34f1ef377e5e8e76914962f9": ["ApeCoin", "APE", 0],
    "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": ["Bitcoin", "BTC", 0],
    "0x2170Ed0880ac9A755fd29B2688956BD959F933F8": ["Ethereum", "ETH", 0],
    "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE": ["XRP", "XRP", 0],
    "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47": ["Cardano", "ADA", 0],
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": ["BNB", "BNB", 0], //WBNB
    "0x1CE0c2827e2eF14D5C4f29a091d735A204794041": ["Avalanche", "AVAX", 0],
    "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402": ["Polkadot", "DOT", 0],
    "0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B": ["Tron", "TRX", 0],
    "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7": ["Aavegotchi", "GHST", 0],
    "0x570A5D26f7765Ecb712C0924E4De545B89fD43dF": ["Solana", "SOL", 0],
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": ["PancakeSwap", "CAKE", 0],
    "0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf": ["Bitcoin Cash", "BCH", 0],
    "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153": ["Filecoin", "FIL", 0],
    "0x2D03bECE6747ADC00E1a131BBA1469C15fD11e03": ["VVS Finance", "VVS", 0],
    "0x6f7C932e7684666C9fd1d44527765433e01fF61d": ["Maker", "MKR", 0],
    // "0xb33EaAd8d922B1083446DC23f610c2567fB5180f": ["Uniswap", "UNI", 0],
    "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39": ["Chainlink", "LINK", 0],
    // "0xD6DF932A45C0f255f85145f286eA0b292B21C90B": ["AAVE", "AAVE", 0],
    "0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c": ["Compound", "COMP", 0],
    "0x5fd896D248fbfa54d26855C267859eb1b4DAEe72": ["Maker", "MKR", 0],
    "0x4537e328Bf7e4eFA29D05CAeA260D7fE26af9D74": ["Uniswap", "UNI", 0],
    "0x7eF541E2a22058048904fE5744f9c7E4C57AF717": ["BALANCER", "BAL", 0],
    "0xDF613aF6B44a31299E48131e9347F034347E2F00": ["AAVE", "AAVE", 0],
    "0xDf6FF92bfDC1e8bE45177DC1f4845d391D3ad8fD": ["Compound", "COMP", 0],
    "0x062E66477Faf219F25D27dCED647BF57C3107d52": ["Bitcoin", "BTC", 0],
    "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a": ["Ethereum", "ETH", 0],
    "0x994047FE66406CbD646cd85B990E11D7F5dB8fC7": ["Polkadot", "DOT", 0],
    "0x0e517979C2c1c1522ddB0c73905e0D39b3F990c0": ["Cardano", "ADA", 0]
}


function getTokenNameAndSymbol(tokenAddress) {
    if(tokens[tokenAddress]) {
        const tokenInf = tokens[tokenAddress]
        //.slice() because we want to return copy of array not the reference to original array
        return tokenInf.slice()
    }
    
    return null
}

async function getTokenNameAndSymbolFromContract(tokenAddress) {
    const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-rpc.com/"
    )

    const abi = [
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const tokenContract = new ethers.Contract(tokenAddress, abi, provider)
    let tokenName, tokenSymbol
    tokenName = await tokenContract.name()
    tokenSymbol = await tokenContract.symbol()

    return [tokenName, tokenSymbol, 0]
}

export {
    getTokenNameAndSymbol,
    getTokenNameAndSymbolFromContract
}