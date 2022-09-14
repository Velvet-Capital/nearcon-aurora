import React, {useContext, useState} from "react"
import { Magic } from "magic-sdk"
import { ethers, providers } from "ethers"
import { toast } from "react-toastify"


import "./ConnectModal.css"

import GlobalContext from "../../context/GlobalContext/GlobalContext"


import VelvetImg from "../../assets/img/velvet.svg"
import MetamaskImg from "../../assets/img/metamask.webp"

const ConnectWalletModal = () => {

    const [email, setEmail] = useState("")

    const { 
        setCurrentAccount,
        setIsWalletConnected,
        setShowConnectWalletModal,
        showConnectWalletModal: show,
        setMagicProvider,
        setProvider
    } = useContext(GlobalContext)

    function toggleConnectWalletModal() {
        setShowConnectWalletModal((prevState) => !prevState)
    }

    async function signinWithMagicLink(e) {
        e.preventDefault()
        try {
            const magic = new Magic("pk_live_5A41A4690CAFE701")
            const didToken = await magic.auth.loginWithMagicLink({
                email: email,
            })

            const provider = new providers.Web3Provider(magic.rpcProvider)
            setMagicProvider(provider)
            const signer = provider.getSigner()
            setCurrentAccount(await signer.getAddress())
            setIsWalletConnected(true)
            toggleConnectWalletModal()
        } catch (err) {
            console.log(err)
            console.log("some error while login with magic link")
        }
    }

    async function connectWalletWithMetamask() {
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
                return
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" })
            setCurrentAccount(accounts[0])
            setIsWalletConnected(true)
            toggleConnectWalletModal()
            const provider = new ethers.providers.Web3Provider(ethereum)
            setProvider(provider)
        } catch (err) {
            console.log(err)
        }
    }

    if (!show) return null

    return (
        <>
            <div className="overlay" onClick={toggleConnectWalletModal}></div>
            <div className="connect-modal modal">
                <img
                    src={VelvetImg}
                    alt=""
                    className="connect-modal-velvet-logo horizontally-centred"
                />

                <h2 className="connect-modal-title">Create wallet</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    id="connect-modal-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button className="btn fn-md connect-modal-signup-btn" onClick={ signinWithMagicLink }>
                    Sign In
                </button>
                <div
                    className="flex"
                    style={{ justifyContent: "space-between", alignItems: "center" }}
                >
                    <hr style={{ width: "20%", opacity: 0.4 }} />
                    <h2 className="connect-modal-title my-30">Connect wallet</h2>
                    <hr style={{ width: "20%", opacity: 0.4 }} />
                </div>

                <button className="connect-modal-metamask-btn fn-md" onClick={ connectWalletWithMetamask }>
                    <span> Connect with Metamask</span>
                    <img src={MetamaskImg} alt="" />
                </button>

                <p className="text-center fn-vsm c-grey">
                    By connecting you agree to our{" "}
                    <a
                        href="https://acrobat.adobe.com/link/track?uri=urn:aaid:scds:US:54249449-1664-4b64-a11e-feb9dbcbf507"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <b>Terms of use and Privacy Policy</b>
                    </a>
                </p>
            </div>
        </>
    )
}

export default ConnectWalletModal
