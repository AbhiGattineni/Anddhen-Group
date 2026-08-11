import { useNavigate } from 'react-router-dom';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithGitHub,
  signInWithEmailPassword,
  createUserWithEmailPassword,
  completeRedirectSignIn,
} from '../services/Authentication/firebase';
import usePostUserData from '../hooks/usePostUserData';
import { postLoginPath } from '../services/roles/postLoginPath';

const useUnifiedAuth = () => {
  const navigate = useNavigate();
  const { postUserData } = usePostUserData();

  // const handleAuth = async (authPromise, first_name, last_name) => {
  //   try {
  //     const usersData = await authPromise;
  //     console.log('usersData', usersData.user);
  //     const userData = await postUserData(
  //       usersData.user,
  //       first_name,
  //       last_name
  //     );
  //     console.log('userData', userData);
  //     navigate(sessionStorage.getItem('preLoginPath') || '/');

  //     return null; // Indicates success
  //   } catch (error) {
  //     console.error('Authentication error: ', error);
  //     return { success: false, error };
  //   }
  // };

  // const onGoogleSignIn = () => handleAuth(signInWithGoogle());
  // const onFacebookSignIn = () => handleAuth(signInWithFacebook());
  // const onGitHubSignIn = () => handleAuth(signInWithGitHub());
  // const onEmailPasswordSignIn = (email, password) =>
  //   handleAuth(signInWithEmailPassword(email, password));
  // const onEmailPasswordUserCreation = (
  //   email,
  //   password,
  //   first_name,
  //   last_name
  // ) =>
  //   handleAuth(
  //     createUserWithEmailPassword(email, password),
  //     first_name,
  //     last_name
  //   );

  const finishAuth = async (usersData, first_name, last_name) => {
    // Leave the login page the moment sign-in succeeds. This used to await
    // postUserData first — a Firestore round trip — which left the form on
    // screen for a second or two after the user had already signed in, looking
    // like nothing had happened. Nothing downstream needs that write to have
    // landed: ensureUserProfile creates the profile if it's missing.
    navigate(await postLoginPath(), { replace: true });

    try {
      const userData = await postUserData(usersData.user, first_name, last_name);
      // Guard against a missing/partial payload (e.g. backend unreachable) so a
      // successful OAuth sign-in is never reported as an auth error.
      const emptyFields = userData?.empty_fields ?? [];
      localStorage.setItem('empty_fields', emptyFields);
      localStorage.setItem('roles', userData?.roles ?? []);

      // Only the Django provider reports missing fields; when it does, the
      // profile form takes over from wherever we just landed.
      if (emptyFields.length > 0) navigate('/profile', { replace: true });
    } catch (error) {
      // A failed profile write must not undo a successful sign-in.
      console.error('finishAuth: profile write failed (continuing):', error);
    }
    return null; // Indicates success
  };

  /**
   * Completes a full-page redirect sign-in (the popup-blocked fallback).
   * Call once on Login mount: resolves null when no redirect happened.
   */
  const onRedirectResult = async () => {
    try {
      const usersData = await completeRedirectSignIn();
      if (!usersData?.user) return null;
      return await finishAuth(usersData);
    } catch (error) {
      console.error('Redirect sign-in error: ', error);
      return { success: false, error };
    }
  };

  const handleAuth = async (authPromise, first_name, last_name) => {
    try {
      const usersData = await authPromise;
      return await finishAuth(usersData, first_name, last_name);
    } catch (error) {
      console.error('Authentication error: ', error);
      return { success: false, error };
    }
  };

  const onGoogleSignIn = () => handleAuth(signInWithGoogle());
  const onFacebookSignIn = () => handleAuth(signInWithFacebook());
  const onGitHubSignIn = () => handleAuth(signInWithGitHub());
  const onEmailPasswordSignIn = (email, password) =>
    handleAuth(signInWithEmailPassword(email, password));
  const onEmailPasswordUserCreation = (email, password, first_name, last_name) =>
    handleAuth(createUserWithEmailPassword(email, password), first_name, last_name);

  return {
    onRedirectResult,
    onGoogleSignIn,
    onFacebookSignIn,
    onGitHubSignIn,
    onEmailPasswordSignIn,
    onEmailPasswordUserCreation,
  };
};

export default useUnifiedAuth;
