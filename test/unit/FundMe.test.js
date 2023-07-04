//11.08.36 // testing

const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", function () {
          let fundMe, deployer, mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1") // 1eth

          beforeEach(async () => {
              //deploy fundme contract
              //using hardhat-deploy
              //const {chainId} = await ethers.provider.getNetwork()
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })
          describe("constractor", function () {
              it("sete the aggregatore address corectly", async () => {
                  const response = await fundMe.getpriceFeed()

                  assert.equal(response, mockV3Aggregator.address) //11.17.40
              })
          })

          describe("fund", async function () {
              it("fails if you don't send enogh ETH", async function () {
                  await expect(fundMe.fund()).to.be.reverted //With(
                  //      "you nide to spend more ETH"
                  //  )
              })

              it("it update the amount funded data structor", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getaddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("add funder to array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getfunders(0)
                  assert.equal(funder, deployer)
              })
          })
          describe("withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("withdraw ETH from a single founder", async function () {
                  //arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  //act
                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalanc = await fundMe.provider.getBalance(
                      deployer
                  )
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalanc.add(gasCost).toString()
                  )
                  // we use bigNumber so instad of + use add()
                  // fundMe withdraw spend gasFees (gasCost)
                  //11.31.05
              })
              it("allow us to withdraw multipel funders", async function () {
                  const accounts = await ethers.getSigners()
                  for (i = 1; i > 6; i++) {
                      const fundMeConectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalanc = await fundMe.provider.getBalance(
                      deployer
                  )
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalanc.add(gasCost).toString()
                  )
                  await expect(fundMe.getfunders(0)).to.be.reverted
                  for (i = 1; i > 6; i++) {
                      assert.equal(
                          await fundMe.getaddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("only allows the owner to withdraw", async function () {
                  const accounts = ethers.getSigners()
                  const attaker = accounts[1]
                  const attakerConnectedContract = await fundMe.connect(attaker)
                  await expect(attakerConnectedContract.withdraw()).to.be
                      .reverted
              }) ///11.56.00
              it("allow us to withdraw multipel funders", async function () {
                  const accounts = await ethers.getSigners()
                  for (i = 1; i > 6; i++) {
                      const fundMeConectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)

                  const transactionResponse = await fundMe.chiperWithdraw()
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  )
                  const endingDeployerBalanc = await fundMe.provider.getBalance(
                      deployer
                  )
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalanc.add(gasCost).toString()
                  )
                  await expect(fundMe.getfunders(0)).to.be.reverted
                  for (i = 1; i > 6; i++) {
                      assert.equal(
                          await fundMe.getaddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
          })
      })
