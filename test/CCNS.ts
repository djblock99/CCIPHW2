import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import hre from "hardhat";

describe("HW 2", function () {

  //Create Instance
  async function deployFixture() {
      const localSimulatorFactory = await hre.ethers.getContractFactory("CCIPLocalSimulator");
      const localSimulator = await localSimulatorFactory.deploy();
      const [alice, bob] = await hre.ethers.getSigners();
      return { localSimulator, alice, bob };
      
  }
  
  //Call Configuration
  it("Should transfer CCIP test tokens from EOA to EOA", async function () {
    const { localSimulator, alice, bob } = await loadFixture(deployFixture);

    const config: {
      chainSelector_: BigNumber;
      sourceRouter_: string;
      destinationRouter_: string;
      wrappedNative_: string;
      linkToken_: string;
      ccipBnM_: string;
      ccipLnM_: string;
    } = await localSimulator.configuration();

    //Create Instances
    const crossChainNameServiceRegisterFactory = await hre.ethers.getContractFactory("CrossChainNameServiceRegister");
    const crossChainNameServiceReceiverFactory = await hre.ethers.getContractFactory("CrossChainNameServiceReceiver");
    const crossChainNameServiceLookupFactory = await hre.ethers.getContractFactory("CrossChainNameServiceLookup");

    //Source Set
    const ccnsSender =  crossChainNameServiceRegisterFactory.attach(config.sourceRouter_);
    const sourceAddress = ccnsSender.address;
    const ccnsSenderLookup =  crossChainNameServiceLookupFactory.attach(config.sourceRouter_);
    ccnsSenderLookup.setCrossChainNameServiceAddress(sourceAddress);

    //Receiver Set
    const ccnsReceiver =  crossChainNameServiceRegisterFactory.attach(config.destinationRouter_);
    const recieverAddress = ccnsReceiver.address;
    const ccnsReceiverLookup =  crossChainNameServiceLookupFactory.attach(config.destinationRouter_);
    ccnsReceiverLookup.setCrossChainNameServiceAddress(sourceAddress);

    //Call Register
    ccnsSender.register("alice.ccns");

    //Call Lookup & Assert
    expect(await ccnsSenderLookup.lookup("alice.ccns")).to.deep.equal(alice.address);
    
  })
  
})