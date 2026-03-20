import React, { createContext, useContext, useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  collection,
  orderBy,
  where,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firestore"; // Adjust the path as needed
import { useLocation } from "react-router-dom";
import { getUserAvatarUrl } from "../utils/functions";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingTwo, setLoadingTwo] = useState(true);
  const [refBonus, setRefBonus] = useState(0);
  const [manualTasks, setManualTasks] = useState([]);
  const [advertTasks, setAdvertTasks] = useState([]);
  const [userAdvertTasks, setUserAdvertTasks] = useState([]);
  const [userManualTasks, setUserManualTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [hider, setHider] = useState(false);
  const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
  // const telegramUser = {
  //   id: "7211331993",
  //   username: "super0827",
  //   first_name: "High",
  //   last_name: "Tech",
  //   is_premium: true,
  // };
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isAddressSaved, setIsAddressSaved] = useState(false); // State to track if address is saved
  const [checker, setChecker] = useState(false);
  const [premium, setPremium] = useState(false);
  const [taskPoints, setTaskPoints] = useState(0);
  const [slotPoints, setSlotPoints] = useState(0);
  const [premiumReward, setPremiumReward] = useState(0);
  const [checkinRewards, setCheckinRewards] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [checkInDays, setCheckInDays] = useState([]);
  const [error, setError] = useState(null);
  const [showStartOverModal, setShowStartOverModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [plusMiningPower, setPlusMiningPower] = useState(0);
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [mineLeaderBoard, setMineLeaderBoard] = useState([]);
  const [miningTotal, setMiningTotal] = useState(0);
  const [activeUserRank, setActiveUserRank] = useState(null);
  const [activeMineUserRank, setActiveMineUserRank] = useState(null);
  const [tonTransactions, setTonTransactions] = useState(0);
  const [tonTasks, setTonTasks] = useState(false);
  const location = useLocation();
  const [openInfoThree, setOpenInfoThree] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState({
    id: "selectex",
    icon: "/exchange.svg",
    name: "Select exchange",
  });
  const [youtubeTasks, setYoutubeTasks] = useState([]);
  const [followTasks, setFollowTasks] = useState([]);
  const [userYoutubeTasks, setUserYoutubeTasks] = useState([]);
  const [userFollowTasks, setUserFollowTasks] = useState([]);
  // eslint-disable-next-line
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [lastFarmDate, setLastFarmDate] = useState(null);
  const [isFarming, setIsFarming] = useState(false);
  const [canFarm, setCanFarm] = useState(false);

  const [canClaim, setCanClaim] = useState(false);
  const [plusMiningTime, setPlusMiningTime] = useState(-1);
  const [initialMiningTime, setInitialMiningTime] = useState(0);
  const [initialMiningPower, setInitialMiningPower] = useState(0);
  const [miningCountPerDay, setMiningCountPerDay] = useState(-1);
  const [coolDownTime, setCoolDownTime] = useState(0);
  const [tappingGuru, setTappingGuru] = useState(0);
  const [premiumPoints, setPremiumPoints] = useState(0);
  const [photoUrl, setPhotoUrl] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [boostedPower, setBoostedPower] = useState(0);
  const [boostedTime, setBoostedTime] = useState(0);
  const [tab, setTab] = useState("Splash");
  const [levels, setLevels] = useState([{ name: "1", value: 0 }]);
  const [boostPowerLevels, setBoostPowerLevels] = useState([
    {
      title: "3x mining rig power",
      capacity: 3,
      cost: "1",
      xx: "3x",
    },
  ]);
  const [boostTimeLevels, setBoostTimeLevels] = useState([
    {
      title: "increase +1x",
      capacity: 1,
      cost: "1",
      xx: "1x",
    },
  ]);
  const [upgradePowerLevels, setUpgradePowerLevels] = useState([]);
  const [upgradeTimeLevels, setUpgradeTimeLevels] = useState([
    { title: "increase to x2", capacity: 2, cost: "400000", xx: "2x" },
  ]);
  const [rankPowerLevels, setRankPowerLevels] = useState([]);
  const [isUpgradeTime, setIsUpgradeTime] = useState(false);
  const [minusPoints, setMinusPoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState([{}]);
  // const [pointsEarned, setPointsEarned] = useState(0);

  const fetchData = async (userId) => {
    if (!userId) return;

    try {
      // Fetch the active user's data
      const userRef = doc(db, "telegramUsers", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userBalance = userData.balance;
        const userMiningTotal = userData.miningTotal;
        // Set all other user data
        setBalance(userBalance);
        setClaimedReferralRewards(userData.claimedReferralRewards || []);
        setLastCheckIn(userData.lastCheckIn? new Date(userData.lastCheckIn) : null);
        setCheckInDays(userData.checkInDays || []);
        setUsername(userData.username);
        setTonTasks(userData.tonTasks);
        setTonTransactions(userData.tonTransactions);
        setSelectedExchange(userData.selectedExchange);
        setWalletAddress(userData.address);
        setIsAddressSaved(userData.isAddressSaved);
        setMiningTotal(userData.miningTotal);
        setPlusMiningPower(userData.plusMiningPower);
        setPremium(userData.isPremium);
        setTaskPoints(userData.taskPoints);
        setSlotPoints(userData.slotPoints);
        setPremiumReward(userData.premiumReward);
        setUserYoutubeTasks(userData.youtubeTasks || []);
        setUserFollowTasks(userData.followTasks || []);
        setCheckinRewards(userData.checkinRewards);
        setFullName(userData.fullName);
        setId(userData.userId);
        setRefBonus(userData.refBonus || 0);
        setCompletedTasks(userData.tasksCompleted || []);
        setUserManualTasks(userData.manualTasks || []);
        setUserAdvertTasks(userData.advertTasks || []);
        setReferrals(userData.referrals || []);
        await updateActiveTime(userRef);
        setLastFarmDate(userData.lastFarmDate? new Date(userData.lastFarmDate) : null);
        setIsFarming(userData.isFarming || false);
        setCanClaim(userData.canClaim || false);
        setPlusMiningTime(userData.plusMiningTime);
        setBoostedPower(userData.boostedPower || 0);
        setBoostedTime(userData.boostedTime || 0);
        setIsUpgradeTime(userData.isUpgradeTime || false);
        setMinusPoints(userData.minusPoints || 0);
        await updateReferrals(userRef);
        // setPointsEarned(userData.pointsEarned);

        //Get User's Avatar Url
        getUserAvatarUrl(telegramUser.id.toString()).then((url) =>
          setPhotoUrl(url)
        );
        //Get Levels
        await fetchLevels();
        await fetchDailyCheckBonus();
        await fetchBoostPowerLevels();
        await fetchBoostTimeLevels();
        await fetchUpgradePowerLevels();
        await fetchUpgradeTimeLevels();
        await fetchRankPowerLevels();
        //Get Total Number of TG Users
        // const totalUsersQuery = query(collection(db, "telegramUsers"));
        // const usersDocs = await getDocs(totalUsersQuery);
        // const totalUsersCount = usersDocs.size;
        // setTotalUsers(totalUsersCount);

        // Step 1: Query Firestore to find the count of users with a balance greater than the current user
        const usersAboveQuery = query(
          collection(db, "telegramUsers"),
          where("balance", ">", userBalance)
        );

        const querySnapshot = await getDocs(usersAboveQuery);

        // Step 2: The rank is the number of users with a greater balance + 1
        const activeUserRank = querySnapshot.size + 1;
        setActiveUserRank(activeUserRank); // Set the active user rank

        // Step 1: Query Firestore to find the count of users with a balance greater than the current user
        const usersMineAboveQuery = query(
          collection(db, "telegramUsers"),
          where("miningTotal", ">", userMiningTotal)
        );

        const queryMineSnapshot = await getDocs(usersMineAboveQuery);

        // Step 2: The rank is the number of users with a greater balance + 1
        const activeMineUserRank = queryMineSnapshot.size + 1;
        setActiveMineUserRank(activeMineUserRank); // Set the active user rank

        // Continue fetching other data
        const tasksQuerySnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = tasksQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);

        const leadersQuerySnapshot = await getDocs(
          collection(db, "leaderBoard"),
          orderBy("balance", "desc")
        );
        const leadersData = leadersQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaderBoard(leadersData);
        setTotalUsers(leadersData.length);

        const mineLeadersQuerySnapshot = await getDocs(
          collection(db, "mineLeaderBoard"),
          orderBy("balance", "desc")
        );
        const mineLeadersData = mineLeadersQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMineLeaderBoard(mineLeadersData);

        const manualTasksQuerySnapshot = await getDocs(
          collection(db, "manualTasks")
        );
        const manualTasksData = manualTasksQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setManualTasks(manualTasksData);

        const advertTasksQuerySnapshot = await getDocs(
          collection(db, "advertTasks")
        );
        const advertTasksData = advertTasksQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAdvertTasks(advertTasksData);

        // Fetch youtubeTasks
        const youtubeTasksQuerySnapshot = await getDocs(
          collection(db, "youtubeTasks")
        );
        const youtubeTasksData = youtubeTasksQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setYoutubeTasks(youtubeTasksData);

        // Fetch followTasks
        const followTasksQuerySnapshot = await getDocs(
          collection(db, "followTasks")
        );
        const followTasksData = followTasksQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFollowTasks(followTasksData);
        // // Fetch settings data
        // const settingsDocRef = doc(db, 'settings', '1q01CYx0LFmgLR4wiUxX'); // Replace with your actual document ID
        // const settingsDocSnap = await getDoc(settingsDocRef);

        // if (settingsDocSnap.exists()) {
        //   const settingsData = settingsDocSnap.data();
        //   setCoolDownTime(settingsData.coolDownTime);
        //   setTappingGuru(settingsData.tappingGuru);
        // }
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  const loadSetting = async () => {
    try {
      const settingRef = doc(db, "settings", "general");
      const settingDoc = await getDoc(settingRef);
      if (settingDoc.exists()) {
        const settingsData = settingDoc.data();
        setCoolDownTime(settingsData.coolDownTime);
        setTappingGuru(settingsData.tappingGuru);
        setInitialMiningTime(settingsData.initialMiningTime);
        setInitialMiningPower(settingsData.initialPower);
        setMiningCountPerDay(settingsData.miningCountPerDay);
        setPremiumPoints(settingsData.premiumPoints);
        // console.log("settings: ", settingsData);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const fetchLevels = async () => {
    try {
      const docRef = doc(db, "levels", "general"); // Replace with your actual document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLevels(docSnap.data().levels);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };
  const fetchDailyCheckBonus = async () => {
    try {
      const docRef = doc(db, "levels", "dailyCheck"); // Replace with your actual document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBonusPoints(docSnap.data().levels);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };
  const fetchBoostPowerLevels = async () => {
    try {
      const docRef = doc(db, "levels", "boostPower"); // Replace with your actual document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBoostPowerLevels(docSnap.data().levels);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching levels:", error);
    }
  };
  const fetchBoostTimeLevels = async () => {
    try {
      const docRef = doc(db, "levels", "boostTime"); // Replace with your actual document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBoostTimeLevels(docSnap.data().levels);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching levels:", error);
    }
  };
  const fetchUpgradePowerLevels = async () => {
    try {
      const docRef = doc(db, "levels", "upgradePower"); // Replace with your actual document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUpgradePowerLevels(docSnap.data().levels);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching levels:", error);
    }
  };
  const fetchUpgradeTimeLevels = async () => {
    try {
      const docRef = doc(db, "levels", "upgradeTime"); // Replace with your actual document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUpgradeTimeLevels(docSnap.data().levels);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching levels:", error);
    }
  };
  const fetchRankPowerLevels = async () => {
    try {
      const docRef = doc(db, "levels", "boostRank"); // Replace with your actual document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRankPowerLevels(docSnap.data().levels);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching levels:", error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
    // eslint-disable-next-line
  }, [id]);
  useEffect(() => {
    if (plusMiningPower <= 0 && initialMiningPower > 0)
      setPlusMiningPower(initialMiningPower);
    if (plusMiningTime <= 0 && initialMiningTime > 0)
      setPlusMiningTime(initialMiningTime);
  }, [initialMiningPower, initialMiningTime, plusMiningPower, plusMiningTime]);
  const sendUserData = async () => {
    const queryParams = new URLSearchParams(window.location.search);

    let referrerId = queryParams.get("ref");

    if (referrerId) {
      referrerId = referrerId.replace(/\D/g, "");
    }

    if (telegramUser) {
      const {
        id: userId,
        username,
        first_name: firstName,
        last_name: lastName,
        is_premium,
      } = telegramUser;
      console.log("telegram User: ", telegramUser);
      const finalUsername = username || `${firstName}_${userId}`;
      const fullNamed = `${firstName} ${lastName}`;

      try {
        const userRef = doc(db, "telegramUsers", userId.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          fetchData(userId.toString());
          await updateReferrals(userRef);
          setInitialized(true);
          return;
        }
        const userData = {
          userId: userId.toString(),
          username: finalUsername,
          firstName: firstName,
          lastName: lastName,
          fullName: fullNamed,
          selectedExchange: {
            id: "selectex",
            icon: "/exchange.svg",
            name: "Choose exchange",
          },
          tonTransactions: 0,
          taskPoints: 0,
          checkinRewards: 0,
          plusMiningPower: 0,
          premiumReward: 0,
          totalBalance: 0,
          miningTotal: 0,
          balance: 0,
          isPremium: is_premium || false, // Add the is_premium field here
          lastActive: new Date(),
          refereeId: referrerId || null,
          referrals: [],
          lastFarmDate: null,
          timeRemaining: 0,
          isFarming: false,
          canClaim: false,
          plusMiningTime: 0,
          boostedPower: 0,
          boostedTime: 0,
          isUpgradeTime: false,
          minusPoints: 0,
        };

        await setDoc(userRef, userData);
        setTonTransactions(tonTransactions);
        setCheckinRewards(0);
        setPlusMiningPower(plusMiningPower);
        setMiningTotal(userData.miningTotal);
        setFullName(fullNamed);
        setPremium(is_premium || false);
        setId(userId.toString());

        if (referrerId) {
          const referrerRef = doc(db, "telegramUsers", referrerId);
          const referrerDoc = await getDoc(referrerRef);
          if (referrerDoc.exists()) {
            await updateDoc(referrerRef, {
              referrals: arrayUnion({
                userId: userId.toString(),
                username: finalUsername,
                balance: 0,
                level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" },
              }),
            });
          }
        }

        setInitialized(true);
        fetchData(userId.toString());
        console.log("PREMIUM STATUS IS:", premium);
      } catch (error) {
        console.error("Error saving user in Firestore:", error);
      }
    }
  };

  const updateActiveTime = async (userRef) => {
    try {
      await updateDoc(userRef, {
        lastActive: new Date(),
      });
      console.log("Active Time Updated");
    } catch (error) {
      console.error("Error updating Active Time:", error);
    }
  };

  const updateReferrals = async (userRef) => {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const referrals = userData.referrals || [];

    const updatedReferrals = await Promise.all(
      referrals.map(async (referral) => {
        const referralRef = doc(db, "telegramUsers", referral);
        const referralDoc = await getDoc(referralRef);
        if (referralDoc.exists()) {
          const referralData = referralDoc.data();
          return {
            username: referralData.username,
            balance: referralData.balance,
          };
        }
        return null;
      }).filter(ref => ref !== null)
    );

    // await updateDoc(userRef, { referrals: updatedReferrals });
    console.log("updatedReferrals:", updatedReferrals);
    setReferrals(updatedReferrals);

    const totalEarnings = updatedReferrals.reduce(
      (acc, curr) => acc + curr.balance,
      0
    );
    const refBonus = Math.floor(totalEarnings * 0.2);
    const totalBalance = `${balance}`;
    try {
      await updateDoc(userRef, {
        refBonus,
        totalBalance,
        lastActive: new Date(),
      });
    } catch (error) {
      console.error("Error updating referrer bonus:", error);
    }
  };

  useEffect(() => {
    setChecker(false);
    if (id) {
      // Check if the user has visited before using localStorage
      const visited = localStorage.getItem("hasVisitedBefore");
      if (balance > 0 && visited) {
        // User has visited before, no need to show the welcome message
        setHasVisitedBefore(true);
      } else {
        // User is visiting for the first time, show the welcome message
        setChecker(true);
        // Set the item in localStorage to mark the user as visited
        localStorage.setItem("hasVisitedBefore", "true");
      }
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    const checkLastCheckIn = async () => {
      if (!id) return;

      try {
        const userDocRef = doc(db, "telegramUsers", id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const now = new Date();

          const lastCheckInDate = userData.lastCheckIn? new Date(userData.lastCheckIn) : null;

          if (lastCheckInDate) {
            const lastCheckInMidnight = new Date(lastCheckInDate);
            lastCheckInMidnight.setHours(0, 0, 0, 0);

            const todayMidnight = new Date(now);
            todayMidnight.setHours(0, 0, 0, 0);

            const daysSinceLastCheckIn = Math.floor(
              (todayMidnight - lastCheckInMidnight) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceLastCheckIn === 1) {
              // Last check-in was yesterday, prompt user to claim today's bonus
              setShowClaimModal(true);
            } else if (daysSinceLastCheckIn > 1) {
              // User missed a day, show the start over modal
              setShowStartOverModal(true);
            }
          } else {
            // First time check-in, set the check-in modal to be shown
            setShowClaimModal(true);
          }
        }
      } catch (err) {
        console.error("Error during initial check-in:", err);
        setError("An error occurred while checking your last check-in.");
      }
    };

    checkLastCheckIn();
  }, [id, setCheckInDays, setError]);

  useEffect(() => {
    sendUserData();
    loadSetting();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const rewards = document.getElementById("reels");
    const rewardsTwo = document.getElementById("reels2");
    if (rewards && rewardsTwo)
      if (
        location.pathname.startsWith("/airdrop") ||
        location.pathname.startsWith("/checkin")
      ) {
        rewards.style.background = "#ffd798";
        rewards.style.color = "#000";
        rewards.style.height = "34px";
        rewards.style.marginTop = "4px";
        rewards.style.paddingLeft = "6px";
        rewards.style.paddingRight = "6px";
        rewards.style.borderRadius = "24px";
        rewardsTwo.style.filter = "brightness(0.1)";
      } else if (!location.pathname.startsWith("/splash")) {
        rewards.style.background = "";
        rewards.style.color = "";
        rewards.style.height = "";
        rewards.style.marginTop = "";
        rewards.style.paddingLeft = "";
        rewards.style.paddingRight = "";
        rewards.style.borderRadius = "";
        rewardsTwo.style.filter = "";
      }
  }, [location.pathname]);
  useEffect(() => {
    // Check if the user has visited before using localStorage
    const visited = localStorage.getItem("hasVisitedBefore");
    if (visited) {
      // User has visited before, no need to show the welcome message
      setHasVisitedBefore(true);
    } else {
      setHider(true);
      // Set the item in localStorage to mark the user as visited
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);
  return (
    <UserContext.Provider
      value={{
        balance,
        setBalance,
        openInfoThree,
        setOpenInfoThree,
        youtubeTasks,
        setYoutubeTasks,
        userYoutubeTasks,
        setUserYoutubeTasks,
        followTasks,
        setFollowTasks,
        userFollowTasks,
        setUserFollowTasks,
        fullName,
        selectedExchange,
        setSelectedExchange,
        leaderBoard,
        tonTasks,
        setTonTasks,
        username,
        tonTransactions,
        setTonTransactions,
        activeMineUserRank,
        setActiveMineUserRank,
        setUsername,
        activeUserRank,
        setActiveUserRank,
        mineLeaderBoard,
        setMineLeaderBoard,
        miningTotal,
        setMiningTotal,
        setLeaderBoard,
        plusMiningPower,
        setPlusMiningPower,
        loadingTwo,
        setLoadingTwo,
        checkinRewards,
        setCheckinRewards,
        taskPoints,
        setTaskPoints,
        slotPoints,
        setSlotPoints,
        premiumReward,
        setPremiumReward,
        showStartOverModal,
        setShowStartOverModal,
        showClaimModal,
        setShowClaimModal,
        lastCheckIn,
        setLastCheckIn,
        checkInDays,
        setCheckInDays,
        error,
        setError,
        checker,
        setChecker,
        premium,
        setPremium,
        userAdvertTasks,
        setUserAdvertTasks,
        advertTasks,
        setAdvertTasks,
        setFullName,
        walletAddress,
        setWalletAddress,
        isAddressSaved,
        setIsAddressSaved,
        loading,
        setLoading,
        id,
        setId,
        sendUserData,
        refBonus,
        setRefBonus,
        manualTasks,
        setManualTasks,
        userManualTasks,
        setUserManualTasks,
        tasks,
        setTasks,
        completedTasks,
        setCompletedTasks,
        referrals,
        claimedReferralRewards,
        setClaimedReferralRewards,
        initialized,
        setInitialized,
        lastFarmDate,
        setLastFarmDate,
        isFarming,
        setIsFarming,
        canClaim,
        setCanClaim,
        canFarm,
        setCanFarm,
        plusMiningTime,
        setPlusMiningTime,
        miningCountPerDay,
        initialMiningPower,
        initialMiningTime,
        premiumPoints,
        isUpgradeTime,
        setIsUpgradeTime,
        minusPoints,
        setMinusPoints,
        hider,
        setHider,
        photoUrl,
        totalUsers,
        boostedPower,
        setBoostedPower,
        boostedTime,
        setBoostedTime,
        tab,
        setTab,
        levels,
        boostPowerLevels,
        boostTimeLevels,
        upgradeTimeLevels,
        upgradePowerLevels,
        rankPowerLevels,
        bonusPoints
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
