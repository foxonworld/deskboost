let googleInitPromise;

export const signInWithNativeGoogle = async () => {
  const webClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID_MOBILE || import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!webClientId) {
    throw new Error("Missing VITE_GOOGLE_CLIENT_ID for native Google login.");
  }

  const { SocialLogin } = await import("@capgo/capacitor-social-login");

  googleInitPromise ||= SocialLogin.initialize({
    google: { webClientId },
  });

  await googleInitPromise;

  const response = await SocialLogin.login({
    provider: "google",
  });
  const idToken = response?.result?.idToken;

  if (!idToken) {
    throw new Error("Google did not return an ID token.");
  }

  return idToken;
};
