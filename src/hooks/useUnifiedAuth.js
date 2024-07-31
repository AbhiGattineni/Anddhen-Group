import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithFacebook, signInWithGitHub, signInWithEmailPassword, createUserWithEmailPassword } from "../services/Authentication/firebase";
import usePostUserData from "../hooks/usePostUserData";
import useAuthStore from 'src/services/store/globalStore';
import { useFetchData } from 'src/react-query/useFetchApis';

const useUnifiedAuth = () => {
    const navigate = useNavigate();
    const { postUserData } = usePostUserData();

    const { loading, setLoading } = useAuthStore();
    const { data = null, error } = useFetchData(
        "user",
        "/api/user_and_role_overview/"
    );

    const handleAuth = async (authPromise, first_name, last_name) => {
        try {
            const usersData = await authPromise;
            setLoading(true);
            console.log("usersData", usersData.user);
            const userData = await postUserData(usersData.user, first_name, last_name);
            // console.log("userData", userData);
            setLoading(false);
            if (userData.empty_fields.length > 0) {
                localStorage.setItem("empty_fields", userData.empty_fields);
                navigate("/profile")
            }
            else {
                navigate(localStorage.getItem("preLoginPath") || "/");
            }


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
    const onEmailPasswordUserCreation = (email, password, first_name, last_name) => handleAuth(createUserWithEmailPassword(email, password), first_name, last_name);

    return { onGoogleSignIn, onFacebookSignIn, onGitHubSignIn, onEmailPasswordSignIn, onEmailPasswordUserCreation };
};

export default useUnifiedAuth;
