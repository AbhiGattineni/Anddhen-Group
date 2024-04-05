import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithFacebook, signInWithGitHub, signInWithEmailPassword, createUserWithEmailPassword } from "../services/Authentication/firebase";
import usePostUserData from "../hooks/usePostUserData";
import useAuthStore from 'src/services/store/globalStore';

const useUnifiedAuth = () => {
    const navigate = useNavigate();
    const { postUserData } = usePostUserData();

    const{loading,setLoading}=useAuthStore();

    const handleAuth = async (authPromise) => {
        try {
            const data = await authPromise;
            console.log("data",data.user);
            setLoading(true);
            const userData = await postUserData(data.user);
            console.log("userData", userData);
            setLoading(false);
            navigate(sessionStorage.getItem("preLoginPath") || "/");


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
