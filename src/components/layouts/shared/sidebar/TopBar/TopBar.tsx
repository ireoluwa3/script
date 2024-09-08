import { TopBarProps } from "./TopBar.types";
const TopBarBase = ({
  float = false,
  sidebarOpened,
  isSidebarOpenedMobile,
  setIsSidebarOpenedMobile,
  setSidebarOpened,
}: TopBarProps) => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Bicrypto";
  return (
    <ul>
      <li
        className={`flex min-h-[52px] items-center justify-end border-b border-muted-200 px-4 dark:border-muted-800`}
      >
        <h2
          className={`me-auto font-sans text-base font-light uppercase leading-${
            float ? "[2]" : "normal"
          } tracking-${
            float ? "[3px]" : "widest"
          } text-muted-800 dark:text-muted-100`}
        >
          {siteName}
        </h2>
        <a
          className={`opacity-1 relative flex h-10 w-10 cursor-pointer items-center justify-center p-0 text-center text-xl leading-${
            float ? "[38.4px]" : "tight"
          } text-muted-400 transition-opacity duration-${
            float ? "[400ms]" : "300"
          }`}
          onClick={() => {
            setIsSidebarOpenedMobile(false);
            setSidebarOpened(false);
          }}
        >
          <span
            className={`relative block h-[17.6px] w-[24px] ${
              sidebarOpened || isSidebarOpenedMobile ? "active" : ""
            }`}
          >
            <span
              className={`${float ? "" : "rotate"} block h-[17.6px] w-[24px]`}
            >
              <i
                className={`absolute block h-0.5 w-5 bg-muted-400 transition-all duration-200 ease-in-out ${
                  sidebarOpened || isSidebarOpenedMobile
                    ? "start-1/2 top-3 -ms-2.5 -mt-0.5 rotate-45"
                    : "top=[5.4px] ms-2.5"
                } `}
              ></i>
              <i
                className={`absolute top-[9.2px] -ms-2.5 -mt-px block bg-muted-400 transition-all duration-200 ease-in-out ${
                  sidebarOpened || isSidebarOpenedMobile
                    ? "invisible start-[70%] h-[2.4px] w-px"
                    : "start-1/2 h-px w-5"
                } `}
              ></i>
              <i
                className={`absolute start-1/2 block h-0.5 w-5 bg-muted-400 transition-all duration-200 ease-in-out ${
                  sidebarOpened || isSidebarOpenedMobile
                    ? "top-3 -ms-2.5 -mt-0.5 rotate-[135deg]"
                    : "top-3.5 ms-2.5 mt-0.5 "
                }`}
              ></i>
            </span>
          </span>
        </a>
      </li>
    </ul>
  );
};
export const TopBar = TopBarBase;
