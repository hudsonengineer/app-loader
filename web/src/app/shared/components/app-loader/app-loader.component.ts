import { Component, Input, signal, effect, OnInit } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/language.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.css'],
})
export class AppLoaderComponent implements OnInit {
  @Input() loadingFinished$?: Observable<boolean>;

  isVisible = signal(true);
  version = { number: 'v1.0.0' }; // Ajuste para v1.1.0 se necessário

  shouldShowChangelog = false;

  constructor(
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
  const currentVersion = 'v1.1.0';
  this.version.number = currentVersion;

  this.languageService.init().then(() => {
    let lastSeenVersion = null;

    if (isPlatformBrowser(this.platformId)) {
      lastSeenVersion = localStorage.getItem('lastSeenVersion');
    }


    if (lastSeenVersion !== currentVersion) {
      this.shouldShowChangelog = true;
      localStorage.setItem('lastSeenVersion', currentVersion);
    }

    if (this.loadingFinished$) {
      this.loadingFinished$.subscribe(done => {
        if (done) this.isVisible.set(false);
      });
    } else {
      setTimeout(() => this.isVisible.set(false), 3000);
    }
  });
  }
}
