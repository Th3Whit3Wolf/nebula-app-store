import { AppInformation } from "#types/apps";

const appImage = () => {
  return <div class="i-arcticons:audio-spectrum-analyzer h-100% w-100%" />;
};

const appInfo: AppInformation = {
  name: "EWOK",
  description: "Electronic Warfare Sandbox",

  //   description:
  //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  path: "/ewok",
  image: appImage,
};

export default appInfo;
