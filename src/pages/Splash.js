import React, { useEffect } from "react";
import { useUser } from "../context/userContext";
import { formatNumber } from "../utils/functions";
import { useNavigate } from "react-router-dom";
const Splash = () => {
  const {
    plusMiningPower,
    boostedPower,
    balance,
    referrals,
    setTab,
    setHider,
  } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    setHider(true);
  }, []);
  return (
    <div className="flex flex-col justify-start h-[100%] pt-4  items-stretch">
      <div className="flex flex-col w-full gap-2 text-white items-center">
        <h1 className="lilita text-[36px] font-bold">Welcome to the</h1>
        <h1 className="lilita text-[50px] font-bold">BLEGGS</h1>
        <h1 className="lilita text-[36px] font-bold">Miner System!</h1>
        <h2 className="text-[12px]">
          Engage, Earn, and Grow with the Community
        </h2>
        <div className="customCard-container rounded-full">
          <div
            onClick={() => {
              setTab("Exchange");
              setHider(false);
              navigate("/");
            }}
            className="customCard rounded-full bg-btn  text-[#fff] font-bold cursor-pointer px-4 py-2 mb-4"
          >
            <h2>Start Earning BLEGGS Today!</h2>
          </div>
        </div>
      </div>
      {/* <h6 className='self-center lilita text-center text-[12px] font-bold bg-[#e6c12e] w-16 rounded-full text-white mt-1'>Beta V 1.0</h6> */}
      <div className="flex flex-col">
        <section className="grid grid-cols-3 space-x-1 w-full badge items-baseline place-items-center mb-4">
          <img
            src="badge 1.png"
            alt="badge"
            className="h-[60px] w-[60px] aspect-square"
          />
          <div className="relative h-[120px] w-[147px] aspect-auto">
            <img
              src="badge 2.png"
              alt="badge"
              className="h-[120px] w-[147px] "
            />
            <div className="absolute flex items-center justify-center top-0 left-0 h-[120px] w-full text-center">
              <h1 className="text-[12px] text-[#FFD798] font-bold">
                {formatNumber(balance)}
              </h1>
            </div>
          </div>
          <img
            src="badge 3.png"
            alt="badge"
            className="h-[60px] w-[60px] aspect-square"
          />
        </section>
        <section className="grid grid-cols-3 space-x-1">
          <div className="flex flex-col items-center">
            <h3 className="text-[16px] text-white py-2">Referrals</h3>
            <div className="customCard-container p-[3px]">
              <div className="customCard text-center cursor-default flex items-center justify-center h-[70px]">
                <h3 className="text-[12px] font-bold">
                  Successful
                  <br />
                  Referrals
                  {/* <br />
                  {referrals.length} */}
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-[16px] text-white py-2">Earning</h3>
            <div className="customCard-container p-[3px]">
              <div className="customCard text-center flex cursor-default items-center justify-center h-[70px]">
                <h3 className="text-[12px] font-bold">
                  You Earned
                  <br />
                  {Number(balance).toFixed(2)} BLEGGS
                </h3>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-[16px] text-white py-2">Hash Power</h3>
            <div className="customCard-container p-[3px]">
              <div className="customCard text-center flex cursor-default items-center justify-center h-[70px]">
                <h3 className="text-[12px] font-bold">
                  {boostedPower > 0 ? boostedPower : plusMiningPower}/MHS
                </h3>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="fixed left-8 bottom-8">
        <h6 className="lilita text-center text-[12px] font-bold bg-[#e6c12e] w-20 rounded-full text-white mt-1 px-2">
          Beta V 2.0
        </h6>
      </div>
    </div>
  );
};
export default Splash;
