import React, { useState, useContext, useEffect } from "react"
import { providers, Contract, utils, ethers } from "ethers"
import "./PortfolioBoxesContainer.css"

import GlobalContext from "../../context/GlobalContext/GlobalContext"
import CreateModalContext from "../../context/CreateModal/CreateModalContext"

import PortfolioBox from "../../components/PortfolioBox/PortfolioBox"

import VelvetCapitalLogo from "../../assets/img/newvelvetcapitallogo.svg"
import VelvetCapitalLogo2 from "../../assets/img/velvetcapitallogo2.svg"
import BluechipAssetsImg from "../../assets/img/bluechipassets.png"
import Best5AssetImg from "../../assets/img/best5assetimg.png"
import DefiAssetImg from "../../assets/img/defiassetimg.png"
import Covalant from "../../lib/covalent";

import {abi as indexSwapAbi } from "../../utils/abi/IndexSwapAbi";
import {abi as iercAbi } from "../../utils/abi/iercAbi"
import {abi as indexSwapLibraryAbi } from "../../utils/abi/indexSwapLibraryAbi"
import * as constants from "../../utils/constants.js"
import {
    getTokenNameAndSymbol,
    getTokenNameAndSymbolFromContract,
} from "../../utils/tokens_information.js"
import AssetsLogo from "../../utils/assets_logo_helper.js"


