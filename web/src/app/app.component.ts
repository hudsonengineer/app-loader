import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AppLoaderComponent } from './shared/components/app-loader/app-loader.component';
import { LanguageService } from './core/language.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AppLoaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loadingFinished = new BehaviorSubject(false);

constructor(private http: HttpClient) {
  // simulação de dados carregados
  setTimeout(() => this.loadingFinished.next(true), 3000);
}

}
