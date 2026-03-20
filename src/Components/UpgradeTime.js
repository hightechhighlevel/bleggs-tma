import React, { useEffect, useState } from "react";
import { MdArrowRightAlt } from "react-icons/md";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useUser } from "../context/userContext";
import { IoCheckmarkCircleSharp, IoClose } from "react-icons/io5";
import { usePurchase } from "../context/PurchaseProvider";

// const miningTimes = [
//   {
//     title: "increase to x2",
//     capacity: 2,
//     cost: "400000",
//     price: 400000,
//     xx: "2x",
//   },
//   {
//     title: "increase to x3",
//     capacity: 3,
//     cost: "600000",
//     price: 600000,
//     xx: "3x",
//   },
//   {
//     title: "increase to x4",
//     capacity: 4,
//     cost: "800000",
//     price: 800000,
//     xx: "4x",
//   },
//   {
//     title: "increase to x5",
//     capacity: 5,
//     cost: "1000000",
//     price: 1000000,
//     xx: "5x",
//   },
//   {
//     title: "increase to x6",
//     capacity: 6,
//     cost: "2000000",
//     price: 2000000,
//     xx: "6x",
//   },
// ];

const UpgradeTime = () => {
  const {
    id,
    setPlusMiningTime,
    initialMiningTime,
    balance,
    setBalance,
    upgradeTimeLevels,
    isFarming,
    setIsFarming,
    canClaim,
    setCanClaim,
    plusMiningTime,
    plusMiningPower,
    canFarm,
    setIsUpgradeTime,
    setMinusPoints,
  } = useUser();

  // eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [openUpgrade, setOpenUpgrade] = useState(false);
  const [selectedPower, setSelectedPower] = useState(null);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [congratsMessage, setCongratsMessage] = useState("");
  const [buttonText, setButtonText] = useState("Upgrade Mining Time");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [openBoost, setOpenBoost] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const [miningTimeList, setMiningTimeList] = useState([
    { title: "increase to x2", capacity: 2, cost: "400000", xx: "2x" },
  ]);

  useEffect(() => {
    setMiningTimeList(
      upgradeTimeLevels.map((item) => ({
        ...item,
        capacity: initialMiningTime * item.capacity,
      }))
    );
  }, [initialMiningTime, upgradeTimeLevels]);

  const handleClick = async () => {
    setButtonText("Upgrading...");
    setButtonDisabled(true);

    if (!selectedPower) return;

    if (Number(selectedPower.cost) > balance) {
      setMessage("Upgrading Failed. Not enough Bleggs tokens.");
      setMessageColor("red");
      setButtonText("Upgrade Mining Time");
      setButtonDisabled(false);
    } else {
      console.log("success");
      let newMiningTime = selectedPower.capacity;
      const userRef = doc(db, "telegramUsers", id.toString());
      const userdoc = await getDoc(userRef);
      // if (userdoc.exists()) {
      //   const userval = userdoc.data();
      //   newMiningTime += userval.miningTime;
      // }
      if (!isFarming && !canFarm) {
        // if (canClaim) {
        localStorage.setItem(
          "farmingStart",
          Date.now() - 1000 * plusMiningTime
        );
        if (localStorage.getItem("farmingCompleted"))
          localStorage.removeItem("farmingCompleted");
        setCanClaim(false);
        setIsFarming(true);
        if (!canClaim) {
          setIsUpgradeTime(true);
          setMinusPoints(plusMiningPower * plusMiningTime);
        }
        // }
      }

      await updateDoc(userRef, {
        plusMiningTime: newMiningTime,
        balance: balance - Number(selectedPower.cost),
        isUpgradeTime: canClaim ? false : true,
        minusPoints: canClaim ? 0 : plusMiningPower * plusMiningTime,
      });
      setPlusMiningTime(newMiningTime);
      setBalance(balance - Number(selectedPower.cost));

      setCongratsMessage(
        <div className="w-full flex justify-center flex-col items-center space-y-3">
          <IoCheckmarkCircleSharp size={32} className="text-accent" />
          <p className="font-medium text-center">Congratulations!</p>
          <span className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 flex flex-col justify-center w-full text-center items-center space-x-1">
            <span className="flex items-center justify-center space-x-[2px] text-[18px]">
              <span className="w-[20px] h-[20px] fanbg border-[#616161] border-[1px] flex justify-center rounded-full items-center text-center relative">
                <img
                  src="/avatar.jpg"
                  alt="dscfd"
                  className="w-[16px] h-[16px]"
                />
                <span className="absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[12px] w-[14px] flex justify-center items-center">
                  <img src="/eggs.webp" alt="sdfd" className="w-[7px]" />
                </span>
              </span>
              <span className="text-accent">
                +{selectedPower.capacity} Time(s)
              </span>
            </span>
            <span>Mining Time Upgraded to {newMiningTime} s per day</span>
          </span>
          <p className="pb-6 text-[15px] w-full text-center">
            Your new mining time is now activated and will start working for
            you! Good luck miner! 😎
          </p>
        </div>
      );

      setShowCongratsModal(true);
      setOpenUpgrade(false);
      setCongrats(true);
      setTimeout(() => {
        setCongrats(false);
      }, 3000);

      setMessage("Upgrade success!");
      setMessageColor("green");
      setButtonText("Upgrade Mining Time");
      setButtonDisabled(false);
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
      <div className="w-full flex items-center justify-center px-3 pt-1">
        <button
          onClick={() => setOpenBoost(true)}
          className="w-full bg-btn4 text-[#000] py-3 px-4 text-center font-semibold rounded-[8px] flex items-center justify-center space-x-1"
        >
          <span> Upgrade Mining Time</span>
          <MdArrowRightAlt size={16} className="mt-[2px]" />
        </button>
      </div>

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
                  <div className="w-[60px] h-[60px] fanbg border-[#616161] border-[2px] flex justify-center rounded-full items-center text-center relative">
                    <img
                      src="/fan.webp"
                      alt="dscfd"
                      className="w-[45px] h-[45px]"
                    />
                    <div className="absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[24px] w-[24px] flex justify-center items-center">
                      <img src="/eggs.webp" alt="sdfd" className="w-[10px]" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-center text-[20px] pt-2 pb-4">
                    Increase mining time
                  </h3>
                  <div className="w-full flex flex-col space-y-2">
                    {miningTimeList
                      .filter((item) => item.capacity > plusMiningTime)
                      .map((time, index) => (
                        <button
                          key={index}
                          onClick={() => openUpgrader(time)}
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
                              {time.title}
                            </span>
                          </span>

                          <span className="text-[13px] font-semibold text-accent">
                            +{time.capacity} s
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
                  <div className="w-[90px] h-[90px] fanbg border-[#616161] border-[4px] flex justify-center rounded-full items-center text-center relative">
                    <img
                      src="/fan.webp"
                      alt="dscfd"
                      className="w-[70px] h-[70px] animate-spin"
                      style={{ animationDuration: "5s" }}
                    />
                    <div className="absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[34px] w-[34px] flex justify-center items-center">
                      <img src="/eggs.webp" alt="sdfd" className="w-[14px]" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-center text-[20px] pt-2">
                    {selectedPower.title}
                  </h3>
                  <p className="pb-6 text-primary text-[14px] px-4 text-center">
                    Boost your mining time to +{selectedPower.capacity} s !
                  </p>

                  <div className="w-full flex justify-center items-center space-x-2 pb-3">
                    <div className="w-[45%] bg-cards text-[12px] rounded-[6px] p-2 text-primary flex items-center justify-center space-x-1 font-semibold text-center">
                      <span> Price:</span>{" "}
                      <span className="pl-1">
                        <img
                          src="avatar.jpg"
                          alt="dfd"
                          className="w-[12px] h-[12px]"
                        />
                      </span>{" "}
                      <span>{selectedPower.cost}</span> <span> BLEGGS</span>
                    </div>
                    <div className="w-[45%] bg-cards text-[12px] rounded-[6px] p-2 text-primary flex items-center justify-center space-x-1 font-semibold text-center">
                      <span> Time:</span>{" "}
                      <span className="pl-1">
                        <img
                          src="eggs.webp"
                          alt="dfd"
                          className="w-[10px] h-[10px] mt-[2px]"
                        />
                      </span>{" "}
                      <span className="text-green-500 ">
                        +{selectedPower.capacity} s
                      </span>
                    </div>
                  </div>
                </div>

                {
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
                }
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
            <button
              onClick={() => setShowCongratsModal(false)}
              className={`bg-btn4 w-full py-[16px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
              Continue Mining
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradeTime;
