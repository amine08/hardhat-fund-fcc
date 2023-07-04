//
/*function deployfunc(){
    console.log('hello')
}
module.exports.default = deployfunc*/

const { network } = require("hardhat")
const {networkConfig,developmentChains} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")


/*module.exports = async (hre) => {
    const {getNameAccounts, deployments} = hre
}*/

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()//10.20.00
    const chainId = network.config.chainId

 //   const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if(developmentChains.includes(network.name)){
       const ethUsdAggregator = await deployments.get("MockV3Aggregator")
       ethUsdPriceFeedAddress = ethUsdAggregator.address 
    }else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    } 

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args:args, // put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address,args) //10.55.37
    }

    log("-____-___-_-_-_-_-_-_-_-_-_-_-") // 10.59.00 deploy on tesnet
}
module.exports.tags = ["all","fundme"] 