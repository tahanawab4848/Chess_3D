const STORAGE_KEY = 'sanctum_wizard_profile_v1';
const ROOMS_KEY = 'sanctum_active_rooms_v1';

const DEFAULT_CHAMPIONS = [
  { name: 'Archmage Aurelius', order: 'Order of Marble', elo: 1840, wins: 62, shatters: 418 },
  { name: 'Lord Malakor', order: 'Obsidian Cabal', elo: 1765, wins: 54, shatters: 512 },
  { name: 'Seraphina Vey', order: 'Astral Sanctum', elo: 1690, wins: 48, shatters: 340 },
  { name: 'High Warden Godric', order: 'Golden Griffin', elo: 1610, wins: 41, shatters: 295 }
];

export class SanctuaryService {
  constructor() {
    this.profile = this.loadProfile();
  }

  loadProfile() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      name: 'Initiate Wizard',
      order: 'Order of Marble',
      icon: 'shield',
      elo: 1200,
      wins: 0,
      games: 0,
      shatters: 0
    };
  }

  saveProfile(updates) {
    this.profile = { ...this.profile, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    return this.profile;
  }

  recordShatter() {
    this.profile.shatters += 1;
    this.saveProfile(this.profile);
  }

  recordMatchOutcome(won) {
    const delta = won ? 24 : -16;
    this.profile.games += 1;
    if (won) this.profile.wins += 1;
    this.profile.elo = Math.max(800, this.profile.elo + delta);
    this.saveProfile(this.profile);
  }

  getLeaderboard() {
    const combined = [...DEFAULT_CHAMPIONS, this.profile];
    return combined.sort((a, b) => b.elo - a.elo);
  }

  getRooms() {
    const raw = localStorage.getItem(ROOMS_KEY);
    const customRooms = raw ? JSON.parse(raw) : [];
    const seeded = [
      { code: 'CRYPT7', host: 'Lord Malakor', order: 'Obsidian Cabal', elo: 1765 },
      { code: 'ASTRAL', host: 'Seraphina Vey', order: 'Astral Sanctum', elo: 1690 }
    ];
    return [...customRooms, ...seeded];
  }

  createRoom() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = {
      code,
      host: this.profile.name,
      order: this.profile.order,
      elo: this.profile.elo
    };
    const raw = localStorage.getItem(ROOMS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(room);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(list.slice(0, 10)));
    return room;
  }
}
