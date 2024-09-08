import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import { useGoogleLogin } from "@react-oauth/google";
import $fetch from "@/utils/api";

export const googleClientId = process.env
  .NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

export const useGoogleAuth = () => {
  const { setIsFetched, fetchProfile } = useDashboardStore();
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      const { data, error } = await $fetch({
        url: "/api/auth/login/google",
        method: "POST",
        body: { token: access_token },
      });

      if (data && !error) {
        setIsFetched(false);

        // Fetch the profile after successful login
        await fetchProfile();

        router.push("/user");
      }
    },
    onError: (errorResponse) => {
      console.error("Google login failed", errorResponse);
    },
  });

  return {
    handleGoogleLogin,
  };
};
