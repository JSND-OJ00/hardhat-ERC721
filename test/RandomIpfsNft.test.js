const { assert } = require("chai");
const { network, deployments, ethres, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Random Ipfs Nft Tests", function() {
      let randomIpfsNft, deployer, vrfCoordinatorV2Mock;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "randomipfs"]);
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        randomIpfsNft = await ethers.getContract("RamdomIpfsNft");
      });

      it("Allows users to mint an NFT and updates appropriately", async function() {
        const txResponse = await randomIpfsNft;
      });
    });
