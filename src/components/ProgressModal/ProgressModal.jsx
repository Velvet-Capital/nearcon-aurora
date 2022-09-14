import React, { useContext } from "react"
import "./ProgressModal.css"

import Spinner from "../Spinner/Spinner"

import GlobalContext from "../../context/GlobalContext/GlobalContext"
import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import StraightLine from "../../assets/img/straightline.svg"
import Circle from "../../assets/img/circle.svg"

import AssetsLogo from "../../utils/assets_logo_helper.js"


const ProgressModal = () => {
    const {
        setProgressModalInf,
        progressModalInf: {
            show,
            transactionType,
            asset1Name,
            asset1Amount,
            asset2Name,
            asset2Amount,
        },
    } = useContext(CreateModalContext)

    const tokensImg = {
        TOP5: VelvetCapitalLogo,
    }

    function toggleProgressModal() {
        if (show) setProgressModalInf((prevState) => ({ ...prevState, show: false }))
        else setProgressModalInf((prevState) => ({ ...prevState, show: true }))
    }

    if (!show) return null

    return (
        <div>
            <div className="overlay" onClick={() => toggleProgressModal()}></div>
            <div className="modal progress-modal">
                <div className="progress-modal-details flex">
                    <img
                        src={StraightLine}
                        alt=""
                        style={{ position: "absolute", zIndex: -1, width: "46%" }}
                    />
                    <div>
                        <img
                            src={Circle}
                            alt=""
                            style={{ position: "absolute", right: "-20%", top: "-18%" }}
                        />
                        <img src={AssetsLogo[asset1Name]} alt="" style={{ width: "50px" }} />
                    </div>
                    <div>
                        <Spinner />
                    </div>
                    <div>
                        <img
                            src={Circle}
                            alt=""
                            style={{ position: "absolute", left: "-20%", top: "-18%" }}
                        />
                        <img src={AssetsLogo[asset2Name]} alt="" style={{ width: "50px" }} />
                    </div>
                </div>

                <p className="text-center c-purple font-semibold" style={{ fontSize: "30px", marginTop: "20px" }}>
                    Transaction in progress...
                </p>

                <p className="text-center c-purple" style={{ fontSize: "16px", marginTop: "45px" }}>
                    (please press <b>"Confirm"</b> in your Metamask wallet)
                </p>
            </div>
        </div>
    )
}

export default ProgressModal
