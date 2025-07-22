import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent implements OnInit {
  private translateService = inject(TranslateService);
  
  isDarkMode = signal(false);
  isModalOpen = signal(false);
  currentLanguage = signal('pt');

  availableLanguages: Language[] = [
    {
      code: 'pt',
      name: 'Português',
      nativeName: 'Português',
      flag: '🇵🇹'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'es',
      name: 'Español',
      nativeName: 'Español',
      flag: '🇪🇸'
    },
    {
      code: 'fr',
      name: 'Français',
      nativeName: 'Français',
      flag: '🇫🇷'
    }
  ];

  ngOnInit() {
    // Inicializar com o idioma atual do serviço de tradução
    const currentLang = this.translateService.currentLang || this.translateService.defaultLang || 'pt';
    this.currentLanguage.set(currentLang);
    
    // Inicializar tema baseado na preferência salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark-theme');
    }
  }

  toggleLanguageModal() {
    this.isModalOpen.update(v => !v);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  selectLanguage(languageCode: string) {
    this.currentLanguage.set(languageCode);
    this.translateService.use(languageCode);
    
    // Salvar preferência no localStorage
    localStorage.setItem('selectedLanguage', languageCode);
    
    // Fechar modal
    this.closeModal();
    
    // Emitir evento personalizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));
  }

  getCurrentLanguageName(): string {
    const language = this.availableLanguages.find(lang => lang.code === this.currentLanguage());
    return language?.name || 'Português';
  }

  getCurrentLanguageCode(): string {
    return this.currentLanguage().toUpperCase();
  }

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
    document.documentElement.classList.toggle('dark-theme', this.isDarkMode());
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  // Método para fechar modal ao pressionar ESC
  onEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isModalOpen()) {
      this.closeModal();
    }
  }
}
