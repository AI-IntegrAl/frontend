import { auth } from "../Utils/firebase";
import { notify } from "../Utils/notify";

export const useAuthHandler = (result, credential) => {
  if (result?.additionalUserInfo?.isNewUser) {
    notify(`Account created Successfully! Welcome to IntegrAI`, "success");
  } else {
    notify(`Welcome back ${result.user.displayName}`, "success");
  }
};

export const useUserInfo = () => {
  const user = auth.currentUser;

  return user;
};
