import { type ParentComponent } from "solid-js";
import { Title } from "solid-start";
const Home: ParentComponent = () => {
  // const res = trpc.hello.useQuery(() => ({ name: "from tRPC" }));

  return (
    <>
      <Title>EWOK - Electromagnetic Warfare Operational Knowledge</Title>
      <h1 class="text-3xl text-white">EWOK</h1>
      <main class="">
        <div>
          <p>Welcome to EWOK</p>
        </div>
      </main>
    </>
  );
};

export default Home;
