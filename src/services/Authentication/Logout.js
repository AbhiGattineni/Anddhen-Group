import { getAuth, signOut } from "firebase/auth";

export const logout = () => {
  const auth = getAuth();
  localStorage.clear()
  return signOut(auth);
};
