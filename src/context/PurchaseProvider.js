import React, { createContext, useContext, useState, useEffect } from "react";
import { calculateEthFromUsd, fetchUsdToEthRate } from "../utils/functions";
import {
  useAccount,
  useSendTransaction,
  useDisconnect,
  useConnect,
  useSwitchChain,
} from "wagmi";
import { parseEther } from "viem";

const PurchaseContext = createContext();

export const usePurchase = () => useContext(PurchaseContext);

export const PurchaseProvider = ({ children }) => {
  const { chainId, address, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  let OWNER_ADDRESS =
    process.env.REACT_APP_OWNER_ADDRESS ||
    "0x776DF019D1884B844d85652f17e33FD7b698953d";
  const { sendTransaction, isSuccess, isError, isIdle, isPending } =
    useSendTransaction();
  const { disconnect } = useDisconnect();
  const checkandSwitchChain = async () => {
    if (chainId != 56) {
      console.log(chainId);

      switchChain({ chainId: 56 });
    }
  };
  return (
    <PurchaseContext.Provider
      value={{
        OWNER_ADDRESS,
        address,
        isConnected,
        sendTransaction,
        isSuccess,
        isError,
        isIdle,
        isPending,
        calculateEthFromUsd,
        fetchUsdToEthRate,
        parseEther,
        disconnect,
        checkandSwitchChain,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
