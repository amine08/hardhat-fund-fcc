const networkConfig = {
    4: {
        name:"rinkeby",
        ethUsdPriceFeed: "0xkijnnodk",
    },
    137: {
        name:"polygon",
        ethUsdPriceFeed:"0xjndfonzdl"
    },
    11155111: {
        name:"sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}

const developmentChains = ["hardhat", "localhost"]

const DECIMALS = 8
const INITIAL_ANSWER = 200000000000

const contractAddress = {
    31337:{
        FundMe:{
            address:"0xc2724d1efa3e004391839573d8657787bc897d5d3e36bc5c9f69eadc736ecac5"
        },
       MockV3Aggregator:{
            address:"0x3d732abdeda8235691578f5eae48ec57c18e6860c18196ab7b211ca8f74dce2b"
        },
    }
}

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
    contractAddress,
}