const PortfolioBoxesContainer = () => {
    const TOTAL_WEIGHT = 10_000

    const [top5Tokens, setTop5Tokens] = useState(null)
    const [best5Tokens, setBest5Tokens] = useState(null)
    const [numberHolderTop5, setNumberHolderTop5] = useState(null)
    const [balanceHolderTop5,setbalanceHolderTop5] = useState(null)
    const {
        currentAccount,
        isWalletConnected,
        currentBnbPrice,
        userIndexTokensBalance,
        setUserIndexTokensBalance,
        setNativeTokenBalance,
        provider,
        currentChain
    } = useContext(GlobalContext)

    const {
        createModalPortfolioName,
    } = useContext(CreateModalContext)

    async function getNativeTokenBalance(accountAddress) {
        //call this function only if wallet is connected
        const tokenContract = "0x2539152AEDB50976F11839ea8E63C0BC6Cc67f4D"
        const token1 = new Contract(tokenContract,iercAbi,provider)
        const tokenBal = utils.formatEther(await token1.balanceOf(accountAddress))
        setNativeTokenBalance(tokenBal)
    }
    const BEST5_CONTRACT_ADDRESS = constants.BEST5_CONTRACT_ADDRESS;

    async function getUserTokenBalance(accountAddress) {
        //call this function only if wallet is connected
        let contractAddress;
        let chainID;
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
            break;
            case "AUORA":
                // contractAddress
                contractAddress = constants.TOP5_CONTRACT_ADDRESS_AUORA;
                chainID= 1313161554;
                break;
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
        console.log(top5Balance)

        const best5Contract = new Contract(
            BEST5_CONTRACT_ADDRESS,
            indexSwapAbi,
            provider
        )

        const best5Balance = utils.formatEther(await best5Contract.balanceOf(accountAddress))
        console.log(best5Balance);

        setUserIndexTokensBalance({
            TOP5: top5Balance,
            BEST5: best5Balance,
        })
        const holderDefi= Covalant.getTokenHolders(chainID,contractAddress);
        setNumberHolderTop5(holderDefi);
        const balanceTop5= Covalant.getTokenBalances(chainID,contractAddress);

        setbalanceHolderTop5(balanceTop5);
    }
    }

    async function getTokensAddressAndWeight() {
        //function to get Tokens Address and their weight in a Index
        if(currentChain) {
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
                break;
                case "auora":
                    contractAddress = constants.TOP5_CONTRACT_ADDRESS_AUORA
                break
                default:
                    break
            }
    
            //Getting TOP5 Index Tokens Addresses and Weight
            const top5Contract = new Contract(
                contractAddress,
                indexSwapAbi,
                provider
            )

            const best5Contract = new Contract(
                BEST5_CONTRACT_ADDRESS,
                indexSwapAbi,
                provider
            )
    
            const top5TokensAddress = await top5Contract.getTokens()
            const best5TokenAddress = await best5Contract.getTokens()

            let top5TokensInformation = []
            let best5TokenInformation = []

            for (const tokenAddress of top5TokensAddress) {
                const tokenInf = getTokenNameAndSymbol(tokenAddress)
                top5TokensInformation.push(tokenInf)
            }

            for (const tokenAddress of best5TokenAddress) {
                const tokenInf = getTokenNameAndSymbol(tokenAddress)
                best5TokenInformation.push(tokenInf)
                // console.log(tokenInf);
            }
    
            for (const [i, tokenAddress] of top5TokensAddress.entries()) {
                const result = await top5Contract.getRecord(tokenAddress)
                let allocation = (result.denorm.toString() / TOTAL_WEIGHT) * 100
                top5TokensInformation[i][2] = allocation
            }

            for (const [i, tokenAddress] of best5TokenAddress.entries()) {
                const result = await best5Contract.getRecord(tokenAddress)
                let allocation = (result.denorm.toString() / TOTAL_WEIGHT) * 100
                best5TokenInformation[i][2] = allocation
            }
            setTop5Tokens(top5TokensInformation)
            setBest5Tokens(best5TokenInformation)
        }
    }

    useEffect(() => {
        window.ethereum.on('networkChanged', (networkId) => {
            console.log('networkChanged',networkId);
            window.location.reload();
        });
    }, [])

    useEffect(() => {
        getNativeTokenBalance(currentAccount)
        const asyncGetUserTokenBalance = async () => {
            await getUserTokenBalance(currentAccount)
        }
        asyncGetUserTokenBalance()
    }, [provider, currentChain])
    
    useEffect(() => {
        getTokensAddressAndWeight()
    }, [provider, currentChain])
    
    useEffect(() => {
        // const asyncGetIndexVaultBalanceAndIndexTokenTotalSupply = async () => {
        //     const { top5VaultBalance, metaVaultBalance, top10VaultBalance, vtop10VaultBalance } = await getIndexVaultBalance()
        //     const { top5TotalSupply, metaTotalSupply, vtop10TotalSupply, top10TotalSupply } = await getTokensTotalSupply()
        //     setIndexTokensRate({
        //         TOP5: top5VaultBalance / top5TotalSupply,
        //         META: metaVaultBalance / metaTotalSupply,
        //         VTOP10: vtop10VaultBalance / vtop10TotalSupply,
        //         TOP10: top10VaultBalance / top10TotalSupply
        //     })
        // }
        // asyncGetIndexVaultBalanceAndIndexTokenTotalSupply()
    }, [])

    return (
        <div className="container">
            <>
                <PortfolioBox
                    logo={VelvetCapitalLogo}
                    title="TOP-5 DeFi"
                    portfolioName="TOP5"
                    creator="Velvet"
                    tippyContent="Top 5 DeFi cryptocurrencies by total market capitalization excluding stablecoins, equally weighted, rebalanced weekly"
                    assetsImg={DefiAssetImg}
                    indexTokenBalance={userIndexTokensBalance["TOP5"]}
                    numberOfInvestors={numberHolderTop5}
                    currentBnbPrice={currentBnbPrice}
                    tokens={top5Tokens}
                />
       
            </>
            <>
                <PortfolioBox
                    logo={VelvetCapitalLogo}
                    title="BEST-5 TVL"
                    portfolioName="BEST5"
                    creator="Velvet"
                    tippyContent="Best 5 cryptocurrencies by TVL as per DeFi Lama excluding stablecoins, equally weighted, rebalanced weekly"
                    assetsImg={Best5AssetImg}
                    indexTokenBalance={userIndexTokensBalance["BEST5"]}
                    numberOfInvestors="10,534"
                    currentBnbPrice={currentBnbPrice}
                    tokens={best5Tokens}
                />
       
            </>
        </div>       
    )
}

export default PortfolioBoxesContainer
