import { signInWithGoogle } from "../../../services/Authentication/firebase";

export const handleGoogleSignIn = (navigate) => {
  signInWithGoogle()
    .then(() => {
      const preLoginPath = sessionStorage.getItem("preLoginPath") || "/";
      navigate(preLoginPath);
      sessionStorage.removeItem("preLoginPath");
    })
    .catch((error) => {
      console.error("Error during sign in with Google: ", error);
    });
};

export const handleFormSubmit = async (formData) => {
  // try {
  //   // Perform login logic here with formData
  //   // ...
  //   setToast({ show: true, message: "Login successfully" });
  //   setTimeout(() => setToast({ show: false, message: "" }), 3000);
  //   // navigate to another page if needed
  // } catch (error) {
  //   setToast({ show: true, message: "Something went wrong!" });
  //   setTimeout(() => setToast({ show: false, message: "" }), 3000);
  //   console.error("Error:", error);
  // }
};
