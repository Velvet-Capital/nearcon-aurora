import React, { useEffect, useContext, useState } from "react"
import { ethers, providers } from "ethers"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./styles/App.css"

/* Components */
import Header from "./components/Header/Header.jsx"
import SwapModal from "./components/SwapModal/SwapModal"
import ConnectWalletModal from "./components/ConnectModal/ConnectModal.jsx"
import CreateModal from "./components/CreateModal/CreateModal.jsx"
import SuccessOrErrorMsgModal from "./components/SuccessOrErrorMsgModal/SuccessOrErrorMsgModal.jsx"
import ProgressModal from "./components/ProgressModal/ProgressModal"

import PortfolioBoxesContainer from "./containers/PortfolioBoxesContainer/PortfolioBoxesContainer"

import CreateModalState from "./context/CreateModal/CreateModalState"
import GlobalContext from "./context/GlobalContext/GlobalContext"

import chainIdToChainName from "./utils/chainIdToChainName"

function App() {

    const [showSwapModal, setShowSwapModal] = useState(false)

    
    const { 
        setCurrentAccount, 
        setIsWalletConnected,
        setIsWrongNetwork,
        setCurrentBnbPrice,
        setCurrentChain,
        setProvider
    } = useContext(GlobalContext)

    async function checkIfWalletConnected() {
        try {
            const { ethereum } = window
            if (!ethereum) {
                toast.error("Get MetaMask -> https://metamask.io/", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                window.open("https://metamask.io/download/", "_blank")
                return
            }
            const accounts = await ethereum.request({ method: "eth_accounts" })
            if (accounts.length > 0) {
                setCurrentAccount(accounts[0])
                setIsWalletConnected(true)
                const provider = new ethers.providers.Web3Provider(ethereum)
                setProvider(provider)
            }
        } catch (err) {
            console.log(err)
        }
    }

    function getProviderOrSigner(needSigner = false) {
        try {
            const { ethereum } = window
            if (ethereum) {
                const provider = new providers.Web3Provider(ethereum)
                if (needSigner) return provider.getSigner()

                return provider
            }
        } catch (err) {
            console.log(err)
        }
    }

    function toggleSwapModal() {
        setShowSwapModal(prevState => !prevState);
    }

    useEffect(() => {
        checkIfWalletConnected()

        //fetching bnb price in BUSD
        fetch("https://api.binance.com/api/v3/ticker/price?symbol=BNBBUSD")
            .then((res) => res.json())
            .then((data) => {
                const price = data.price
                setCurrentBnbPrice(price)

            })
            .catch((err) => console.log(err))

        //checking isWrongNetwork or not
        const provider = getProviderOrSigner()
        if (provider) {
            provider.getNetwork().then(({ chainId }) => {
                if (chainId === 137 || chainId === 42220 || chainId === 100 || chainId === 1313161554) setIsWrongNetwork(false)
                else setIsWrongNetwork(true)

                switch(chainId) {
                    case 137:
                        setCurrentChain(chainIdToChainName[137])
                        break
                    case 42220:
                        setCurrentChain(chainIdToChainName[42220])
                        break
                    case 100:
                        setCurrentChain(chainIdToChainName[100])
                        break
                    case 25:
                        setCurrentChain(chainIdToChainName[25])
                        break
                    default:
                        break
                  }
            })
        }
    }, [])

    return (
        <div className="App">

            <Header 
                toggleSwapModal={toggleSwapModal}
            />

            <SwapModal 
                show={showSwapModal}
                toggleSwapModal={toggleSwapModal}
            />

            <ConnectWalletModal />

            <CreateModalState>

                <CreateModal />

                <ProgressModal />

                <SuccessOrErrorMsgModal />

                <h2 className="title fn-lg">Community Portfolios</h2>

                <PortfolioBoxesContainer />
            </CreateModalState>

            <ToastContainer />
            
        </div>
    )
}

export default App
