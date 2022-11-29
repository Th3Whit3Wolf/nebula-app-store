import { createSignal } from "solid-js";
import { A } from "solid-start/router";

const SearchIcon = () => (
  <div class="i-material-symbols:search-rounded text-interactive-default hover:text-interactive-hover" />
);
const DiscoverIcon = () => <div class="i-material-symbols:star-rounded" />;
const CreateIcon = () => <div class="i-material-symbols:format-paint" />;
const WorkIcon = () => <div class="i-akar-icons:paper-airplane" />;
const PlayIcon = () => <div class="i-material-symbols:rocket-launch-rounded" />;
const DevelopIcon = () => <div class="i-ion:hammer" />;
const CategoriesIcon = () => <div class="i-material-symbols:category" />;
const UpdatesIcon = () => (
  <div class="i-material-symbols:system-update-alt-rounded" />
);

const SideBar = () => {
  const [expandSideBar, setExpandSideBar] = createSignal(false);

  return (
    <div
      class="sidebar"
      style={{
        transition: "0.2s",
        width: expandSideBar() ? "14rem" : "3rem",
      }}
      onMouseOut={() => setExpandSideBar(false)}
      onBlur={() => setExpandSideBar(false)}
      onMouseOver={() => setExpandSideBar(true)}
      onFocus={() => setExpandSideBar(true)}
    >
      <div class="text-center p-3 relative pb-10">
        <input
          type="text"
          placeholder="Search"
          style={{
            width: expandSideBar() ? "calc(100% - 1.25rem)" : "1rem",
            "caret-color": expandSideBar() ? "inherit" : "transparent",
            padding: expandSideBar()
              ? "0.5rem 0.5rem 0.5rem 4rem"
              : "0.5rem 1rem 0.5rem 0.9rem",
          }}
        />
        <div class="absolute top-0 py-4 px-1">
          <SearchIcon />
        </div>
      </div>

      <div class="sidebar-icons">
        <A href="/">
          <DiscoverIcon />
          <p class="sidebar-text">Discover</p>
        </A>

        <A href="/create">
          <CreateIcon />
          <p class="sidebar-text">Create</p>
        </A>

        <A href="/work">
          <WorkIcon />
          <p class="sidebar-text">Work</p>
        </A>

        <A href="/play">
          <PlayIcon />
          <p class="sidebar-text">Play</p>
        </A>

        <A href="/develop">
          <DevelopIcon />
          <p class="sidebar-text">Develop</p>
        </A>

        <A href="/categories">
          <CategoriesIcon />
          <p class="sidebar-text">Categories</p>
        </A>

        <A href="/updates">
          <UpdatesIcon />
          <p class="sidebar-text">Updates</p>
        </A>
      </div>
      <div class="sidebar-btm">
        <A href="/profile" class="sidebar-user-icon">
          <div
            style={{
              transform: expandSideBar() ? "scale(1.25)" : "scale(0.75)",
              transition: "0.2s",
            }}
          >
            <svg
              style={{
                "margin-left": expandSideBar()
                  ? "0.5rem"
                  : "calc(calc(-100% + 11px) / 2 )",
                transition: "0.2s",
              }}
              width="34px"
              height="34px"
              viewBox="0 0 34 34"
            >
              <circle
                // fill="#4dacff"
                fill-rule="nonzero"
                cx="17"
                cy="17"
                r="17"
              />
              <text font-size="15" font-weight="300">
                <tspan x="4.85714286" y="21.7857143">
                  DK
                </tspan>
              </text>
            </svg>
          </div>
          <div
            class="sidebar-text"
            style={{
              transition: "0.3s",
              transform: expandSideBar() ? "translateX(0)" : "translateX(250%)",
            }}
          >
            David Karrick
          </div>
        </A>
      </div>
    </div>
  );
};

export default SideBar;
