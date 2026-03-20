import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firestore"; // adjust the path as needed
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { formatNumber } from "../../utils/functions";
import { getUserAvatarUrl } from "../../utils/functions";
import {
  IoCheckmarkCircleSharp,
  IoCloseCircleSharp,
  IoCheckmarkSharp,
} from "react-icons/io5";

const FollowTaskApprove = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [displayFollowers, setDisplayFollowers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({}); // Add state for dropdown visibility
  const [followTasks, setFollowTasks] = useState([]);
  const [onlyApproved, setOnlyApproved] = useState(true);
  const [onlyPending, setOnlyPending] = useState(true);
  const [onlyDenied, setOnlyDenied] = useState(true);

  const handleSearch = async () => {
    setDisplayFollowers(
      followers.filter((data) => data.username.includes(searchTerm))
    );
  };

  const fetchUsers = async (loadMore = false) => {
    setLoading(true);
    await fetchFollowTasks();
    try {
      const docRef = query(
        collection(db, "taskApproval"),
        orderBy("date", "desc")
      ); // Replace with your actual document ID
      const docSnaps = await getDocs(docRef);

      if (docSnaps.size > 0) {
        setFollowers(docSnaps.docs.map((doc) => ({ ...doc.data() })));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
      setErrorMessage("Error fetching users");
    } finally {
      setLoading(false);
    }
  };
  const fetchFollowTasks = async () => {
    try {
      const followTasksQuerySnapshot = await getDocs(
        collection(db, "followTasks")
      );
      const followTasksData = followTasksQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFollowTasks(followTasksData);
    } catch (error) {
      console.error("Error fetching follow tasks: ", error);
    }
  };

  const handleDeny = async (uuid) => {
    try {
      const approvalDocRef = doc(db, "taskApproval", uuid);
      const updatedData = {
        ...followers.filter((data) => data.uuid === uuid)[0],
        approved: false,
        denied: true,
      };
      await updateDoc(approvalDocRef, {
        approved: false,
        denied: true,
      });
      const userDocRef = doc(db, "telegramUsers", updatedData.userId);
      const userDoc = await getDoc(userDocRef);
      const userFollowTasks = userDoc.data().followTasks;
      await updateDoc(userDocRef, {
        followTasks: userFollowTasks.filter(
          (data) => data.taskId !== updatedData.taskId
        ),
      });
      setFollowers(
        followers.map((data) => (data.uuid === uuid ? updatedData : data))
      );
    } catch (err) {
      console.log("Error while denying: ", err);
    }
  };
  const handleApprove = async (uuid) => {
    try {
      const approvalDocRef = doc(db, "taskApproval", uuid);
      const updatedData = {
        ...followers.filter((data) => data.uuid === uuid)[0],
        approved: true,
        denied: false,
      };
      await updateDoc(approvalDocRef, {
        approved: true,
        denied: false,
      });
      const userDocRef = doc(db, "telegramUsers", updatedData.userId);
      const userDoc = await getDoc(userDocRef);
      const userFollowTasks = userDoc.data().followTasks;

      const newApprovedTask = {
        taskId: updatedData.taskId,
        completed: true,
        bonusReceived: false,
      };
      await updateDoc(userDocRef, {
        followTasks: userFollowTasks.map((data) =>
          data.taskId === updatedData.taskId ? newApprovedTask : data
        ),
      });
      setFollowers(
        followers.map((data) => (data.uuid === uuid ? updatedData : data))
      );
    } catch (err) {
      console.log("Error while denying: ", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const toggleDropdown = (userId) => {
    setDropdownVisible((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  useEffect(() => {
    if (onlyApproved && onlyDenied) {
      setDisplayFollowers([...followers]);
    } else if (!(onlyApproved || onlyDenied)) {
      setDisplayFollowers(
        followers.filter(
          (data) => data.approved === false && data.denied === false
        )
      );
    } else {
      setDisplayFollowers(
        followers.filter(
          (data) => data.approved === onlyApproved || data.denied === onlyDenied
        )
      );
    }
  }, [onlyApproved, onlyDenied, followers]);

  return (
    <div className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]">
      <div className="w-full sm:w-[50%] flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by username or userId"
            className="bg-[#4b4b4b] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
          />
          <button
            onClick={handleSearch}
            className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000]"
          >
            Search
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOnlyApproved(!onlyApproved)}
            className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000] flex gap-1 justify-center"
          >
            Approved {onlyApproved && <IoCheckmarkSharp size={20} />}
          </button>
          <button
            onClick={() => setOnlyDenied(!onlyDenied)}
            className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000] flex gap-1 justify-center"
          >
            Denied {onlyDenied && <IoCheckmarkSharp size={20} />}
          </button>
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>

      <div className="w-full sm:w-[50%] flex flex-col space-y-3">
        <h2 className="text-[20px] font-semibold">Followers List</h2>
        <button
          onClick={() => fetchUsers(true)}
          disabled={loading}
          className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000] mt-4"
        >
          {loading ? "Loading..." : "Load More Users"}
        </button>
        {displayFollowers.map((user, index) => (
          <div
            key={`${user.uuid}`}
            className="bg-[#4b4b4b] p-4 rounded-[10px] text-[13px] relative flex flex-row w-full space-y-2 gap-4 justify-start pr-7"
          >
            <span className="flex w-[40%] items-center space-x-1">
              <img
                // src={getUserAvatarUrl(user.userId)}
                src={user.avatarUrl}
                alt="UserAvatar"
                className="w-[30px] h-[30px] rounded-full"
              />
              <span className="line-clamp-1 font-semibold">
                {user.username} | {user.userId}
              </span>{" "}
            </span>

            <span className="flex w-[20%] items-center gap-1 psl-1">
              <img
                src={
                  followTasks.filter((task) => task.id === user.taskId)[0].icon
                }
                alt="taskIcon"
                className="w-[30px] h-[30px] rounded-full"
              />
              <p>
                <span className="font-semibold text-accent">
                  {" "}
                  {
                    followTasks.filter((task) => task.id === user.taskId)[0]
                      .title
                  }
                </span>
              </p>
            </span>
            <span className="w-[20%]">
              {new Date(user.date.toDate()).toLocaleString()}
            </span>
            {user.approved && (
              <span>
                <IoCheckmarkCircleSharp size={28} className={`text-accent`} />
              </span>
            )}
            {user.denied && (
              <span>
                <IoCloseCircleSharp size={28} className={`text-red-600`} />
              </span>
            )}

            <button
              onClick={() => toggleDropdown(user.uuid)}
              className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-2 h-[28px] w-[28px] flex items-center justify-center"
            >
              ⋮
            </button>

            {dropdownVisible[user.uuid] && (
              <div
                className="absolute z-10 top-8 right-2 bg-[#2e2e2e] text-primary rounded-md shadow-lg w-40"
                onClick={() => toggleDropdown(user.uuid)}
                onPointerLeave={() => {
                  console.log("blured!");
                  toggleDropdown(user.uuid);
                }}
              >
                {
                  <button
                    onClick={() => handleApprove(user.uuid)}
                    className={`block w-full text-left px-4 py-2 hover:bg-[#7a7a7a33] ${
                      (user.approved || user.denied) && "text-gray-500"
                    }`}
                    disabled={user.approved || user.denied}
                  >
                    Approve
                  </button>
                }
                <button
                  onClick={() => handleDeny(user.uuid)}
                  className={`block w-full text-left px-4 py-2 hover:bg-[#7a7a7a33] ${
                    user.denied && "text-gray-500"
                  }`}
                  disabled={user.denied}
                >
                  Deny
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowTaskApprove;
