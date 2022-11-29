import { createEffect, createSignal, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { A } from "solid-start";

type ColorMode = "light" | "dark" | "system";

export const [colorMode, setColorMode] = createSignal<ColorMode>("system");

export const setTheme = (theme: ColorMode) => {
  if (
    !isServer &&
    (theme === "dark" || theme === "light" || theme === "system")
  ) {
    const body = document.documentElement;
    const systemThemeIsDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    localStorage.setItem("theme", theme);

    const actualTheme: "light" | "dark" =
      theme === "system" ? (systemThemeIsDark ? "dark" : "light") : theme;

    if (actualTheme === "dark") {
      body.classList.add(actualTheme);
    }

    if (actualTheme === "light" && body.classList.contains("dark")) {
      body.classList.remove("dark");
    }

    console.log({
      body: body.classList,
      actualTheme,
      theme,
      storageTheme: localStorage.getItem("theme"),
    });
  }
};

export const initColorMode = () => {
  if (!isServer) {
    const theme = localStorage.getItem("theme");
    if (
      theme &&
      (theme === "dark" || theme === "light" || theme === "system")
    ) {
      setTheme(theme);
    } else {
      console.log(localStorage.getItem("theme"));
      setTheme("system");
    }
  }
};

const SunIcon = () => (
  <div
    class="i-line-md:sun-rising-loop text-gsb-icon-default text-2xl"
    onClick={() => setColorMode("light")}
    onKeyPress={() => setColorMode("light")}
  />
);
const MoonIcon = () => (
  <div
    class="i-line-md:moon-twotone text-gsb-icon-default"
    onClick={() => setColorMode("dark")}
    onKeyPress={() => setColorMode("dark")}
  />
);

const Header = () => {
  initColorMode();
  createEffect(() => {
    console.log("Set theme to", colorMode());
    setTheme(colorMode());
  });
  return (
    <header class="sticky top-0 left-0 right-0 z-10 h-12 px-2 w-100% bg-gsb-background">
      <div class="h-100% w-100% ml-0">
        <div class="flex flex-row items-center h-100% justify-between">
          <div class="flex flex-row items-center gap-4">
            <img
              src="/images/nebula/nebula-64.webp"
              width="40"
              height="40"
              alt="Nebula logo"
              class="brand-logo"
            />
            <A href="/" class="decoration-none">
              <span class="text-white text-3xl font-bold">Nebula</span>
            </A>
          </div>
          <div class="flex flex-row items-center gap-2 pr-4">
            <button
              class="rd-0.375rem text-lg w-8 p-0 ps-4 pe-4 h-8 text-white border-darkblue-500 relative inline-flex justify-center items-center gap-2 border-1px border-solid text-lg decoration-none whitespace-nowrap shadow-2xl"
              aria-label="Toggle color mode"
              type="button"
            >
              <Show
                when={
                  colorMode() === "dark" ||
                  (colorMode() === "system" &&
                    !isServer &&
                    window.matchMedia?.("(prefers-color-scheme: dark)").matches)
                }
                fallback={<MoonIcon />}
              >
                <SunIcon />
              </Show>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
