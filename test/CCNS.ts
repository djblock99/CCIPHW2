import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import hre from "hardhat";

describe("HW 2", function () {

  async function deploy() {
      const localSimulatorFactory = await hre.ethers.getContractFactory("CCIPLocalSimulator");
      const localSimulator = await localSimulatorFactory.deploy();
    
      const config: {
        chainSelector_: BigNumber;
        sourceRouter_: string;
        destinationRouter_: string;
        wrappedNative_: string;
        linkToken_: string;
        ccipBnM_: string;
        ccipLnM_: string;
      } = await localSimulator.configuration();

      const crossChainNameServiceRegisterFactory = await hre.ethers.getContractFactory("CrossChainNameServiceRegister");
      const crossChainNameServiceReceiverFactory = await hre.ethers.getContractFactory("CrossChainNameServiceReceiver");
      const crossChainNameServiceLookupFactory = await hre.ethers.getContractFactory("CrossChainNameServiceLookup");

      const [alice, bob] = await hre.ethers.getSigners();
    
      return { localSimulator, crossChainNameServiceRegisterFactory, crossChainNameServiceReceiverFactory, crossChainNameServiceLookupFactory, alice, bob };
      
    }

    
    
  
})
