import { useEffect, useState } from "react";
import "./style.css";
import { ethers } from "ethers";
import { checkEndAddNetWork } from "../../hooks/common";

export const Header = () => {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState<number | string>(0);

  const shortenHex = (hex: string) => {
    return `${hex.slice(0, 4)}...${hex.slice(-4)}`;
  };
  useEffect(() => {
    const fetch = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          console.log("network", network);
          if (Number(network?.chainId) === 1001) {
            const data = await window.ethereum.send("eth_requestAccounts");
            const balance = await provider.getBalance(data?.result?.[0]);
            const balanceFormat = ethers.formatEther(balance);
            const balanceFixed = parseFloat(balanceFormat).toFixed(3);
            setBalance(balanceFixed);
            setAddress(data?.result?.[0]);
          } else {
            await checkEndAddNetWork();
            const data = await window.ethereum.send("eth_requestAccounts");
            const balance = await provider.getBalance(data?.result?.[0]);
            const balanceFormat = ethers.formatEther(balance);
            const balanceFixed = parseFloat(balanceFormat).toFixed(3);
            setBalance(balanceFixed);
            setAddress(data?.result?.[0]);
          }
        } catch (error) {
          console.log("error");
        }
      }
    };
    fetch();
  }, [address]);
  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts?.result?.[0]);
        return accounts;
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="menu-header">
      <div className="menu-header-logo">
        <img src="/images/logo.svg" alt="logo" />
      </div>
      <div className="menu-header-link">
        <li>
          <a href="/mint">Mint</a>
        </li>
        <li>
          <a href="/profile">Profile</a>
        </li>
      </div>
      <div className="menu-header-info">
        {address && (
          <div className="balance">
            {balance} KLAY |{address ? shortenHex(address) : "connect metamask"}
          </div>
        )}

        {!address && <button onClick={connectMetaMask}>Connect</button>}
      </div>
    </div>
  );
};
