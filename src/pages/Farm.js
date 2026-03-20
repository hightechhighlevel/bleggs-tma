import React, { useState, useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useUser } from "../context/userContext";
import { IoCheckmarkCircleSharp, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineTimer, MdTimeToLeave } from "react-icons/md";
import Animate from "../Components/Animate";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { IoVolumeMute } from "react-icons/io5";
import BoostFarm from "../Components/BoostFarm";
import BoostTimeFarm from "../Components/BoostTimeFarm";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PiInfo } from "react-icons/pi";
import { formatNumber } from "../utils/functions";
import { cronoszkEVM } from "viem/chains";
import { RiExchangeDollarFill } from "react-icons/ri";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Exchanges from "../Components/Exchanges";
import UpgradePower from "../Components/UpgradePower";
import UpgradeTime from "../Components/UpgradeTime";
import { slicFunc } from "../utils/functions";
import Loader from "../Components/Loader";

const CryptoFarming = () => {
  const {
    id,
    balance,
    setBalance,
    plusMiningPower,
    miningTotal,
    setMiningTotal,
    lastFarmDate,
    setLastFarmDate,
    isFarming,
    setIsFarming,
    canClaim,
    setCanClaim,
    plusMiningTime,
    miningCountPerDay,
    initialMiningPower,
    initialMiningTime,
    selectedExchange,
    photoUrl,
    username,
    fullName,
    totalUsers,
    boostedPower,
    setBoostedPower,
    boostedTime,
    setBoostedTime,
    canFarm,
    setCanFarm,
    minusPoints,
    setMinusPoints,
    isUpgradeTime,
  } = useUser(); // Get the user ID from context
  const [totalMiningTime, setTotalMiningTime] = useState(plusMiningTime);
  const [totalMiningPower, setTotalMiningPower] = useState(plusMiningPower);
  const [timeToNextMining, setTimeToNextMining] = useState(
    Math.floor((24 * 60 * 60) / miningCountPerDay)
  );
  let [timeRemaining, setTimeRemaining] = useState(-5);
  let TRIGGER_TIME = totalMiningTime - 1;
  let TRIGGER_TIMETWO = totalMiningTime - 3;
  let TRIGGER_TIMETHREE = totalMiningTime - 5;
  let TRIGGER_TIMEFOUR = totalMiningTime - 7;

  const [pointsEarned, setPointsEarned] = useState(0);
  const [farmingCompleted, setFarmingCompleted] = useState(false);
  const [spinDuration, setSpinDuration] = useState(0);
  // eslint-disable-next-line
  const [elapsedTimer, setElapsedTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false); // To handle mute/unmute
  // eslint-disable-next-line
  const [animatePoints, setAnimatePoints] = useState(false); // To handle points animation
  const [showSettings, setShowSettings] = useState(false);
  const [claimModal, setClaimModal] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const modalRef = useRef(null);
  // const [canFarm, setCanFarm] = useState(false);
  const [remainToFarm, setRemainToFarm] = useState(0);

  const fanAudioRef = useRef(null); // Reference to the audio element
  const [openInfoTwo, setOpenInfoTwo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const infoRefTwo = useRef(null);
  const [showExchange, setShowExchange] = useState(false);

  const openExchange = () => {
    setShowExchange(true);
  };

  const handleClickOutside = (event) => {
    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
  };
  const setTimeToFarm = () => {
    if (!lastFarmDate) {
      // console.log("setCanFarm: ", true);
      const farmingStart = localStorage.getItem("farmingStart");
      if (!farmingStart) setCanFarm(true);
    } else {
      // console.log("TIME TO MINE: ", timeToNextMining);
      let lastFarmDate1 = new Date(lastFarmDate);
      // console.log("lastFarmDate1: ", lastFarmDate1);
      if (Date.now() - lastFarmDate1.getTime() < timeToNextMining * 1000) {
        setCanFarm(false);
        console.log("Time TO Farm Funcion Running..................");
        setRemainToFarm(
          Math.floor(
            (timeToNextMining * 1000 - (Date.now() - lastFarmDate1.getTime())) /
              1000
          )
        );
        // console.log("remainToFarm: ", remainToFarm);
      } else {
        setCanFarm(true);
      }
    }
    // return () => clearInterval(interval);
  };

  useEffect(() => {
    setTotalMiningTime(plusMiningTime);
  }, [plusMiningTime]);
  useEffect(() => {
    setTotalMiningPower(plusMiningPower);
  }, [plusMiningPower]);
  useEffect(() => {
    setTimeToNextMining(Math.floor((24 * 60 * 60) / miningCountPerDay));
  }, [miningCountPerDay]);

  useEffect(() => {
    let interval;
    if (remainToFarm > 0) {
      interval = setTimeout(() => {
        setRemainToFarm(remainToFarm - 1);
      }, 1000);
    } else {
      setCanFarm(true);
    }
    return () => clearTimeout(interval);
  }, [remainToFarm]);

  useEffect(() => {
    if (boostedPower > 0) setTotalMiningPower(boostedPower);
    else setTotalMiningPower(plusMiningPower);
    if (boostedTime > 0) setTotalMiningTime(boostedTime);
    else setTotalMiningTime(plusMiningTime);
  }, [boostedPower, boostedTime]);

  useEffect(() => {
    if (openInfoTwo) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [openInfoTwo]);

  const closeClaimer = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setClaimModal(false);
      setPointsEarned(0);
    }
  };

  useEffect(() => {
    if (!id) {
      if (claimModal) {
        document.addEventListener("mousedown", closeClaimer);
      } else {
        document.removeEventListener("mousedown", closeClaimer);
      }

      return () => {
        document.removeEventListener("mousedown", closeClaimer);
      };
    }
    // eslint-disable-next-line
  }, [claimModal, id]);

  useEffect(() => {
    const handleBackButtonClick = () => {
      setShowSettings(false);
    };

    if (showSettings) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }

    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [showSettings, setShowSettings]);

  const continueMining = async () => {
    const farmingStart = localStorage.getItem("farmingStart");
    // const farmingDone = localStorage.getItem("farmingCompleted");
    console.log("totalMiningTime: ", totalMiningTime);
    if (totalMiningTime > 0) setIsLoading(false);
    if (farmingStart || isFarming) {
      const elapsedTime = Math.floor(
        (Date.now() - parseInt(farmingStart)) / 1000
      );
      console.log(
        "Elapsed Time =================>",
        elapsedTime,
        totalMiningTime
      );
      if (elapsedTime < totalMiningTime) {
        console.log("isFarming...............");
        // setIsFarming(true);
        setTimeRemaining(totalMiningTime - elapsedTime);
        setIsFarming(true);
        setCanClaim(false);
        setCanFarm(false);
        setPointsEarned(elapsedTime * totalMiningPower - minusPoints);
        try {
          const userRef = doc(db, "telegramUsers", id.toString());
          await updateDoc(userRef, { isFarming: true, canClaim: false });
        } catch (error) {
          console.log("Error updating: ", error);
        }
      } else {
        if (totalMiningTime > 0) {
          completeFarming();
        }
      }
    } else if (canClaim) {
      setPointsEarned(totalMiningPower * totalMiningTime - minusPoints);
      localStorage.setItem("spinDuration", 1000);
      setSpinDuration(1000);
    }
      setTimeToFarm();
    
  };

  useEffect(() => {
    continueMining();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    continueMining();
    // eslint-disable-next-line
  }, [totalMiningPower, totalMiningTime, timeToNextMining, isFarming]);
  useEffect(() => {
    let interval;
    console.log("isFarming:", isFarming, " timeRemaing: ", timeRemaining);
    if (timeRemaining > 0) {
      interval = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
        localStorage.setItem("timeRemaining", timeRemaining);
        // Animate pointsEarned on update
        setPointsEarned((prevPoints) => {
          const newPoints =
            (totalMiningTime - timeRemaining) * totalMiningPower - minusPoints;
          if (newPoints !== prevPoints) {
            setAnimatePoints(true);
            setTimeout(() => setAnimatePoints(false), 500); // Remove animation after 500ms
          }
          return newPoints;
        });

        // Update elapsed time
        setElapsedTimer((prevElapsedTimer) => {
          const newElapsedTimer = prevElapsedTimer + 1;
          localStorage.setItem("elapsedTime", newElapsedTimer);
          return newElapsedTimer;
        });

        if (timeRemaining <= TRIGGER_TIME) {
          setSpinDuration(5);
        }
        if (timeRemaining <= TRIGGER_TIMETWO) {
          setSpinDuration(2);
        }
        if (timeRemaining <= TRIGGER_TIMETHREE) {
          setSpinDuration(1);
        }
        if (timeRemaining <= TRIGGER_TIMEFOUR) {
          setSpinDuration(0.5);
        }
      }, 1000);
      console.log("Farming ...............");
    } else {
      if (isFarming) {
        clearTimeout(interval);
        console.log("completing Farming ...............");
        completeFarming();
      }
    }
    return () => clearTimeout(interval);

    // eslint-disable-next-line
  }, [timeRemaining]);

  useEffect(() => {
    if (isFarming) {
      fanAudioRef.current.play(); // Play the sound when farming starts
    } else {
      fanAudioRef.current.pause(); // Pause the sound when farming stops
    }
    if (farmingCompleted) {
      setSpinDuration(50);
    }
    // eslint-disable-next-line
  }, [isFarming]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    fanAudioRef.current.muted = !isMuted;
    setShowSettings(false);
  };

  const startFarming = async () => {
    localStorage.setItem("farmingStart", Date.now());
    localStorage.setItem("farmingCompleted", "false");
    setCanClaim(false);
    setCanFarm(false);
    setSpinDuration(20);
    setFarmingCompleted(false);
    setPointsEarned(0);
    setTimeRemaining(totalMiningTime);
    setIsFarming(true);
    setLastFarmDate(new Date());
    setRemainToFarm(Math.floor(timeToNextMining));
    const userRef = doc(db, "telegramUsers", id.toString());
    await updateDoc(userRef, {
      lastFarmDate: new Date(),
    });
    
    try {
      const userRef = doc(db, "telegramUsers", id.toString());
      await updateDoc(userRef, { isFarming: true, canClaim: false });
    } catch (error) {
      console.log("Error updating: ", error);
    }
  };

  const claimPoints = async () => {
    try {
      const userRef = doc(db, "telegramUsers", id.toString());
      const newBalance = balance + pointsEarned;
      const newMiningTotal = miningTotal + pointsEarned;
      await updateDoc(userRef, {
        balance: newBalance,
        miningTotal: newMiningTotal,
        lastFarmDate: new Date(),
        isFarming: false,
        canClaim: false,
        boostedPower: 0,
        boostedTime: 0,
      });
      setBoostedPower(0);
      setBoostedTime(0);
      setClaimModal(true);
      setBalance(newBalance);
      console.log("call complete:789");

      setIsFarming(false);
      // setTimeRemaining(totalMiningTime);
      setCanClaim(false);
      await updateDoc(userRef, { isFarming: false, canClaim: false });
      setMiningTotal(newMiningTotal);
      setFarmingCompleted(false);
      setCongrats(true);
      setTimeout(() => {
        setCongrats(false);
      }, 3000);
      localStorage.removeItem("farmingStart");
      localStorage.removeItem("farmingCompleted");
      localStorage.setItem("spinDuration", 0);
      setSpinDuration(1000);
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  // eslint-disable-next-line
  const resetFarming = () => {
    console.log("call complete:456");

    setIsFarming(false);
    setPointsEarned(0);
    setTimeRemaining(totalMiningTime);
    setCanClaim(false);
    setFarmingCompleted(false);
    localStorage.removeItem("farmingStart");
    localStorage.removeItem("farmingCompleted");
    localStorage.setItem("spinDuration", 0);
    setSpinDuration(0);
  };

  const completeFarming = async () => {
    console.log("call complete:123");
    setIsFarming(false);
    setPointsEarned(totalMiningPower * totalMiningTime - minusPoints);
    setCanClaim(true);
    setFarmingCompleted(true);
    // localStorage.removeItem("farmingStart");
    localStorage.setItem("farmingCompleted", "true");

    try {
      const userRef = doc(db, "telegramUsers", id.toString());
      await updateDoc(userRef, {
        isFarming: false,
        canClaim: true,
      });
    } catch (error) {
      console.log("Error updating: ", error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatNumberTwo = (num) => {
    if (typeof num !== "number") {
      return "Invalid number";
    }
    if (num < 1 && num.toString().split(".")[1]?.length > 3) {
      return num.toFixed(3).replace(/0+$/, "");
    }
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const closeClaimerr = async (event) => {
    // setLastFarmDate(new Date());
    // setCanFarm(false);
    setClaimModal(false);
    setPointsEarned(0);
    setCanClaim(false);
    setMinusPoints(0);
    console.log("canFarm || isLoading || isFarming || canClaim", canFarm, isLoading, isFarming, canClaim);
    try {
      const userRef = doc(db, "telegramUsers", id.toString());
      await updateDoc(userRef, {
        isFarming: false,
        canClaim: false,
        isUpgradeTime: false,
        minusPoints: 0,
      });
    } catch (error) {
      console.log("Error updating: ", error);
    }
  };

  return (
    <Animate>
      <div className="w-full flex flex-col items-center justify-center px-4">
        <audio
          ref={fanAudioRef}
          src="/farming.mp3"
          loop
          muted={isMuted}
        ></audio>

        <div
          id="refer"
          className="w-full h-screen pt-5 scroller overflow-y-auto pb-[150px] space-y-3"
        >
          <div className="w-full flex justify-between items-center pb-3">
            {/* <button className="absolute"></button> */}
            <div className="customCard-container flex flex-row text-[14px] font-bold items-center gap-1 rounded-full border border-[#D18729] p-1 left-5">
              <img
                src={photoUrl || "user.svg"}
                className={`rounded-full overflow-hidden w-6 h-6`}
              />
              <h4>{slicFunc(username + fullName)}</h4>
            </div>

            <button onClick={() => setShowSettings(true)} className="right-5">
              <IoSettingsOutline size={24} className="" />
            </button>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-fit bg-cards px-4 py-2 text-[15px] font-semibold rounded-full flex items-center justify-center space-x-1 self-center">
              <img src="/stars.svg" alt="sfdf" className="w-[14px]" />
              <span className="text-secondary">Balance</span>{" "}
              <span> {formatNumber(balance)} </span>
            </div>
          </div>

          {/* {!canFarm && !canClaim && !isFarming && ( */}
          {remainToFarm > 0 && (
            <span className="font-medium text-[13px] text-secondary flex items-center justify-center space-x-[1px]">
              <MdOutlineTimer size={14} className="" />
              <span>{formatTime(remainToFarm)}</span>
            </span>
          )}

          <div className="w-full flex justify-center items-center text-center">
            <div className="w-[150px] h-[150px] fanbg border-[#616161] border-[4px] flex justify-center rounded-full items-center text-center relative">
            {isFarming ? (
                  <img
                    src="/fan.webp"
                    alt="dscfd"
                    className="w-[130px] h-[130px] animate-spin"
                    style={{ animationDuration: "2s" }}
                  />
                ) : (
                  <img
                    src="/fan.webp"
                    alt="dscfd"
                    className="w-[130px] h-[130px]"
                  />
                )}
              <div className="absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[34px] w-[34px] flex justify-center items-center">
                <img src="/eggs.webp" alt="sdfd" className="w-[14px]" />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between w-full text-[20px] text-white lilita px-4">
            <div className="flex flex-row gap-1 items-center">
              <img
                src="boost.png"
                alt="boost"
                className="h-[20px] aspect-square"
              />
              {isLoading ? (
                <Loader width="20" />
              ) : (
                <h3 className="text-[14px]">
                  {totalMiningPower} <span className="text-[12px]">MH</span>{" "}
                  /&nbsp;
                  <span>
                    {totalMiningTime} <span className="text-[12px]">s</span>
                  </span>
                </h3>
              )}
            </div>
            <h4 className="text-white text-[14px]">
              Active Users{"  "}
              <span className="text-[16px] font-bold">{totalUsers}</span>
            </h4>
          </div>

          <div className="w-full px-3 pt-5">
            <div className="w-full bg-cards rounded-[12px] px-4 pt-4 pb-2 flex flex-col items-center justify-center mb-3 relative">
              <h2 className="font-medium text-secondary text-[14px]">
                Mined Tokens
              </h2>
              <span className="text-[26px] font-semibold">
                {!canClaim && !isFarming
                  ? "0.00"
                  : formatNumberTwo(pointsEarned)}
              </span>
              {isFarming && timeRemaining > -1 && (
                <span className="font-medium text-[13px] text-secondary flex items-center justify-center space-x-[1px]">
                  <MdOutlineTimer size={14} className="" />
                  <span>{formatTime(timeRemaining)}</span>
                </span>
              )}

              <span
                onClick={() => setOpenInfoTwo(true)}
                className="pt-5 pb-1 font-medium text-[10px] text-[#93792b] flex items-center justify-center space-x-[2px]"
              >
                <img src="/starsorange.svg" alt="dsdsf" className="w-[8px]" />
                <span>{totalMiningPower} tokens profit per second</span>
                <IoIosInformationCircleOutline size={11} className="" />
              </span>

              <PiInfo
                onClick={() => setOpenInfoTwo(true)}
                size={18}
                className="absolute top-4 right-4 text-[#888]"
              />
            </div>

            <div className="w-full flex items-center justify-between space-x-2">
              <button
                onClick={startFarming}
                disabled={!canFarm || isLoading || isFarming || canClaim}
                className={`w-[48%] px-4 py-3 flex items-center justify-center text-center rounded-[8px] font-semibold text-[14px] ${
                  !canFarm || isLoading || isFarming || canClaim
                    ? "bg-btn2 text-[#888]"
                    : "bg-btn"
                }`}
              >
                {isFarming ? "Mining.." : "Start Mining"}
              </button>

              <button
                onClick={claimPoints}
                disabled={!canClaim || isLoading}
                className={`w-[48%] px-4 py-3 flex items-center justify-center text-center rounded-[8px] font-semibold text-[14px] ${
                  canClaim && !isLoading
                    ? "bg-btn hover:bg-[#f3bf25a4]"
                    : "bg-btn2 text-[#888]"
                }`}
              >
                {canClaim ? "Claim" : "Claim"}
              </button>
            </div>
          </div>

          {/* <BoostFarm /> */}
          {/* <BoostTimeFarm /> */}
          <UpgradePower />
          <UpgradeTime />
        </div>
      </div>

      {showSettings && (
        <div className="fixed left-0 right-0 z-20 top-[-12px] bottom-0 flex justify-center taskbg px-[16px] h-full">
          <div id="refer" className="w-full flex flex-col">
            <div className="w-full flex pt-6 flex-col space-y-6 overflow-y-auto pb-[100px] scroller">
              <div className="flex items-center space-x-4">
                <div className="w-full">
                  <h1 className="font-semibold text-[24px] text-center pb-4">
                    Settings
                  </h1>

                  <div className="w-full flex flex-col pb-[100px]">
                    <div className="flex w-full flex-col space-y-2">
                      <button
                        onClick={toggleMute}
                        className={`w-full bg-[#23221f] text-[14px] rounded-[10px] px-4 py-[19px] space-x-2 flex justify-between items-center`}
                      >
                        <div className="flex items-center space-x-2 justify-start w-[80%]">
                          <span className="">
                            <IoSettingsOutline size={34} className={``} />
                          </span>
                          <div className="flex flex-col text-left">
                            <h2 className="flex flex-1 font-medium text-[13px]">
                              {isMuted ? "Unmute fan sound" : "Mute fan sound"}
                            </h2>
                            <div className="text-[12px] font-normal"></div>
                          </div>
                        </div>
                        {isMuted ? (
                          <IoVolumeMute
                            size={24}
                            className={`text-[#959595]`}
                          />
                        ) : (
                          <IoVolumeMediumSharp
                            size={24}
                            className={`text-[#959595]`}
                          />
                        )}
                      </button>
                      <button
                        onClick={openExchange}
                        className={`w-full bg-[#23221f] text-[14px] rounded-[10px] px-4 py-4 space-x-2 flex items-center justify-between`}
                      >
                        <div className="flex items-center space-x-2 justify-start w-[80%]">
                          {selectedExchange.id === "selectex" ? (
                            <span className="flex items-center justify-center mt-[1px]">
                              <RiExchangeDollarFill size={34} className={``} />
                            </span>
                          ) : (
                            <span className="flex items-center justify-center mt-[1px]">
                              <img
                                src={selectedExchange.icon}
                                alt={selectedExchange.title}
                                className={`w-[34px] h-[34px] rounded-full`}
                              />
                            </span>
                          )}
                          <div className="flex flex-col text-left">
                            <h2 className="flex flex-1 font-medium">
                              Choose airdrop exchange
                            </h2>
                            <div className="text-[13px] font-normal">
                              {selectedExchange.id === "selectex" ? (
                                <>None</>
                              ) : (
                                <>{selectedExchange.name}</>
                              )}
                            </div>
                          </div>
                        </div>

                        <MdOutlineKeyboardArrowRight
                          size={24}
                          className={`text-[#959595]`}
                        />
                      </button>
                    </div>
                  </div>
                  <Exchanges
                    showExchange={showExchange}
                    setShowExchange={setShowExchange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
          claimModal === true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div
          ref={modalRef}
          className={`${
            claimModal === true
              ? "opacity-100 mt-0 ease-in duration-300"
              : "opacity-0 mt-[100px]"
          } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}
        >
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <IoCheckmarkCircleSharp size={32} className="text-accent" />
            <p className="font-medium text-center">Congratulations!</p>
            <span className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 flex flex-col justify-center w-full text-center items-center space-x-1">
              <span className="flex items-center justify-center space-x-[2px] text-[18px]">
                <img src="/eggs.webp" alt="dscfd" className="w-[18px]" />
                <span className="text-accent pr-[6px]">
                  +{formatNumber(pointsEarned)} $
                  {process.env.REACT_APP_PROJECT_SYMBOL}{" "}
                </span>{" "}
                CLAIMED
              </span>
            </span>
            <p className="pb-6 text-[15px] w-full text-center">
              Continue mining to claim more tokens daily! 😎
            </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={closeClaimerr}
              className={`bg-btn4 w-full py-[16px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
              Continue Mining
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          openInfoTwo === true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div
          ref={infoRefTwo}
          className={`${
            openInfoTwo === true
              ? "opacity-100 mt-0 ease-in duration-300"
              : "opacity-0 mt-[100px]"
          } w-full bg-modal !bottom-0 relative rounded-[16px] flex flex-col justify-center p-8`}
        >
          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <div className="w-[50px] h-[50px] fanbg border-[#616161] border-[2px] flex justify-center rounded-full items-center text-center relative">
                {isFarming ? (
                  <img
                    src="/fan.webp"
                    alt="dscfd"
                    className="w-[30px] h-[30px] animate-spin"
                    style={{ animationDuration: "2s" }}
                  />
                ) : (
                  <img
                    src="/fan.webp"
                    alt="dscfd"
                    className="w-[30px] h-[30px]"
                  />
                )}
                <div className="absolute z-10 bg-[#3f2900] border-[1px] border-[#8b8b8b] rounded-full h-[16px] w-[16px] flex justify-center items-center">
                  <img src="/eggs.webp" alt="sdfd" className="w-[8px]" />
                </div>
              </div>
              <p className="font-medium text-[14px]">mining profit per hour</p>
            </div>
            <h3 className="font-medium text-center text-[20px] text-[#ffffff] pb-2 uppercase">
              {totalMiningPower} PPS
            </h3>
            <p className="pb-6 text-[13px] w-full text-center">
              This is the amount of tokens you earn every 1 second when mining
              is active, you can boost your mining profit for a while by
              clicking on the Boost Mining option or forever by Upgrading.
            </p>
          </div>

          <div className="w-full flex justify-center">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className={`bg-btn4 text-[#000] w-fit py-[10px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
              Okay, Continue!
            </button>
          </div>
        </div>
      </div>
    </Animate>
  );
};

export default CryptoFarming;
