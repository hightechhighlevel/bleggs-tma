const BOT_TOKEN =
  process.env.REACT_APP_BOT_TOKEN ||
  "8004188832:AAHZMqZbnUV97ES9QtTxT4OQ69co5nVNmFE";
export const formatNumber = (number) => {
  if (number === undefined || number === null || isNaN(number)) {
    return "";
  }

  if (number >= 1000000) {
    return Number(number / 1000000.0).toFixed() + "M";
  } else if (number >= 100000) {
    return  Number(number / 1000).toFixed(0) + "K";
  } else {
    return Number(number)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
};
export const shortenName = (name) => {
  // Check if the name is longer than 16 characters
  if (name.length > 16) {
    return name.substring(0, 16) + "..."; // Return the first 16 characters followed by '...'
  }
  return name; // Return the original name if it's less than or equal to 16 characters
};

export const transaction = (cost) => ({
  validUntil: Math.floor(Date.now() / 1000) + 300,
  messages: [
    {
      address: "UQD2IFJmU6GQo84dekQtICKLPs2M1ISE6D6j3KJyi12n_d_W",
      amount: cost, // Accurate cost from the selected mining power
    },
  ],
});

export const fetchUsdToEthRate = async () => {
  // "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  // "https://api.binance.com/api/v3/avgPrice?symbol=BNBUSDT"
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
  );
  const data = await response.json();
  return data.binancecoin.usd;
};
export const calculateEthFromUsd = (usdAmount, usdToEthRate) => {
  return usdAmount / usdToEthRate;
};

export const getUserAvatarUrl = async (userId) => {
  console.log("bot_token: ", BOT_TOKEN);
  try {
    const profilePhotosResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}`
    );
    const profilePhotosData = await profilePhotosResponse.json();
    if (profilePhotosData.ok && profilePhotosData.result.total_count > 0) {
      const fileId = profilePhotosData.result.photos[0].pop().file_id;
      const fileResponse = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
      );
      const fileData = await fileResponse.json();
      if (fileData.ok) {
        const filePath = fileData.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
        return fileUrl; // Return the photo URL
      } else {
        return null;
      }
    } else {
      // throw new Error('User has no profile photos.');
      return null;
    }
  } catch (error) {
    console.error("Error fetching user's avatar URL:", error);
    return null;
  }
};

export const slicFunc = (username) => {
  if (username.length <= 9) return username;
  return username.slice(0, 9) + "..";
};
