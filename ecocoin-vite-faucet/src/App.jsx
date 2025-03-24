import { useState } from 'react';
import { ethers } from 'ethers';

const contractAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508";
const abi = [
  "function mint(address to, uint256 amount) public"
];

function App() {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected.");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
    setStatus("✅ Wallet connected");
  };

  const mintTokens = async () => {
    if (!wallet) {
      alert("Connect your wallet first.");
      return;
    }

    try {
      setStatus("⏳ Sending transaction...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const eco = new ethers.Contract(contractAddress, abi, signer);
      const amount = ethers.parseUnits("50", 18);

      const tx = await eco.mint(wallet, amount);
      await tx.wait();

      setStatus(`✅ Sent 50 ECO to ${wallet}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-500 text-white text-3xl">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">🌱 EcoCoin Faucet</h1>
        <p className="text-gray-600 mb-6">Claim 50 test ECO tokens to your MetaMask wallet.</p>

        {!wallet ? (
          <button
            onClick={connectWallet}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl w-full mb-4"
          >
            🔗 Connect Wallet
          </button>
        ) : (
          <div className="text-sm text-gray-800 mb-4">Connected: {wallet}</div>
        )}

        <button
          onClick={mintTokens}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl w-full"
        >
          💧 Claim 50 ECO
        </button>

        {status && <p className="text-sm text-gray-600 mt-4">{status}</p>}
      </div>
    </div>
  );
}

export default App;
