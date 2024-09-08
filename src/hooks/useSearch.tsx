import { useDashboardStore } from "@/stores/dashboard";
import { useEffect, useState } from "react";

const useSearch = (searchTerm: string) => {
  const { filteredMenu } = useDashboardStore();

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      // flat menu and if result have menu or subMenu then push it to the array
      const flatMenu: any[] = [];
      const flat = (menu: any) => {
        if (menu.menu) {
          menu.menu.forEach((subMenu: any) => {
            flat(subMenu);
          });
        } else {
          flatMenu.push(menu);
        }
      };

      filteredMenu.forEach((menu: any) => {
        flat(menu);
      });

      const results = flatMenu.filter((menu) => {
        return menu.title.toLowerCase().includes(searchTerm.toLowerCase());
      });

      setData(results);
    } else {
      setData([]);
    }
  }, [searchTerm]);

  return { data };
};

export default useSearch;
