import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithFacebook, signInWithGitHub, signInWithEmailPassword, createUserWithEmailPassword } from "../services/Authentication/firebase";
import usePostUserData from "../hooks/usePostUserData";

const useUnifiedAuth = () => {
    const navigate = useNavigate();
    const { postUserData } = usePostUserData();

    const handleAuth = async (authPromise) => {
        try {
            console.log("3.handleAuth");
            const data = await authPromise;
            navigate(sessionStorage.getItem("preLoginPath") || "/");
            await postUserData(data.user);

            return null; // Indicates success
        } catch (error) {
            console.error("Authentication error: ", error);
            return { success: false, error };
        }
    };

    const onGoogleSignIn = () => handleAuth(signInWithGoogle());
    const onFacebookSignIn = () => handleAuth(signInWithFacebook());
    const onGitHubSignIn = () => handleAuth(signInWithGitHub());
    const onEmailPasswordSignIn = (email, password) => handleAuth(signInWithEmailPassword(email, password));
    const onEmailPasswordUserCreation = (email, password) => handleAuth(createUserWithEmailPassword(email, password));

    return { onGoogleSignIn, onFacebookSignIn, onGitHubSignIn, onEmailPasswordSignIn, onEmailPasswordUserCreation };
};

export default useUnifiedAuth;
