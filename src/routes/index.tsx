import { type ParentComponent } from "solid-js";
import { Title } from "solid-start";
import AppList from "~/components/Appdex/appdex";
const Home: ParentComponent = () => {
  // const res = trpc.hello.useQuery(() => ({ name: "from tRPC" }));

  return (
    <>
      <Title>Nebula</Title>
      <main class="container mx-auto px-20">
        <h2 class="text-3xl text-primary text-center pb-4">Apps</h2>
        <div class="bg-base-header rounded-xl">
          <div
            class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4  p-4"
            style="cursor: auto;"
          >
            <AppList />
          </div>
        </div>
      </main>

      {/* <div>
        <Switch
          fallback={
            <pre class="font-bold text-2xl text-gray">
              {JSON.stringify(res.data, null, 2)}
            </pre>
          }
        >
          <Match when={res.isLoading}>
            <div class="font-bold text-2xl text-gray">Loading...</div>
          </Match>
        </Switch>
      </div> */}
    </>
  );
};

export default Home;
