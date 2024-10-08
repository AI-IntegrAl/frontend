import { notify } from "./notify";

export const handleCopy = (code) => {
  navigator.clipboard.writeText(code);
  notify("Code copied to clipboard", "success");
};
