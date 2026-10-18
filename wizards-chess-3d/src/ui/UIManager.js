export class UIManager {
  constructor(sanctuaryService, handlers) {
    this.service = sanctuaryService;
    this.handlers = handlers;
    this.bindUI();
    this.refreshProfileHUD();
  }

  bindUI() {
    document.getElementById('btn-new-game').addEventListener('click', () => this.handlers.onNewGame());
    document.getElementById('btn-undo').addEventListener('click', () => this.handlers.onUndo());
    document.getElementById('btn-camera').addEventListener('click', () => this.handlers.onCamera());
    document.getElementById('btn-mode').addEventListener('click', () => this.handlers.onMode());
    document.getElementById('btn-audio').addEventListener('click', () => this.handlers.onAudio());

    // Modals
    document.getElementById('btn-registry').addEventListener('click', () => this.openModal('modal-registry'));
    document.getElementById('btn-hall').addEventListener('click', () => {
      this.renderRooms();
      this.openModal('modal-hall');
    });
    document.getElementById('btn-champions').addEventListener('click', () => {
      this.renderLeaderboard();
      this.openModal('modal-champions');
    });

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    // Faction Picker
    document.querySelectorAll('.faction-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.faction-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    // Save Profile
    document.getElementById('btn-save-profile').addEventListener('click', () => {
      const name = document.getElementById('input-wizard-name').value.trim() || 'Initiate Wizard';
      const selectedCard = document.querySelector('.faction-card.selected');
      this.service.saveProfile({
        name,
        order: selectedCard.dataset.order,
        icon: selectedCard.dataset.icon
      });
      this.refreshProfileHUD();
      this.closeModals();
    });

    // Create Room
    document.getElementById('btn-create-room').addEventListener('click', () => {
      const room = this.service.createRoom();
      this.handlers.onJoinRoom(room);
      this.closeModals();
    });
  }

  openModal(id) {
    document.getElementById('modal-backdrop').classList.remove('hidden');
    document.querySelectorAll('.md3-dialog').forEach(d => d.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
  }

  closeModals() {
    document.getElementById('modal-backdrop').classList.add('hidden');
  }

  refreshProfileHUD() {
    const p = this.service.profile;
    document.getElementById('w-name').textContent = p.name;
    document.getElementById('w-order').textContent = p.order;
    document.getElementById('w-elo').textContent = `${p.elo} ELO`;
    document.getElementById('w-icon').textContent = p.icon;

    document.getElementById('input-wizard-name').value = p.name;
    document.getElementById('stat-elo').textContent = p.elo;
    document.getElementById('stat-wins').textContent = p.wins;
    document.getElementById('stat-games').textContent = p.games;
    document.getElementById('stat-shatters').textContent = p.shatters;
  }

  updateStatus(status, capturedW, capturedB) {
    const isWhite = status.turn === 'w';
    document.getElementById('card-w').classList.toggle('active-turn', isWhite);
    document.getElementById('card-b').classList.toggle('active-turn', !isWhite);

    let text = isWhite ? 'WHITE MARBLE TO MOVE' : 'BLACK OBSIDIAN TO MOVE';
    if (status.isCheckmate) text = `CHECKMATE — ${isWhite ? 'OBSIDIAN' : 'MARBLE'} TRIUMPHS`;
    else if (status.inCheck) text = `CHECK — ${text}`;

    document.getElementById('status-text').textContent = text;

    const ticker = document.getElementById('move-ticker');
    if (status.history.length === 0) {
      ticker.innerHTML = `<span class="ticker-placeholder">Sanctuary Altar Ready — Select a piece to command</span>`;
    } else {
      ticker.innerHTML = status.history.slice(-8).map((m, idx) => `<span>${m}</span>`).join(' • ');
    }
  }

  renderRooms() {
    const container = document.getElementById('lobby-list');
    const rooms = this.service.getRooms();
    container.innerHTML = rooms.map(r => `
      <div class="list-row">
        <div>
          <strong>${r.host}</strong> <small>(${r.order})</small>
          <div style="font-size:0.75rem;color:#9e9b93">Code: ${r.code} • ${r.elo} ELO</div>
        </div>
        <button class="md3-btn-tonal" data-join="${r.code}">Challenge</button>
      </div>
    `).join('');

    container.querySelectorAll('[data-join]').forEach(btn => {
      btn.addEventListener('click', () => {
        const room = rooms.find(rm => rm.code === btn.dataset.join);
        this.handlers.onJoinRoom(room);
        this.closeModals();
      });
    });
  }

  renderLeaderboard() {
    const container = document.getElementById('leaderboard-list');
    const leaders = this.service.getLeaderboard();
    container.innerHTML = leaders.map((l, i) => `
      <div class="list-row">
        <div>
          <strong>#${i + 1} ${l.name}</strong>
          <div style="font-size:0.75rem;color:#9e9b93">${l.order} • ${l.shatters} Shattered</div>
        </div>
        <span class="elo-badge">${l.elo} ELO</span>
      </div>
    `).join('');
  }
}
