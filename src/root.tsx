// @refresh reload
import Header from "@components/Header";
import SideBar from "@components/SideBar";
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "uno.css";
import "./root.css";
export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Nebula</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link
          rel="preload"
          href="/fonts/roboto-v29-latin-regular.woff2"
          as="font"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/roboto-mono-v21-latin-regular.woff2"
          as="font"
          type="font/woff2"
        />
      </Head>
      <Body class="bg-base-default">
        <SideBar />
        <Header />
        <div class="w-100% flex flex-col items-center pt-12">
          <Suspense>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </div>
        <Scripts />
      </Body>
    </Html>
  );
}
