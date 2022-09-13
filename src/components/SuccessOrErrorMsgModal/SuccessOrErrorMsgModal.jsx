import React, { useContext } from "react"
import "./SuccessOrErrorMsgModal.css"

import CreateModalContext from "../../context/CreateModal/CreateModalContext"
import GlobalContext from "../../context/GlobalContext/GlobalContext"

import CrossImg from "../../assets/img/cross.svg"
import SuccessImg from "../../assets/img/success-mark.svg"
import ErrorImg from "../../assets/img/error-mark.svg"
import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import StraightLine from "../../assets/img/straightline.svg"
import Circle from "../../assets/img/circle.svg"

import * as constants from "../../utils/constants.js"
import {chainNameToSymbol} from "../../utils/chainIdToChainName"
import AssetsLogo from "../../utils/assets_logo_helper.js"


const SuccessOrErrorMsgModal = () => {
    const {
        setSuccessOrErrorModalInf,
        successOrErrorModalInf: { show, portfolioName, transactionType, amount, txHash, status },
    } = useContext(CreateModalContext)

    const { 
        currentChain
    } = useContext(GlobalContext)

    function toggleSuccessOrErrorMsgModal() {
        if (show) setSuccessOrErrorModalInf((prevState) => ({ ...prevState, show: false }))
        else setSuccessOrErrorModalInf((prevState) => ({ ...prevState, show: true }))
    }

    async function addTokenToWallet(tokenSymbol) {
        let contractAddress
        try {
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
            //adding token to metamask wallet
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: contractAddress,
                        symbol: tokenSymbol,
                        decimals: 18,
                    },
                },
            })
        } catch (err) {
            console.log(err)
        }
    }

    if (!show) return null

    return (
        <>
            <div className="overlay" onClick={toggleSuccessOrErrorMsgModal}></div>
            <div className="modal success-or-error-msg-modal">
                <img
                    src={CrossImg}
                    alt=""
                    id="success-or-error-msg-modal-cancle"
                    className="cursor-pointer"
                    onClick={toggleSuccessOrErrorMsgModal}
                />
                {status === 1 ? (
                    <>
                        <div className="success-or-error-msg-modal-details flex">
                            <img
                                src={StraightLine}
                                alt=""
                                style={{ position: "absolute", zIndex: -1 }}
                            />

                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", right: "-20%", top: "-18%" }}
                                />
                                <img
                                    src={
                                        transactionType === "deposit"
                                            ? AssetsLogo[chainNameToSymbol[currentChain]]
                                            : AssetsLogo[portfolioName]
                                    }
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>

                            <div>
                                <img src={SuccessImg} alt="" style={{ width: "64px" }} />
                            </div>

                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", left: "-20%", top: "-18%" }}
                                />
                                <img
                                    src={
                                        transactionType !== "deposit"
                                            ? AssetsLogo[chainNameToSymbol[currentChain]]
                                            : AssetsLogo[portfolioName]
                                    }
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>
                        </div>

                        <h2
                            className="success-or-error-msg-modal-title c-purple text-center"
                            style={{ fontSize: "30px", margin: "20px 0" }}
                        >
                            Success!
                        </h2>

                        {transactionType === "deposit" && (
                            <>
                                <p
                                    className="c-purple text-center fn-md cursor-pointer"
                                    onClick={() =>
                                        addTokenToWallet(
                                            portfolioName
                                        )
                                    }
                                    style={{ marginBottom: "10%" }}
                                >
                                    <u>
                                        Click here to Add <b>{portfolioName}</b> Token to your
                                        wallet
                                    </u>
                                </p>
                            </>
                        )}

                        <button
                            className="btn success-or-error-msg-modal-btn fn-md font-bold"
                            onClick={toggleSuccessOrErrorMsgModal}
                            style={transactionType === "withdraw" ? { marginTop: "14%" } : {}}
                        >
                            Back to portfolios
                        </button>
                    </>
                ) : (
                    <>
                        <div className="success-or-error-msg-modal-details flex">
                            <img
                                src={StraightLine}
                                alt=""
                                style={{ position: "absolute", zIndex: -1 }}
                            />

                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", right: "-20%", top: "-18%" }}
                                />
                                <img
                                    src={
                                        transactionType === "deposit"
                                            ? AssetsLogo[chainNameToSymbol[currentChain]]
                                            : AssetsLogo[portfolioName]
                                    }
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>

                            <div>
                                <img src={ErrorImg} alt="" style={{ width: "64px" }} />
                            </div>

                            <div>
                                <img
                                    src={Circle}
                                    alt=""
                                    style={{ position: "absolute", left: "-20%", top: "-18%" }}
                                />
                                <img
                                    src={
                                        transactionType !== "deposit"
                                            ? AssetsLogo[chainNameToSymbol[currentChain]]
                                            : AssetsLogo[portfolioName]
                                    }
                                    alt=""
                                    style={{ width: "50px" }}
                                />
                            </div>
                        </div>

                        <h2
                            className="success-or-error-msg-modal-title c-purple text-center"
                            style={{ fontSize: "30px", marginTop: "30px" }}
                        >
                            Error!
                        </h2>

                        <p
                            className="success-or-error-msg-modal-message c-purple text-center fn-md"
                            style={{ margin: "20px 0" }}
                        >
                            Looks like this transaction has failed, it happens sometimes due to
                            network congestion, please try again
                        </p>

                        <button
                            className="btn success-or-error-msg-modal-btn fn-md font-bold"
                            onClick={toggleSuccessOrErrorMsgModal}
                        >
                            Try again
                        </button>
                    </>
                )}

                {/* <a
                    className="success-or-error-msg-modal-blockexplorer-link"
                    href={`https://bscscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <p className="text-center font-semibold c-grey"> View Txn On Bscscan </p>
                </a> */}
            </div>
        </>
    )
}

export default SuccessOrErrorMsgModal
