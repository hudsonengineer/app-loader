import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TopNavbarComponent,
    BottomNavbarComponent,
    NavMenuComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private observer = inject(BreakpointObserver);
  isMobile = signal(false);

  constructor() {
    this.observer.observe([Breakpoints.Handset])
      .subscribe(({ matches }) => this.isMobile.set(matches));
  }
}