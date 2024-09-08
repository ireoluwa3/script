import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { useDashboardStore } from "@/stores/dashboard";
import { userMenu } from "@/data/constants/menu";

export const useLogout = () => {
  const router = useRouter();
  const { setProfile, setIsFetched, setFilteredMenu, filterMenu } =
    useDashboardStore();

  return async () => {
    const { error } = await $fetch({
      url: "/api/auth/logout",
      method: "POST",
    });

    if (!error) {
      setProfile(null);
      setIsFetched(false); // Reset the isFetched state
      const newFilteredMenu = filterMenu(userMenu);
      setFilteredMenu(newFilteredMenu);
      router.push("/");
    }
  };
};
