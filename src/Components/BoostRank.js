import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useUser } from "../context/userContext";
import { IoCheckmarkCircleSharp, IoClose } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { usePurchase } from "../context/PurchaseProvider";

// const rankBoosting = [
// {
//   title: `10,000 $${process.env.REACT_APP_PROJECT_SYMBOL}`,
//   capacity: 10000,
//   cost: "1",
//   price: 1,
//   xx: "10,000",
// },
//   {
//     title: `30,000 $${process.env.REACT_APP_PROJECT_SYMBOL}`,
//     capacity: 30000,
//     cost: "3",
//     price: 3,
//     xx: "30,0000",
//   },
//   {
//     title: `50,000 $${process.env.REACT_APP_PROJECT_SYMBOL}`,
//     capacity: 50000,
//     cost: "5",
//     price: 5,
//     xx: "10x",
//   },
//   {
//     title: `100,000 $${process.env.REACT_APP_PROJECT_SYMBOL}`,
//     capacity: 100000,
//     cost: "7",
//     price: 7,
//     xx: "100,000",
//   },
// ];

const BoostRank = () => {
  const {
    id,
    balance,
    setBalance,
    tonTransactions,
    setTonTransactions,
    rankPowerLevels,
  } = useUser();

  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [selectedPower, setSelectedPower] = useState(null);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState("");
  const [buttonText, setButtonText] = useState("Make Purchase");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [openBoost, setOpenBoost] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const {
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
    checkandSwitchChain,
  } = usePurchase();

  const handleClick = async () => {
    setButtonText("Processing...");
    setButtonDisabled(true);

    if (!selectedPower) return;

    try {
      await checkandSwitchChain();
      const usdToEthRate = await fetchUsdToEthRate();
      let ethAmount = calculateEthFromUsd(
        parseFloat(selectedPower.cost),
        usdToEthRate
      );
      const transaction = {
        to: OWNER_ADDRESS,
        from: address,
        value: parseEther(ethAmount.toString()),
      };
      console.log("transaction: ", transaction, usdToEthRate);
      sendTransaction(transaction, {
        onSuccess: async (hash) => {
          console.log("success", hash);
          const newMiningPower = balance + selectedPower.capacity;
          const userRef = doc(db, "telegramUsers", id.toString());
          await updateDoc(userRef, {
            balance: newMiningPower,
            tonTransactions: tonTransactions + 1,
          });
          setBalance(newMiningPower);
          setTonTransactions(tonTransactions + 1);

          setCongratsMessage(
            <div className="w-full flex justify-center flex-col items-center space-y-3">
              <IoCheckmarkCircleSharp size={32} className="text-accent" />
              <p className="font-medium text-center">Congratulations!</p>
              <span className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 flex flex-col justify-center w-full text-center items-center space-x-1">
                <span className="flex items-center justify-center space-x-[2px] text-[18px]">
                  <img src="/eggs.webp" alt="sdfd" className="w-[15px]" />

                  <span className="text-accent">
                    +{selectedPower.capacity} $
                    {process.env.REACT_APP_PROJECT_SYMBOL}
                  </span>
                </span>
                <span>
                  Your Purchase of {selectedPower.xx} $
                  {process.env.REACT_APP_PROJECT_SYMBOL} is successful
                </span>
              </span>
              <p className="pb-6 text-[15px] w-full text-center">
                Perform more activities or buy more $
                {process.env.REACT_APP_PROJECT_SYMBOL} to stay ahead and claim
                listing giveaway bonues!😎
              </p>
            </div>
          );

          setShowCongratsModal(true);
          setOpenUpgrade(false);
          setCongrats(true);
          setTimeout(() => {
            setCongrats(false);
          }, 3000);

          setMessage("Purchase success!");
          setMessageColor("green");
          setButtonText("Make Purchase");
          setButtonDisabled(false);
        },
        onError: (error) => {
          console.error(error);
          setMessage("Transaction failed or canceled, please try again later.");
          setMessageColor("red");
          setButtonText("Make Purchase");
          setButtonDisabled(false);
        },
        onSettle: () => {
          setButtonText("Make Purchase");
          setButtonDisabled(false);
        },
      });
    } catch (err) {
      console.error("Transaction error:", err);
      setMessage("Transaction failed or canceled, please try again later.");
      setMessageColor("red");
    }
  };

  const openUpgrader = (power) => {
    setSelectedPower(power);
    setOpenUpgrade(true);
    setOpenBoost(false);
  };

  const closeUpgrader = () => {
    setOpenBoost(true);
    setOpenUpgrade(false);
    setMessage("");
  };

  return (
    <>
      <button
        onClick={() => setOpenBoost(true)}
        className="bg-btn4 h-[45px] flex justify-center items-center space-x-2 font-medium w-full rounded-[8px]"
      >
        <img src="/prem.svg" alt="fdfvds" className="w-[14px]" />
        <span>Boost your Rank</span>
      </button>

      {openBoost && (
        <>
          <div className="fixed flex inset-[0px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center">
            <div className="w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center">
              <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-14 pb-10">
                <button
                  onClick={() => setOpenBoost(false)}
                  className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
                >
                  <IoClose size={20} className="text-[#9995a4]" />
                </button>

                <div className="w-full flex justify-center flex-col items-center">
                  <img src="/eggs.webp" alt="sdfd" className="w-[70px]" />

                  <h3 className="font-semibold text-center text-[20px] pt-2 pb-4">
                    Get more {process.env.REACT_APP_PROJECT_NAME_SMALL}
                  </h3>
                  <div className="w-full flex flex-col space-y-2">
                    {rankPowerLevels.map((power, index) => (
                      <button
                        key={index}
                        onClick={() => openUpgrader(power)}
                        className="w-full bg-cards py-4 px-4 rounded-[8px] flex justify-between items-center"
                      >
                        <span className="flex flex-1 space-x-[6px] items-center">
                          <span className="w-[24px] h-[24px] fanbg border-[#616161] border-[1px] flex justify-center rounded-full items-center text-center relative">
                            <img
                              src="/fan.webp"
                              alt="dscfd"
                              className="w-[18px] h-[18px]"
                            />
                            <span className="absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[14px] w-[14px] flex justify-center items-center">
                              <img
                                src="/eggs.webp"
                                alt="sdfd"
                                className="w-[7px]"
                              />
                            </span>
                          </span>
                          <span className="text-[14px] font-medium">
                            {power.title}
                          </span>
                        </span>

                        <span className="text-[13px] font-semibold text-[#2c99dd]">
                          {power.cost}{" "}
                          <span className="text-[#2c99dd]"> USD</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {openUpgrade && selectedPower && (
        <>
          <div className="fixed flex inset-[0px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center">
            <div className="w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center">
              <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-10">
                <button
                  onClick={closeUpgrader}
                  className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
                >
                  <IoClose size={20} className="text-[#9995a4]" />
                </button>

                <div className="w-full flex justify-center flex-col items-center">
                  <img src="/eggs.webp" alt="sdfd" className="w-[70px]" />

                  <h3 className="font-semibold text-center text-[20px] pt-2">
                    {selectedPower.title}
                  </h3>
                  <p className="pb-6 text-primary text-[14px] px-4 text-center">
                    Get {selectedPower.capacity} $
                    {process.env.REACT_APP_PROJECT_SYMBOL} and boost your
                    earnings and ranks!
                  </p>

                  <div className="w-full flex justify-center items-center space-x-2 pb-3">
                    <div className="w-[45%] bg-cards text-[12px] rounded-[6px] p-2 text-primary flex items-center justify-center space-x-1 font-semibold text-center">
                      <span> Price:</span>{" "}
                      <span className="pl-1">
                        <img
                          src="binance.webp"
                          alt="dfd"
                          className="w-[12px] h-[12px]"
                        />
                      </span>{" "}
                      <span>{selectedPower.cost}</span> <span> USD</span>
                    </div>
                  </div>
                </div>

                {address ? (
                  <>
                    <div className="w-full flex justify-center items-center flex-col space-y-2 pb-7">
                      <button
                        onClick={handleClick}
                        className={`${
                          buttonDisabled ? "bg-[#5A4420]" : "bg-btn"
                        } text-[#000] w-full py-[18px] px-6 text-nowrap flex items-center justify-center text-center rounded-[12px] font-semibold text-[17px]`}
                        disabled={buttonDisabled}
                      >
                        {buttonText}
                      </button>
                    </div>

                    {message && (
                      <p
                        className="w-full text-center text-[13px]"
                        style={{ color: messageColor, marginTop: "10px" }}
                      >
                        {message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="w-full flex flex-col items-center justify-center space-y-4">
                    <w3m-button />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none">
        {congrats ? (
          <img src="/congrats.gif" alt="congrats" className="w-[80%]" />
        ) : (
          <></>
        )}
      </div>

      <div
        className={`${
          showCongratsModal === true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div
          className={`${
            showCongratsModal === true
              ? "opacity-100 mt-0 ease-in duration-300"
              : "opacity-0 mt-[100px]"
          } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}
        >
          {congratsMessage}

          <div className="w-full flex justify-center">
            <NavLink
              to="/"
              onClick={() => setShowCongratsModal(false)}
              className={`bg-btn4 w-full py-[16px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
              Continue
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoostRank;
