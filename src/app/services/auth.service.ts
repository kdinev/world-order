import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { AuthUser } from '../models/auth.model';

const SESSION_KEY = 'wo_auth_session';

/** Decodes a JWT payload (no signature verification — client-side only). */
function decodeJwtPayload<T>(token: string): T {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64)) as T;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _user = signal<AuthUser | null>(null);
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = this.loadSession();
      if (saved) this._user.set(saved);
    }
  }

  private loadSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private persist(user: AuthUser | null): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  signInWithCredential(user: AuthUser): void {
    this._user.set(user);
    this.persist(user);
  }

  /**
   * Handles a Google Identity Services credential response.
   * Decodes the JWT ID token to extract user profile information.
   */
  handleGoogleCredential(credentialResponse: { credential: string }): void {
    const payload = decodeJwtPayload<{
      sub: string;
      name: string;
      email: string;
      picture: string;
    }>(credentialResponse.credential);

    this.signInWithCredential({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      avatar: payload.picture,
      provider: 'google',
    });
  }

  /**
   * Looks up a GitHub user's public profile by username.
   * No OAuth needed — uses the public GitHub REST API.
   */
  async signInWithGitHub(username: string): Promise<void> {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username.trim())}`,
    );
    if (!res.ok) throw new Error('GitHub user not found');
    const data = (await res.json()) as {
      id: number;
      login: string;
      name: string | null;
      avatar_url: string;
    };
    this.signInWithCredential({
      id: `gh_${data.id}`,
      name: data.name ?? data.login,
      avatar: data.avatar_url,
      provider: 'github',
    });
  }

  signInAsGuest(name: string): void {
    this.signInWithCredential({
      id: `guest_${Date.now()}`,
      name: name.trim(),
      provider: 'guest',
    });
  }

  signOut(): void {
    this._user.set(null);
    this.persist(null);
  }
}
