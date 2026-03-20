import React, { useState, useEffect } from "react";
import { addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firestore";
import { IoCloseCircleSharp } from "react-icons/io5";

const UpgradeTimeAdmin = () => {
  const [levels, setLevels] = useState([
    { title: "increase to x2", capacity: 2, cost: "400000", xx: "2x" },
  ]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [initialTime, setInitialTime] = useState(0);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    const docRef = doc(db, "levels", "upgradeTime"); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setLevels(docSnap.data().levels);
    } else {
      console.log("No such document!");
    }
    const docRef1 = doc(db, "settings", "general");
    const docSnap1 = await getDoc(docRef1);
    if(docSnap1.exists()){
      setInitialTime(docSnap1.data().initialMiningTime);
    }else {
      console.log("No initial mining Time set!");
    }
  };

  const handleTitleChange = (e, index) => {
    setLevels(
      levels.map((level, i) =>
        i === index ? { ...level, title: e.target.value } : { ...level }
      )
    );
  };
  const handleCapacityChange = (e, index) => {
    setLevels(
      levels.map((level, i) =>
        i === index
          ? { ...level, capacity: Number(e.target.value), xx: `${e.target.value}x` }
          : { ...level }
      )
    );
  };
  const handleCostChange = (e, index) => {
    setLevels(
      levels.map((level, i) =>
        i === index ? { ...level, cost: e.target.value } : { ...level }
      )
    );
  };
  // const handleXXChange = (e, index) => {
  //   setLevels(
  //     levels.map((level, i) =>
  //       i === index ? { ...level, xx: e.target.value } : { ...level }
  //     )
  //   );
  // };
  const handleUpdate = async () => {
    const docRef = doc(db, "levels", "upgradeTime"); 
    try {
      const levelsDoc = await getDoc(docRef);
      if (levelsDoc.exists()) await updateDoc(docRef, { levels: levels });
      else await setDoc(docRef, { levels: levels });
      fetchLevels();
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };
  const handleAddNew = async () => {
    let newLabels = [
      ...levels,
      { title: "increase to x2", capacity: 2, cost: "400000", xx: "2x" },
    ];
    setLevels(newLabels);
    const docRef = doc(db, "levels", "upgradeTime"); 
    try {
      const levelsDoc = await getDoc(docRef);
      if (levelsDoc.exists()) await updateDoc(docRef, { levels: newLabels });
      else await setDoc(docRef, { levels: newLabels });
      fetchLevels();
      // setShowSuccessModal(true); // Show success modal
    } catch (e) {
      console.error("Error adding new document: ", e);
    }
  };
  const handleDelete = async (index) => {
    const newLevels = levels.filter((level, i) => i !== index);
    setLevels(newLevels);
    const docRef = doc(db, "levels", "upgradeTime"); 
    try {
      const levelsDoc = await getDoc(docRef);
      await setDoc(docRef, { levels: newLevels });
      fetchLevels();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div
      id="refer"
      className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]"
    >
      <h1 className="text-[20px] font-semibold mb-1">Set Default Values</h1>

      <div className="flex w-full flex-wrap gap-3">
        {levels.map((level, index) => {
          return (
            <div
              key={`boostpowerlabels${index}`}
              className="flex flex-row w-full gap-4"
            >
              <div className="flex flex-col w-full sm:w-[49%] gap-1">
                <label className="text-[13px] pl-1 pb-[2px] font-medium">
                  Title
                </label>
                <input
                  type="text"
                  name={`leveltitle` + index}
                  value={level.title}
                  onChange={(event) => handleTitleChange(event, index)}
                  placeholder="Level Title"
                  className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                />
              </div>
              <div className="flex flex-col w-full sm:w-[49%] gap-1">
                <label className="text-[13px] pl-1 pb-[2px] font-medium">
                  Times to initial Mining Time ({`${initialTime} * ${level.capacity} = ${initialTime * level.capacity} s`})
                </label>
                <input
                  type="text"
                  name={`levelcapacity` + index}
                  value={level.capacity}
                  onChange={(event) => handleCapacityChange(event, index)}
                  placeholder="Times to initial Mining Time"
                  className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                />
              </div>
              <div className="flex flex-col w-full sm:w-[49%] gap-1">
                <label className="text-[13px] pl-1 pb-[2px] font-medium">
                  Cost (Bleggs)
                </label>
                <input
                  type="text"
                  name={`levelcost` + index}
                  value={level.cost}
                  onChange={(event) => handleCostChange(event, index)}
                  placeholder="Cost in Bleggs"
                  className="bg-[#4b4b4b] placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[10px] flex items-center px-6"
                />
              </div>
              
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 rounded-[6px] text-white px-2 py-[6px] h-12 self-end text-center"
              >
                Delete
              </button>
            </div>
          );
        })}

        <div className="flex flex-row w-full gap-3 justify-center">
          <button
            onClick={handleAddNew}
            className="bg-green-500 font-semibold text-[15px] rounded-[6px] w-[50%] sm:w-[200px] h-fit px-4 py-3 text-[#fff]"
          >
            Add New
          </button>
          <button
            onClick={handleUpdate}
            className="bg-green-500 font-semibold text-[15px] rounded-[6px] w-[50%] sm:w-[200px] h-fit px-4 py-3 text-[#fff]"
          >
            Update
          </button>
        </div>
      </div>

      {/* Success Modal */}

      {showSuccessModal && (
        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
          <div className="modal-container bg-[#595D65] w-11/12 md:max-w-md mx-auto rounded-[10px] shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-end items-center pb-3">
                <div
                  className="modal-close cursor-pointer z-50"
                  onClick={closeModal}
                >
                  <IoCloseCircleSharp size={32} className="text-secondary" />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <p>Settings have been updated successfully.</p>
              </div>
              <div className="flex justify-center pt-2">
                <button
                  className="modal-close bg-blue-500 text-white p-2 px-6 rounded"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradeTimeAdmin;
