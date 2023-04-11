const { expect } = require("chai");
const { ethers } = require("hardhat");

let proxy, logic;
async function deployContracts() {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    let Proxy = await ethers.getContractFactory("Proxy");
    proxy = await Proxy.deploy();
    let Logic = await ethers.getContractFactory("Logic");
    logic = await Logic.deploy();
}

describe("Proxy", async function () {
    before(async () => {
        await deployContracts();
    });

    it("Set logic", async () => {
        proxy.setImplementation(logic.address);
    });

    it("Proxy call", async () => {
        const Implementation = await ethers.getContractFactory("Logic");
        const proxyContract = await Implementation.attach(
            proxy.address // The deployed contract address
        );

        await proxyContract.setNumber(20);

        expect(await proxyContract.getNumber()).to.eq(20);
    });
});
