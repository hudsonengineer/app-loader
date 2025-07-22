import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private initialized = false;
  private isBrowser: boolean;

  private supportedLangs = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja'];

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    let lang = 'en';

    if (this.isBrowser) {
      // Tenta pegar do localStorage
      const stored = localStorage.getItem('lang');

      if (stored && this.supportedLangs.includes(this.normalizeLang(stored))) {
        lang = stored;
      } else {
        // Se não estiver armazenado, tenta via IP geolocalização
        lang = await this.getLangFromGeo();

        // fallback para navigator.language se a geolocalização falhar
        if (!lang) {
          lang = this.getLangFromNavigator();
        }
      }
    }

    const normalized = this.normalizeLang(lang);

    this.translate.addLangs(this.supportedLangs);
    this.translate.setDefaultLang('en');
    this.setLanguage(normalized);

    this.initialized = true;
  }

  setLanguage(lang: string): void {
    const fallbackLang = 'en';
    const langToUse = this.supportedLangs.includes(lang) ? lang : fallbackLang;

    this.translate.use(langToUse);

    if (this.isBrowser) {
      localStorage.setItem('lang', langToUse);
    }
  }

  getLanguage(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  private normalizeLang(lang: string): string {
    const base = lang.toLowerCase().split('-')[0];
    return this.supportedLangs.includes(base) ? base : 'en';
  }

  private getLangFromNavigator(): string {
    if (!this.isBrowser) return 'en';

    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    return this.normalizeLang(browserLang);
  }

  private async getLangFromGeo(): Promise<string> {
    if (!this.isBrowser) return 'en';

    try {
      const response = await fetch('https://ipapi.co/json');
      const data = await response.json();

      // Exemplo: data.languages = "pt-PT,en"
      const langHeader: string = data.languages || '';
      const firstLang = langHeader.split(',')[0]?.split('-')[0];

      const normalized = this.normalizeLang(firstLang);

      if (this.supportedLangs.includes(normalized)) {
        return normalized;
      }

      return 'en';
    } catch (error) {
      console.warn('[LanguageService] Falha ao detectar idioma por IP:', error);
      return '';
    }
  }
}
