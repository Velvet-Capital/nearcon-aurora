import React, { createContext, useState } from "react"

const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState("")
    const [isWalletConnected, setIsWalletConnected] = useState(false)
    const [isWrongNetwork, setIsWrongNetwork] = useState(false)
    const [currentChain, setCurrentChain] = useState("")
    const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
    const [nativeTokenBalance, setNativeTokenBalance] = useState("0")
    const [currentBnbPrice, setCurrentBnbPrice] = useState('0')
    const [currentSafeGasPrice, setCurrentSafeGasPrice] = useState(null)
    const [magicProvider, setMagicProvider] = useState(null)
    const [provider, setProvider] = useState(null)


    const [userIndexTokensBalance, setUserIndexTokensBalance] = useState({
        TOP5: "0",
        BEST5: "0",
        VTOP10: "0",
        TOP10: "0"
    })

    const [ indexTokensRate, setIndexTokensRate ] = useState({
        TOP5: 1,
        BEST5: 1,
        VTOP10: 1,
        TOP10: 1
    })

    const states = {
        currentAccount,
        setCurrentAccount,
        isWalletConnected,
        setIsWalletConnected,
        isWrongNetwork,
        setIsWrongNetwork,
        currentChain,
        setCurrentChain,
        magicProvider, 
        setMagicProvider,
        showConnectWalletModal, 
        setShowConnectWalletModal,
        currentBnbPrice,
        setCurrentBnbPrice,
        currentSafeGasPrice,
        setCurrentSafeGasPrice,
        nativeTokenBalance,
        setNativeTokenBalance,
        userIndexTokensBalance,
        setUserIndexTokensBalance,
        indexTokensRate,
        setIndexTokensRate,
        provider, 
        setProvider
    }

    return (
        <GlobalContext.Provider value={states}>
            { children }
        </GlobalContext.Provider>
    )
}

export default GlobalContext