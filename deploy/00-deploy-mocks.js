const { network } = require("hardhat")
const {developmentChains,DECIMALS,INITIAL_ANSWER} = require("../helper-hardhat-config")

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()//10.38.00 the secand(2)

    if(developmentChains.includes(network.name)){
        log("Local network detecetd! Deploying mocks... ")
        await deploy ("MockV3Aggregator",{
            contrac:"MockV3Aggregator",
            from: deployer,
            log: true,
            args:[DECIMALS,INITIAL_ANSWER] //10.46.0
        })
        log("Mocks deployd! ....")
        log("_____________________________________________")//10.47.0
    }
}
module.exports.tags = ["all","mocks"]  //10.49.31 error getnameAccount