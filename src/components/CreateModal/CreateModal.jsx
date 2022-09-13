import React, { useState, useContext, useEffect} from "react"
import { providers, Contract, BigNumber, utils } from "ethers"
import { toast } from "react-toastify"
import "./CreateModal.css"
import "react-toastify/dist/ReactToastify.css"

import CreateModalContext from "../../context/CreateModal/CreateModalContext"
import GlobalContext from "../../context/GlobalContext/GlobalContext"

import CrossImg from "../../assets/img/cross.svg"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import MetaverseLogo from "../../assets/img/metaverse.svg"
import VenusLogo from "../../assets/img/venuslogo.png"

import {abi as indexSwapAbi } from "../../utils/abi/IndexSwapAbi"
import * as constants from "../../utils/constants.js"
import formatDecimal from "../../utils/formatDecimal"
import {chainNameToSymbol} from "../../utils/chainIdToChainName"
import AssetsLogo from "../../utils/assets_logo_helper.js"

const CreateModal = () => {
    const [amount, setAmount] = useState(BigNumber.from(0))
    const [hasEnoughFunds, setHasEnoughFunds] = useState(true)
    const [transactionType, setTransactionType]= useState("deposit")

    const {
        createModalPortfolioName: portfolioName,
        showCreateModal: show,
        toggleCreateModal: toggleModal,
        setProgressModalInf,
        setSuccessOrErrorModalInf
    } = useContext(CreateModalContext)

    const {
        currentAccount,
        bnbBalance,
        userIndexTokensBalance,
        setUserIndexTokensBalance,
        setCurrentSafeGasPrice,
        currentChain,
        nativeTokenBalance,
        setNativeTokenBalance
    } = useContext(GlobalContext)
    
    const createModalTitle = {
        META: "Metaverse",
        TOP5: "TOP5",
        TOP10: "TOP10",
        VTOP10: "Yield By Venus",
    }
    
    const indexTokenImg = {
        META: MetaverseLogo,
        TOP5: VelvetCapitalLogo,
        TOP10: VelvetCapitalLogo2,
        VTOP10: VenusLogo,
    }

    const BEST5_CONTRACT_ADDRESS = constants.BEST5_CONTRACT_ADDRESS;

    function checkHasEnoughFunds(amount, fund) {
        if (parseFloat(amount) > parseFloat(fund)) setHasEnoughFunds(false)
        else setHasEnoughFunds(true)
    }

    function toggleTransactionType() {
        if(transactionType === 'deposit') 
            // formatDecimal(userIndexTokensBalance[portfolioName]) > 0 && setTransactionType('withdraw')
            setTransactionType('withdraw')
        else
            setTransactionType('deposit')
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

    async function getUserTokenBalance(accountAddress) {
        const provider = getProviderOrSigner()
        let contractAddress
        switch(currentChain) {
            case "POLYGON":
                contractAddress = constants.TOP5_CONTRACT_ADDRESS_POLYGON
                break
            case "GNOSIS CHAIN":
                contractAddress = constants.TOP5_CONTRACT_ADDRESS_GNOSIS_CHAIN
                break
            case "CRONOS":
                contractAddress = constants.TOP5_CONTRACT_ADDRESS_CRONOS
                break
            case "CELO":
                // contractAddress
                break
            default:
                break
        }
        //Getting User TOP5 Balance
        const top5Contract = new Contract(
            contractAddress,
            indexSwapAbi,
            provider
        )
        const top5Balance = utils.formatEther(await top5Contract.balanceOf(accountAddress))

       const best5Contract = new Contract(
            BEST5_CONTRACT_ADDRESS,
            indexSwapAbi,
            provider
        )

        const best5Balance = utils.formatEther(await best5Contract.balanceOf(accountAddress))

        setUserIndexTokensBalance({
            TOP5: top5Balance,
            BEST5: best5Balance,
        })
    }

    async function getNativeTokenBalance(accountAddress) {
        const provider = getProviderOrSigner()
        const tokenBal = utils.formatEther(await provider.getBalance(accountAddress))
        setNativeTokenBalance(tokenBal)
    }

    function closeModal() {
        setAmount(BigNumber.from(0))
        setHasEnoughFunds(true)
        setTransactionType("deposit")
        toggleModal()
    }

    async function invest(portfolioName, amountToInvest) {
        closeModal()
        try {
            const signer = getProviderOrSigner(true)
            let contractAddress
            var tx;
            var txHash;
            switch(portfolioName) {
                case "TOP5":
                   
                    contractAddress = "0xa3a1eF5Ae6561572023363862e238aFA84C72ef5"
                    const cont = new Contract(contractAddress, indexSwapAbi, signer)
                    // const tx = await contract.investInFund("100",{ value: amountToInvest, gasLimit: 2_200_000 })
                     tx = await cont.swapExactTokensForTokens(amountToInvest,0,["0x2539152AEDB50976F11839ea8E63C0BC6Cc67f4D","0x10fCb712283eF80C1AAb410b26C969459C59E5D2"],currentAccount,Date.now());
                    txHash = tx.hash
                    break
                case "BEST5":
                    
                    contractAddress = "0xa3a1eF5Ae6561572023363862e238aFA84C72ef5"
                    const contract = new Contract(contractAddress, indexSwapAbi, signer)
                    tx = await contract.swapExactTokensForTokens(amountToInvest,0,["0x2539152AEDB50976F11839ea8E63C0BC6Cc67f4D","0xee72Fe32fC2fCAA7C6C8B5d77fFEcEA29F0e0109"],currentAccount,Date.now());
                    txHash = tx.hash
                    break
                case "CRONOS":
                    contractAddress = constants.TOP5_CONTRACT_ADDRESS_CRONOS
                    break
                case "CELO":
                    // contractAddress
                    break
                default:
                    break
            }

            

            //showing progress Modal till transaction is not mined
            setProgressModalInf({
                show: true,
                transactionType: "deposit",
                asset1Name: chainNameToSymbol[currentChain],
                asset1Amount: utils.formatEther(amountToInvest),
                asset2Name: portfolioName,
                asset2Amount: utils.formatEther(amountToInvest),
            })

            const receipt = tx.wait()

            receipt
                .then(async () => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "deposit",
                        amount: utils.formatEther(amountToInvest),
                        txHash: txHash,
                        status: 1,
                    })

                    getUserTokenBalance(currentAccount)
                    getNativeTokenBalance(currentAccount)
                })
                .catch((err) => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "deposit",
                        amount: utils.formatEther(amountToInvest),
                        txHash: txHash,
                        status: 0,
                    })
                    console.log(err)
                })
        } catch (err) {
            setProgressModalInf(prevState => ({...prevState, show: false}))
            console.log(err)
            if (err.code === -32603) {
                toast.error("Insufficient BNB Balance", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            } 
            else if(err.code === 4001) {
                toast.error("User Denied To Sign Transaction", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            } 
            else {
                toast.error("Some Error Occured", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
        }
    }

    async function withdraw(portfolioName, amountToWithdraw) {
        closeModal()
        try {
            const signer = getProviderOrSigner(true)
            let contractAddress
            switch(portfolioName) {
                case "TOP5":
                    contractAddress = constants.TOP5_CONTRACT_ADDRESS_POLYGON
                    break
                case "BEST5":
                    contractAddress = constants.BEST5_CONTRACT_ADDRESS
                    break
                case "CRONOS":
                    contractAddress = constants.TOP5_CONTRACT_ADDRESS_CRONOS
                    break
                case "CELO":
                    // contractAddress
                    break
                default:
                    break
            }

            console.log(portfolioName)
            const contract = new Contract(contractAddress, indexSwapAbi, signer)

            //showing progress Modal till transaction is not mined
            setProgressModalInf({
                show: true,
                transactionType: "withdraw",
                asset1Name: chainNameToSymbol[currentChain],
                asset1Amount: utils.formatEther(amountToWithdraw),
                asset2Name: "TOP5",
                asset2Amount: utils.formatEther(amountToWithdraw),
            })

            let txHash
            const tx = await contract.withdrawFund(amountToWithdraw.toString(),"100",false, {
                    gasLimit: 2_200_000
                })
            txHash = tx.hash
            const receipt = tx.wait()

            receipt
                .then(async () => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "withdraw",
                        amount: utils.formatEther(amountToWithdraw),
                        txHash: txHash,
                        status: 1,
                    })
                    getUserTokenBalance(currentAccount)
                    getNativeTokenBalance(currentAccount)
                })
                .catch((err) => {
                    //hiding progress Modal - transaction is completed
                    setProgressModalInf(prevState => ({...prevState, show: false}))
                    setSuccessOrErrorModalInf({
                        show: true,
                        portfolioName: portfolioName,
                        transactionType: "withdraw",
                        amount: utils.formatEther(amountToWithdraw),
                        txHash: txHash,
                        status: 0,
                    })
                    console.log(err)
                })
        } catch (err) {
            //hiding progress Modal - transaction is completed
            setProgressModalInf(prevState => ({...prevState, show: false}))
            console.log(err)
            if (err.code === -32603) {
                toast.error(`Insufficient ${portfolioName} Balance`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            } 
            else if (err.code === 4001) {
                toast.error("User Denied To Sign Transaction", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
            else {
                toast.error("Some Error Occured", {
                    position: "top-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                })
            }
        }
    }

    useEffect(() => {
       //fetching current safe gas price
       fetch(
        "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=AJ4KP2CIWV6DWF2SSPQ5SX16C9YZ78B2B4"
    )
        .then((res) => res.json())
        .then((data) => {
            const safeGasPrice = data.result.SafeGasPrice
            setCurrentSafeGasPrice(safeGasPrice)
        })
        .catch((err) => console.log(err))
    }, [])

    if (!show) return null

    return (
        <>
            <div
                className="overlay"
                onClick={closeModal}
            ></div>
            <div className="modal create-modal">
                <img
                    src={CrossImg}
                    alt=""
                    id="create-modal-cancle"
                    className="cursor-pointer"
                    onClick={closeModal}
                />

                <div className="create-modal-details">
                    <img src={indexTokenImg[portfolioName]} alt="" id="create-modal-logo" />
                    <span>{createModalTitle[portfolioName]}</span>
                </div>
                <div className="create-modal-action-tab flex">
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            toggleTransactionType()
                            checkHasEnoughFunds(amount.toString(), nativeTokenBalance)
                        }}
                    >
                        <span className={transactionType === "withdraw" && "unactive"}>
                            Deposit
                        </span>
                        <div
                            className={`line ${transactionType === "deposit" && "active"}`}
                        ></div>
                    </div>
                    <div
                        className={ formatDecimal(userIndexTokensBalance[portfolioName]) > 0 ? "cursor-pointer" : "cursor-pointer"}
                        onClick={() => {
                            toggleTransactionType()
                            checkHasEnoughFunds(amount.toString(), userIndexTokensBalance[portfolioName])
                        }}
                    >
                        <span className={transactionType === "deposit" && "unactive"}>
                            Withdraw
                        </span>
                        <div
                            className={`line ${transactionType === "withdraw" && "active"}`}
                        ></div>
                    </div>
                </div>

                <div className="create-modal-inputs flex">
                    <div className="create-modal-token-input">
                        <span className="fn-sm">Token</span>
                        <div className="create-modal-asset-dropdown flex">
                                <>
                                    <img src={transactionType === "deposit" ? AssetsLogo[chainNameToSymbol[currentChain]] : indexTokenImg[portfolioName]} alt="" />
                                    <span
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: 500,
                                            color: "#262626",
                                        }}
                                    >
                                        {transactionType === "deposit" ? chainNameToSymbol[currentChain] : portfolioName}
                                    </span>
                                </>
                        </div>
                    </div>
                    <div className="create-modal-amount-input">
                        {hasEnoughFunds ? (
                            <>
                                <span className="fn-sm">Amount</span>
                                {
                                    transactionType === "withdraw" && (
                                        <span
                                        className="create-modal-max-btn cursor-pointer"
                                        onClick={() => setAmount(userIndexTokensBalance[portfolioName].slice(0, -7))}
                                        >
                                            Max
                                        </span>
                                    )
                                }
                            </>
                        ) : (
                            <span className="c-red fn-sm">Not enough funds</span>
                        )}
                        <input
                            type="number"
                            className={hasEnoughFunds ? "block" : "block border-red"}
                            placeholder={
                                transactionType === "deposit"
                                    ? "max " + formatDecimal(nativeTokenBalance) + chainNameToSymbol[currentChain]
                                    : "max " +
                                      formatDecimal(userIndexTokensBalance[portfolioName]) +
                                      " " +
                                      portfolioName
                            }
                            value={amount == "0" ? null : amount}
                            onChange={(e) => {
                                e.target.value <= 1000000000 && setAmount(e.target.value)
                                if (transactionType === "deposit") {
                                    checkHasEnoughFunds(e.target.value, nativeTokenBalance)
                                } else {
                                    checkHasEnoughFunds(e.target.value, userIndexTokensBalance[portfolioName])
                                }
                            }}
                        />
                    </div>
                </div>

                <button
                    className="create-modal-action-btn btn fn-md"
                    data-portfolio-name={portfolioName}
                    disabled={!hasEnoughFunds || parseFloat(amount.toString()) === 0}
                    style={hasEnoughFunds && parseFloat(amount.toString()) > 0 && amount.toString() !== "" ? { opacity: 1 } : { opacity: 0.5 }}
                    onClick={
                        transactionType === "deposit"
                            ? () => {
                                setAmount(BigNumber.from(0))
                                invest(
                                    portfolioName,
                                    utils.parseEther(amount.toString())
                                )
                            }
                            : () => {
                                setAmount(BigNumber.from(0))
                                withdraw(
                                    portfolioName,
                                    utils.parseEther(amount.toString())
                                )
                            }
                    }
                >
                    {transactionType === "deposit"
                        ? "Deposit"
                        : "Withdraw"}
                </button>

            </div>
        </>
    )
}

export default CreateModal
