import React, {useContext, useState, useEffect} from "react"
import { providers } from "ethers"
import Tippy from "@tippy.js/react"
import { toast } from "react-toastify"
import "./Header.css"
import "../../styles/utils.css"

import GlobalContext from "../../context/GlobalContext/GlobalContext"

import GhostLogo from "../../assets/img/ghost-logo.png"
import Logo from "../../assets/img/headerlogo.png"
import WalletNotConnectedImg from "../../assets/img/wallet-notconnected.png"
import WalletConnectedImg from "../../assets/img/wallet-connected.png"
import ArrowUPImg from "../../assets/img/chevron-down (1).svg"
import ArrowDownImg from "../../assets/img/chevron-down.svg"
import ExitImg from "../../assets/img/exit.svg"
import CopyImg from "../../assets/img/copyicon.png"
import WrongNetworkImg from "../../assets/img/wrong-network.svg"

import {chainNameToSymbol} from "../../utils/chainIdToChainName"
import AssetsLogo from "../../utils/assets_logo_helper.js"

const Header = ({toggleSwapModal}) => {

    const [showHeaderDropdownMenu, setShowHeaderDropdownMenu] = useState(false)
    const [showChainList, setShowChainList] = useState(false)
    const chainList = ["POLYGON", "GNOSIS CHAIN", "CELO", "CRONOS"]

    const { 
        currentAccount,
        isWalletConnected, 
        setIsWalletConnected,
        isWrongNetwork,
        setIsWrongNetwork,
        setShowConnectWalletModal,
        bnbBalance,
        currentBnbPrice, 
        currentChain,
        setCurrentChain,
        nativeTokenBalance
    } = useContext(GlobalContext)

    // async function switchChain(chainName) {
    //     try {
    //         const chainData = {}

    //         switch(chainName) {
    //             case "POLYGON":
    //                 chainData.chainId = "0x89"
    //                 chainData.rpcUrls = ["https://polygon-mainnet.infura.io/v3/295cce92179b4be498665b1b16dfee34"]
    //                 chainData.chainName = "Polygon"
    //                 chainData.nativeCurrency = {
    //                     name: "Matic",
    //                     symbol: "MATIC",
    //                     decimals: 18
    //                 }
    //                 chainData.blockExplorerUrls = ["https://polygonscan.com"]
    //                 break

    //             case "GNOSIS CHAIN":
    //                 chainData.chainId = "0x64"
    //                 chainData.rpcUrls = ["https://rpc.gnosischain.com/"]
    //                 chainData.chainName = "GNOSIS CHAIN"
    //                 chainData.nativeCurrency = {
    //                     name: "xDai",
    //                     symbol: "xDai",
    //                     decimals: 18
    //                 }
    //                 chainData.blockExplorerUrls = ["https://blockscout.com/xdai/mainnet/"]
    //                 break

    //             case "CELO":
    //                 chainData.chainId = "0xA4EC"
    //                 chainData.rpcUrls = ["https://forno.celo.org"]
    //                 chainData.chainName = "Celo"
    //                 chainData.nativeCurrency = {
    //                     name: "Celo",
    //                     symbol: "CELO",
    //                     decimals: 18
    //                 }
    //                 chainData.blockExplorerUrls = ["https://explorer.celo.org"]
    //                 break

            
    //             case "CRONOS":
    //                 chainData.chainId = "0x19"
    //                 chainData.rpcUrls = ["https://evm.cronos.org"]
    //                 chainData.chainName = "Cronos"
    //                 chainData.nativeCurrency = {
    //                     name: "Cronos",
    //                     symbol: "CRO",
    //                     decimals: 18
    //                 }
    //                 chainData.blockExplorerUrls = ["https://cronoscan.com/"]
    //                 break
                
    //             default:
    //                 break
    //         } 

    //         //switching chian
    //         await window.ethereum.request({
    //         method: "wallet_addEthereumChain",
    //         params: [
    //             {
    //                 chainId: chainData.chainId,
    //                 rpcUrls: chainData.rpcUrls,
    //                 chainName: chainData.chainName,
    //                 nativeCurrency: chainData.nativeCurrency,
    //                 blockExplorerUrls: chainData.blockExplorerUrls,
    //             },
    //         ],
    //         })
    //         const provider = new providers.Web3Provider(window.ethereum)
    //         const { chainId } = await provider.getNetwork()
    //         if (chainId === 137 || chainId === 42220 || chainId === 100 || chainId === 25) {
    //             setIsWrongNetwork(false)

    //             switch (chainId) {
    //                 case 137: 
    //                     setCurrentChain("POLYGON")
    //                     break
    //                 case 100:
    //                     setCurrentChain("GNOSIS CHAIN")
    //                     break
    //                 case 42220:
    //                     setCurrentChain("CELO")
    //                     break
    //                 case 25:
    //                     setCurrentChain("CRONOS")
    //                     break
    //                 default:
    //                     setCurrentChain("")
    //             }
    //         }
    //     }
    //     catch(err) {
    //         console.log(err)
    //     }
    // }

    function copyWalletAddress(portfolioName) {
        console.log(currentAccount)
        navigator.clipboard.writeText(currentAccount)
    }

    function disconnectWallet() {
        setIsWalletConnected(false)
        toggleHeaderDropdownMenu()
    }

    function toggleHeaderDropdownMenu() {
        setShowHeaderDropdownMenu((prevState) => !prevState)
    }

    function toggleChainList() {
        setShowChainList((prevState) => !prevState)
    }

    function toggleConnectWalletModal() {
        setShowConnectWalletModal((prevState) => !prevState)
    }
    return (
        <div className="header">
            <img src={GhostLogo} alt="" id="ghost-logo" draggable="false" />
            <img src={Logo} alt="" id="header-logo" draggable="false" />

            {isWalletConnected && currentChain === "POLYGON" && !isWrongNetwork && (
                <button className="btn get-matic-btn c-purple" onClick={() => toggleSwapModal()}>
                    Get Matic
                </button>
            )}

            {/* { <div className="chain-selector">
                <div className="select-field" onClick={toggleChainList}>
                    <div className="selected-chain">
                        {
                            isWrongNetwork ? (
                                <span className="c-red">Wrong Network</span>
                            ): (
                                <>
                                    <img className="chain-img" src={AssetsLogo[chainNameToSymbol[currentChain]]} alt="" />
                                    <span className="c-purple">{currentChain}</span>
                                </>
                            )
                        }
                    </div>
                    <img src={showChainList ? ArrowUPImg : ArrowDownImg} alt="" />
                </div>

                {
                    showChainList && (
                        <ul className="chain-list">
                            {
                                chainList.filter((chain) => chain !== currentChain)
                                    .map((chain) => {
                                        return (
                                        <li className="chain-item cursor-pointer" key={chain} onClick={() => switchChain(chain)}>
                                            <img className="chain-img" src={AssetsLogo[chainNameToSymbol[chain]]} alt="" />
                                            <span className="c-purple">{chain}</span>
                                        </li>
                                        )
                                    })
                            }
                        </ul>
                    )
                }
            </div> } */}

            {isWrongNetwork && (
                <>
                    <div className="header-wrong-network-rounded-box flex">
                        <img src={WrongNetworkImg} alt="" style={{ width: "19px" }} />
                        <p>Wrong Network</p>
                    </div>
                </>
            )}

            {!isWalletConnected ? (
                <button className={isWrongNetwork ? "connect-btn border-red" : "connect-btn"} onClick={() => toggleConnectWalletModal()}>
                    <img
                        src={isWalletConnected ? WalletConnectedImg : WalletNotConnectedImg}
                        alt=""
                    />
                    <span className="fn-sm">Connect a wallet</span>
                </button>
            ) : (
                <button
                    className={isWrongNetwork ? "connect-btn border-red" : "connect-btn"}
                    onClick={toggleHeaderDropdownMenu}
                >
                    <img
                        src={isWalletConnected ? WalletConnectedImg : WalletNotConnectedImg}
                        alt=""
                    />
                    <span className="fn-sm">
                        {currentAccount.slice(0, 4) + "..." + currentAccount.slice(-3)}
                    </span>
                    <img
                        src={showHeaderDropdownMenu ? ArrowUPImg : ArrowDownImg}
                        className="connect-btn-icon"
                        alt=""
                    />
                </button>
            )}

            {showHeaderDropdownMenu && (
                <div className="header-dropdown-menu">
                    <div className="header-dropdown-menu-wallet-address pr-10">
                        <p className="fn-vsm">Wallet Address</p>
                        <span className="c-purple font-semibold">
                            {currentAccount.slice(0, 6) + "..." + currentAccount.slice(-4)}
                        </span>
                        <Tippy
                            placement="top"
                            animation="scale"
                            content="Copied!"
                            hideOnClick={false}
                            trigger="click"
                            onShow={(instance) => {
                                setTimeout(() => {
                                    instance.hide()
                                }, 1000)
                            }}
                        >
                            <img
                                className="cursor-pointer"
                                src={CopyImg}
                                alt=""
                                style={{ width: "18px", marginLeft: "10px" }}
                                onClick={copyWalletAddress}
                            />
                        </Tippy>
                    </div>
                    <hr style={{ opacity: 0.5 }} />
                    <div className="header-dropdown-menu-wallet-balance">
                        <p className="fn-vsm">Wallet balance</p>
                        <span className="c-purple font-semibold">
                            {parseFloat(nativeTokenBalance).toLocaleString("en-US", {
                                maximumFractionDigits: 4,
                            })} 
                            {" "}
                            {chainNameToSymbol[currentChain]}
                        </span>
                    </div>
                    <hr style={{ opacity: 0.5 }} />
                    <div className="cursor-pointer" onClick={disconnectWallet}>
                        <span className="fn-sm">Disconnect</span>
                        <img src={ExitImg} alt="" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Header
