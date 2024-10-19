import { constants } from "../constants";

export const getUserChat = async (apiMessages) => {

  const response = await fetch(constants.API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: constants.MODEL, messages: apiMessages }),
  });
  return response;
};
