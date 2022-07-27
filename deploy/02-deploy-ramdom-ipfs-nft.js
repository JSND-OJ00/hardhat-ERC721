const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata");

const FUND_AMOUNT = "1000000000000000000000";
const imagesLocation = "./images/randomNFT";

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: {
    trait_type: "",
    value: 1,
  },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let tokenUris;
  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris();
  }

  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.events[0].args.subId;
    // Fund the subscription
    // Our mock makes it so we don't actually have to worry about sending fund
    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  log("----------------------------------------------------");
  //   const args = [
  //     VRFCoordinatorV2Address,
  //     subscriptionId,
  //     networkConfig[chainId].gasLane,
  //     networkConfig[chainId].mintFee,
  //     networkConfig[chainId].callbackGasLimit,
  //   ];
  await storeImages(imagesLocation);
};

async function handleTokenUris() {
  tokenUris = [];

  const { responses: imageUploadResponses, files } = await storeImages(
    imagesLocations
  );
  for (imageUploadResponseIndex in imageUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate };

    tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".jpg", "");
    tokenUriMetadata.description = ` It is ${tokenUriMetadata.name}`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetadata.name}...`);

    const metadataUploadResponse = await storeTokenUriMetadata;
    tokenUriMetadata;
  }
  return tokenUris;
}

async function storeTokenUriMetadata(metadata) {}

module.exports.tags = ["all", "randomipfs", "main"];
