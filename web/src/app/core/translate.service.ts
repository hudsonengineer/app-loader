import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private initialized = false;

  private supportedLangs = ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja'];

  constructor(private translate: TranslateService) {}

  init(): void {
    if (this.initialized) return;

    // Tenta obter do localStorage ou do navegador
    const storedLang = localStorage.getItem('lang');
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';

    // Ex: "pt-BR" → "pt"
    const normalizedLang = this.normalizeLang(storedLang || browserLang);

    this.translate.addLangs(this.supportedLangs);
    this.translate.setDefaultLang('en');
    this.setLanguage(normalizedLang);

    this.initialized = true;
  }

  setLanguage(lang: string): void {
    const fallbackLang = 'en';
    const langToUse = this.supportedLangs.includes(lang) ? lang : fallbackLang;

    this.translate.use(langToUse);
    localStorage.setItem('lang', langToUse);
  }

  getLanguage(): string {
    return this.translate.currentLang || this.translate.defaultLang || 'en';
  }

  private normalizeLang(lang: string): string {
    // Remove região: "pt-BR" → "pt", "en-US" → "en"
    const base = lang.toLowerCase().split('-')[0];
    return this.supportedLangs.includes(base) ? base : 'en';
  }
}
