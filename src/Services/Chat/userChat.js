import { constants } from "../constants";

export const getUserChat = async (apiMessages, token) => {
  try {
    const response = await fetch(constants.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: constants.MODEL,
        messages: apiMessages,
      }),
    });

    // Return the response data
    return response;
  } catch (error) {
    console.error("Error in getUserChat:", error);
    throw error;
  }
};
