import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  afterNextRender,
  viewChild,
  ElementRef,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IgxButtonDirective, IgxRippleDirective } from 'igniteui-angular';

/**
 * Google Client ID for Google Identity Services.
 * Obtain one from: https://console.cloud.google.com/apis/credentials
 * Create an OAuth 2.0 Client ID of type "Web application" and add your
 * localhost origin (e.g. http://localhost:4200) to authorised JavaScript origins.
 */
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// Minimal type declarations for the Google Identity Services (GIS) library.
declare namespace google {
  namespace accounts {
    namespace id {
      function initialize(config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        auto_select?: boolean;
        use_fedcm_for_prompt?: boolean;
      }): void;
      function renderButton(
        element: HTMLElement,
        options: {
          theme?: string;
          size?: string;
          text?: string;
          shape?: string;
          width?: number;
          locale?: string;
        },
      ): void;
    }
  }
}

type LoginTab = 'google' | 'github' | 'guest';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IgxButtonDirective, IgxRippleDirective],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly activeTab = signal<LoginTab>('google');
  readonly githubUsername = signal('');
  readonly guestName = signal('');
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly googleAvailable = signal(false);

  readonly googleBtnRef = viewChild<ElementRef<HTMLDivElement>>('googleBtn');

  constructor() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/start']);
      return;
    }

    afterNextRender(() => {
      this.initGoogleSignIn();
    });
  }

  private initGoogleSignIn(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const w = window as unknown as { google?: typeof google };
    if (!w.google?.accounts?.id) return;
    if (GOOGLE_CLIENT_ID.startsWith('YOUR_')) return; // not configured yet

    this.googleAvailable.set(true);
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        this.auth.handleGoogleCredential(response);
        this.router.navigate(['/start']);
      },
      use_fedcm_for_prompt: true,
    });

    const el = this.googleBtnRef()?.nativeElement;
    if (el) {
      google.accounts.id.renderButton(el, {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 300,
      });
    }
  }

  setTab(tab: LoginTab): void {
    this.activeTab.set(tab);
    this.error.set(null);
    if (tab === 'google') {
      // Re-render the GIS button after tab switch
      afterNextRender(() => this.initGoogleSignIn());
    }
  }

  setGithubUsername(value: string): void {
    this.githubUsername.set(value);
    this.error.set(null);
  }

  setGuestName(value: string): void {
    this.guestName.set(value);
    this.error.set(null);
  }

  async signInWithGitHub(): Promise<void> {
    const username = this.githubUsername().trim();
    if (!username) return;
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await this.auth.signInWithGitHub(username);
      this.router.navigate(['/start']);
    } catch {
      this.error.set('GitHub user not found. Check the username and try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  signInAsGuest(): void {
    const name = this.guestName().trim();
    if (!name) return;
    this.auth.signInAsGuest(name);
    this.router.navigate(['/start']);
  }
}
