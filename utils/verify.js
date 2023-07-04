const { run } = require("hardhat")

async function verify(contractAdress, args) {
    console.log("verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAdress,
            constructorArguments: args,
        })
    } catch (e) {        
        console.log("__----_____ e:")
        if (e.message.toLowerCase().includes("already verified ")) {
            console.log("already verified!")
        } else {
            console.log(e)
        }
    }
}
module.exports = { verify}