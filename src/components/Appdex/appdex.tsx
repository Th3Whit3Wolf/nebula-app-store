import { createSignal, For } from "solid-js";
import { A } from "solid-start";

const ewokImg = () => {
  return (
    // <div class="i-arcticons:audio-spectrum-analyzer h-100% w-100% dark:text-#f7f93b text-error" />
    <img src="/images/ewok/ewok-128.webp" width="128" alt="EWOK logo" />
  );
};

const Apps: Array<Nebula.AppInformation> = [
  {
    name: "EWOK",
    description: "Electronic Warfare Sandbox",
    path: "/ewok",
    image: ewokImg,
  },
];

const AppList = () => {
  const [apps, setApps] = createSignal(Apps);

  return (
    <>
      <For each={apps()}>
        {(app, i) => (
          <A
            href={app.path}
            class="flex items-center py-2 px-2 decoration-none  transition-transform hover:logo"
          >
            <article class="bg-surface-default rounded-xl shadow-xl flex flex-col bg-clip-border">
              <div class="rounded-t-lg h-180px flex justify-center  ml-a mr-a  vertical-mid">
                {app.image()}
              </div>
              <div class="p-6 rounded-b-lg">
                <h2 class="font-extrabold text-3xl text-primary">{app.name}</h2>
                <div class="app-card-txt ">
                  <p class="text-secondary text-base ">{app.description}</p>
                </div>

                {/* <div class="flex items-center justify-between ">
                  <div class="flex-col ">
                    <p class="inline-block text-lg font-bold">David Karrick</p>
                    <div class="text-sm text-primary-600 ">Today</div>
                  </div>
                </div> */}
              </div>
            </article>
          </A>
        )}
      </For>
    </>
  );
};

export default AppList;
