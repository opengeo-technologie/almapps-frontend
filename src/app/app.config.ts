import {
  ApplicationConfig,
  provideZoneChangeDetection,
  LOCALE_ID,
  importProvidersFrom,
  inject,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { registerLocaleData } from "@angular/common";

import { routes } from "./app.routes";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import localeFrExtra from "@angular/common/locales/extra/fr";
import localeFr from "@angular/common/locales/fr"; // import French locale
import { CurrencyFormatDirective } from "./directives/currency-format.directive";
import { AuthInterceptor } from "./auth.interceptor";

registerLocaleData(localeFr, "fr-CM", localeFrExtra);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(CurrencyFormatDirective), // ✅ make it global
    { provide: LOCALE_ID, useValue: "fr-CM" },
  ],
};
