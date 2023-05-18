import Router from "preact-router";
import { h } from "preact";
import { QueryClient, QueryClientProvider } from "react-query";
import * as bg from "@bgord/frontend";
import type { Schema, TranslationsType } from "@bgord/node";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";

import { Toasts } from "./toasts";
import { Navigation } from "./navigation";
import { Dashboard } from "./dashboard";

export type InitialDataType = {
  url: string;
  language: Schema.LanguageType;
  translations: TranslationsType;
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnMount: false } },
});

export function App(props: InitialDataType) {
  return (
    <QueryClientProvider client={queryClient}>
      <bg.TranslationsContextProvider
        value={{ translations: props.translations, language: props.language }}
      >
        <bg.ToastsContextProvider>
          <SkipNavLink as="a" />
          <Navigation />
          <SkipNavContent as="div" />

          <Router url={props.url}>
            <Dashboard path="/dashboard" />
          </Router>

          <Toasts />
        </bg.ToastsContextProvider>
      </bg.TranslationsContextProvider>
    </QueryClientProvider>
  );
}
