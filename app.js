// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt = n => n?.toLocaleString('id-ID') ?? '0';
const fmtRp = n => 'Rp ' + fmt(n);
const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-';
const uid = () => Math.random().toString(36).slice(2,8).toUpperCase();

function badge(status) {
  const map = {
    'Aktif':'aktif','Servis':'servis','Non-Aktif':'nonaktif',
    'Selesai':'selesai','Proses Servis':'proses','Proses':'proses',
  };
  const cls = map[status] || 'warn';
  return `<span class="badge badge-${cls}">${status}</span>`;
}

function toast(msg, type='success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─── COMPUTED HELPERS ─────────────────────────────────────────────────────────
function getUserAssets(userId) {
  return {
    cpu:     AppData.assets.find(a => a.tipe==='CPU'     && a.user_id===userId),
    lcd:     AppData.assets.find(a => a.tipe==='LCD'     && a.user_id===userId),
    printer: AppData.assets.find(a => a.tipe==='Printer' && a.user_id===userId),
    ups:     AppData.assets.find(a => a.tipe==='UPS'     && a.user_id===userId),
  };
}

function getSpek(cpuKode) {
  const base = AppData.specs.find(s => s.cpu_kode === cpuKode);
  if (!base) return null;
  const s = {...base};
  // Apply latest component changes from logKomponen
  const logs = AppData.logKomponen.filter(l => l.cpu_kode === cpuKode);
  const latest = {};
  logs.forEach(l => { latest[l.jenis.toLowerCase()] = l.spek_baru; });
  if (latest.ram)       s.ram       = latest.ram;
  if (latest.ssd)       s.ssd       = latest.ssd;
  if (latest.hdd)       s.hdd       = latest.hdd;
  if (latest.vga)       s.vga       = latest.vga;
  if (latest.processor) s.processor = latest.processor;
  if (latest.psu)       s.psu       = latest.psu;
  s._updated = Object.keys(latest);
  return s;
}

function getUserServis(namaUser) {
  return AppData.logServis.filter(s => s.nama_user === namaUser);
}

function getUserKomponen(cpuKode) {
  return AppData.logKomponen.filter(k => k.cpu_kode === cpuKode);
}

function getTotalBiayaKomponen(cpuKode) {
  return getUserKomponen(cpuKode).reduce((s,k) => s + (k.biaya||0), 0);
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────
let currentPage = 'dashboard';
let currentModal = null;

document.addEventListener('DOMContentLoaded', () => {
  // Date
  document.getElementById('currentDate').textContent =
    new Date().toLocaleDateString('id-ID',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});

  // Nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  navigate('dashboard');
});

function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page===page));

  const titles = {
    dashboard:'Dashboard', users:'Data per User', assets:'Master Aset',
    specs:'Spesifikasi PC', 'log-asset':'Log Pertukaran Aset',
    'log-component':'Log Komponen', 'log-service':'Log Servis & Part',
  };
  const subs = {
    dashboard:'Ringkasan sistem manajemen aset IT',
    users:'Tampilan lengkap aset + spek per karyawan',
    assets:'Data induk semua perangkat IT',
    specs:'Spesifikasi hardware per PC — update otomatis dari log komponen',
    'log-asset':'Riwayat pertukaran dan pemindahan aset antar user',
    'log-component':'Riwayat upgrade dan penggantian komponen hardware',
    'log-service':'Riwayat servis dan perbaikan perangkat',
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;
  document.getElementById('pageSub').textContent   = subs[page]   || '';

  const content = document.getElementById('pageContent');
  content.innerHTML = '';
  content.className = 'page-content fade-in';

  const renders = {
    dashboard: renderDashboard,
    users: renderUsers,
    assets: renderAssets,
    specs: renderSpecs,
    'log-asset': renderLogAset,
    'log-component': renderLogKomponen,
    'log-service': renderLogServis,
  };
  if (renders[page]) content.innerHTML = renders[page]();
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function renderDashboard() {
  const d = AppData;
  const totalAset     = d.assets.length;
  const aktif         = d.assets.filter(a=>a.status==='Aktif').length;
  const servis        = d.assets.filter(a=>a.status==='Servis').length;
  const nonaktif      = d.assets.filter(a=>a.status==='Non-Aktif').length;
  const totalServis   = d.logServis.length;
  const prosesServis  = d.logServis.filter(s=>s.status==='Proses Servis').length;
  const totalUpgrade  = d.logKomponen.length;
  const totalBiayaK   = d.logKomponen.reduce((s,k)=>s+(k.biaya||0),0);
  const totalBiayaP   = d.logServis.reduce((s,k)=>s+(k.biaya_part||0),0);
  const totalBiayaJ   = d.logServis.reduce((s,k)=>s+(k.biaya_jasa||0),0);

  // Status per type
  const byType = (tipe,status) => d.assets.filter(a=>a.tipe===tipe&&a.status===status).length;

  // Recent activity (last 5 from all logs combined)
  const allActivity = [
    ...d.logAset.map(l=>({tgl:l.tgl, title:`Pertukaran ${l.jenis}`, sub:`${l.user_asal} → ${l.user_tujuan}`, detail:l.alasan, color:'tl-blue', icon:'⇄'})),
    ...d.logKomponen.map(l=>({tgl:l.tgl, title:`Ganti ${l.jenis}`, sub:`${l.nama_user} (${l.cpu_kode})`, detail:l.spek_baru, color:'tl-orange', icon:'⚙'})),
    ...d.logServis.map(l=>({tgl:l.tgl_masuk, title:`Servis ${l.jenis}`, sub:`${l.nama_user} — ${l.kode_aset}`, detail:l.keluhan, color:'tl-green', icon:'🔧'})),
  ].sort((a,b)=>b.tgl.localeCompare(a.tgl)).slice(0,7);

  // By division
  const divisi = [...new Set(d.users.map(u=>u.divisi))];

  return `
  <div class="kpi-grid">
    <div class="kpi-card blue">
      <div class="kpi-icon">👥</div>
      <div class="kpi-label">Total Karyawan</div>
      <div class="kpi-value">${d.users.length}</div>
      <div class="kpi-sub">${d.assets.length} aset terdaftar</div>
    </div>
    <div class="kpi-card green">
      <div class="kpi-icon">✅</div>
      <div class="kpi-label">Aset Aktif</div>
      <div class="kpi-value">${aktif}</div>
      <div class="kpi-sub">${servis} servis · ${nonaktif} non-aktif</div>
    </div>
    <div class="kpi-card orange">
      <div class="kpi-icon">🔧</div>
      <div class="kpi-label">Total Servis</div>
      <div class="kpi-value">${totalServis}</div>
      <div class="kpi-sub">${prosesServis} sedang proses</div>
    </div>
    <div class="kpi-card purple">
      <div class="kpi-icon">⚙</div>
      <div class="kpi-label">Total Upgrade</div>
      <div class="kpi-value">${totalUpgrade}</div>
      <div class="kpi-sub">${fmtRp(totalBiayaK)} biaya komponen</div>
    </div>
  </div>

  <div class="dash-grid">
    <div>
      <div class="section">
        <div class="section-header">
          <span class="section-title">Status Aset per Jenis</span>
        </div>
        <table>
          <thead><tr><th>Jenis</th><th>Aktif</th><th>Servis</th><th>Non-Aktif</th><th>Total</th></tr></thead>
          <tbody>
            ${['CPU','LCD','Printer','UPS'].map(t=>`
              <tr>
                <td><b>${t}</b></td>
                <td><span style="color:var(--green)">${byType(t,'Aktif')}</span></td>
                <td><span style="color:var(--yellow)">${byType(t,'Servis')}</span></td>
                <td><span style="color:var(--red)">${byType(t,'Non-Aktif')}</span></td>
                <td class="mono">15</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>

      <div class="section" style="margin-top:0">
        <div class="section-header">
          <span class="section-title">Ringkasan Biaya</span>
        </div>
        <div class="stat-row">
          <div class="stat-item">
            <div class="stat-label">Biaya Part Servis</div>
            <div class="stat-value accent">${fmtRp(totalBiayaP)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Biaya Jasa Servis</div>
            <div class="stat-value orange">${fmtRp(totalBiayaJ)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Biaya Upgrade</div>
            <div class="stat-value green">${fmtRp(totalBiayaK)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total Keseluruhan</div>
            <div class="stat-value">${fmtRp(totalBiayaP+totalBiayaJ+totalBiayaK)}</div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="section">
        <div class="section-header">
          <span class="section-title">Aktivitas Terbaru</span>
        </div>
        <div class="timeline">
          ${allActivity.map(a=>`
            <div class="timeline-item">
              <div class="timeline-dot ${a.color}">${a.icon}</div>
              <div class="timeline-content">
                <div class="tl-title">${a.title}</div>
                <div class="tl-meta">${a.sub} · ${fmtDate(a.tgl)}</div>
                <div class="tl-detail">${a.detail||''}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

// ─── DATA PER USER ────────────────────────────────────────────────────────────
function renderUsers() {
  return `
  <div class="filter-bar">
    <input class="search-input" placeholder="🔍 Cari nama atau divisi..." oninput="filterUsers(this.value)">
    <select class="filter-select" onchange="filterUsers(document.querySelector('.search-input').value, this.value)">
      <option value="">Semua Divisi</option>
      ${[...new Set(AppData.users.map(u=>u.divisi))].map(d=>`<option value="${d}">${d}</option>`).join('')}
    </select>
    <button class="btn-add-user" onclick="openAddUser()">＋ Tambah User</button>
  </div>
  <div id="usersTable">
    ${renderUsersTable(AppData.users)}
  </div>`;
}

function renderUsersTable(users) {
  return `
  <div class="section">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>No</th><th>Nama User</th><th>Divisi</th>
            <th>CPU</th><th>Status</th>
            <th>LCD</th><th>Status</th>
            <th>Printer</th><th>Status</th>
            <th>UPS</th><th>Status</th>
            <th>Spek Terkini</th>
            <th>Upgrade</th><th>Servis</th>
            <th>Kondisi</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((u,i) => {
            const assets = getUserAssets(u.id);
            const spek   = assets.cpu ? getSpek(assets.cpu.kode) : null;
            const komp   = assets.cpu ? getUserKomponen(assets.cpu.kode) : [];
            const srv    = getUserServis(u.nama);
            const prosesCount = srv.filter(s=>s.status==='Proses Servis').length;
            // Overall status
            const statuses = [assets.cpu?.status, assets.lcd?.status, assets.printer?.status, assets.ups?.status];
            const kondisi = statuses.includes('Non-Aktif') ? `<span class="badge badge-nonaktif">Ada Non-Aktif</span>`
              : statuses.includes('Servis') ? `<span class="badge badge-servis">Sedang Servis</span>`
              : `<span class="badge badge-aktif">Semua OK</span>`;
            return `
            <tr>
              <td class="mono">${i+1}</td>
              <td>
                <span style="font-weight:500">${u.nama}</span>
                <br><span style="font-size:11px;color:var(--text3)">${u.id}</span>
              </td>
              <td>${u.divisi}</td>
              <td><span class="code-tag">${assets.cpu?.kode||'-'}</span><br><span style="font-size:11px;color:var(--text2)">${assets.cpu?.merk||'-'}</span></td>
              <td>${badge(assets.cpu?.status||'Non-Aktif')}</td>
              <td><span class="code-tag">${assets.lcd?.kode||'-'}</span></td>
              <td>${badge(assets.lcd?.status||'Non-Aktif')}</td>
              <td><span class="code-tag">${assets.printer?.kode||'-'}</span></td>
              <td>${badge(assets.printer?.status||'Non-Aktif')}</td>
              <td><span class="code-tag">${assets.ups?.kode||'-'}</span></td>
              <td>${badge(assets.ups?.status||'Non-Aktif')}</td>
              <td style="font-size:11px;color:var(--text2);max-width:160px">
                ${spek ? `${spek.processor}<br>${spek.ram} · ${spek.ssd}` : '-'}
              </td>
              <td style="text-align:center">
                <span style="color:var(--purple);font-family:var(--font-mono);font-size:12px">${komp.length}</span>
                ${komp.length>0?`<br><span style="font-size:10px;color:var(--text3)">${fmtRp(getTotalBiayaKomponen(assets.cpu?.kode))}</span>`:''}
              </td>
              <td style="text-align:center">
                <span style="color:var(--orange);font-family:var(--font-mono);font-size:12px">${srv.length}</span>
                ${prosesCount>0?`<span class="badge badge-proses" style="margin-left:4px">${prosesCount} proses</span>`:''}
              </td>
              <td>${kondisi}</td>
              <td style="white-space:nowrap">
                <button class="btn-row-edit" onclick="openEditUser('${u.id}')" title="Edit User">✎</button>
                <button class="btn-row-del" onclick="confirmDeleteUser('${u.id}')" title="Hapus User">✕</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ─── USER CRUD ────────────────────────────────────────────────────────────────
function _divisiOptions(selected='') {
  const divisiList = [...new Set(AppData.users.map(u=>u.divisi))];
  return divisiList.map(d=>`<option value="${d}" ${d===selected?'selected':''}>${d}</option>`).join('');
}

function openAddUser() {
  openModal('Tambah User Baru', `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">ID Karyawan</label>
        <input id="fu_id" class="form-input" placeholder="EMP16">
      </div>
      <div class="form-group">
        <label class="form-label">Nama Lengkap</label>
        <input id="fu_nama" class="form-input" placeholder="Nama karyawan">
      </div>
      <div class="form-group">
        <label class="form-label">Divisi</label>
        <select id="fu_divisi" class="form-select">
          ${_divisiOptions()}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Divisi Baru (opsional)</label>
        <input id="fu_divisi_baru" class="form-input" placeholder="Atau ketik divisi baru...">
        <span class="form-hint">Kosongkan jika pakai pilihan di atas</span>
      </div>
    </div>`, () => {
    const id     = document.getElementById('fu_id').value.trim().toUpperCase();
    const nama   = document.getElementById('fu_nama').value.trim();
    const divBaru= document.getElementById('fu_divisi_baru').value.trim();
    const divisi = divBaru || document.getElementById('fu_divisi').value;
    if (!id || !nama) { toast('ID dan Nama wajib diisi', 'error'); return; }
    if (AppData.users.find(u=>u.id===id)) { toast('ID karyawan sudah ada', 'error'); return; }
    AppData.users.push({ id, nama, divisi });
    saveData();
    toast('User berhasil ditambahkan ✓');
    closeModal();
    navigate('users');
  });
}

function openEditUser(uid) {
  const u = AppData.users.find(x=>x.id===uid);
  if (!u) return;
  openModal(`Edit User: ${u.nama}`, `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">ID Karyawan</label>
        <input class="form-input" value="${u.id}" disabled style="opacity:.5">
      </div>
      <div class="form-group">
        <label class="form-label">Nama Lengkap</label>
        <input id="fu_nama" class="form-input" value="${u.nama}">
      </div>
      <div class="form-group">
        <label class="form-label">Divisi</label>
        <select id="fu_divisi" class="form-select">
          ${_divisiOptions(u.divisi)}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Divisi Baru (opsional)</label>
        <input id="fu_divisi_baru" class="form-input" placeholder="Atau ketik divisi baru...">
        <span class="form-hint">Kosongkan jika pakai pilihan di atas</span>
      </div>
    </div>`, () => {
    const nama   = document.getElementById('fu_nama').value.trim();
    const divBaru= document.getElementById('fu_divisi_baru').value.trim();
    const divisi = divBaru || document.getElementById('fu_divisi').value;
    if (!nama) { toast('Nama wajib diisi', 'error'); return; }
    // Update nama di log juga
    const oldNama = u.nama;
    u.nama   = nama;
    u.divisi = divisi;
    AppData.logAset.forEach(l => {
      if (l.user_asal===oldNama)   l.user_asal=nama;
      if (l.user_tujuan===oldNama) l.user_tujuan=nama;
    });
    AppData.logKomponen.forEach(l => { if (l.nama_user===oldNama) l.nama_user=nama; });
    AppData.logServis.forEach(l => { if (l.nama_user===oldNama) l.nama_user=nama; });
    saveData();
    toast('User diperbarui ✓');
    closeModal();
    navigate('users');
  });
}

function confirmDeleteUser(uid) {
  const u = AppData.users.find(x=>x.id===uid);
  if (!u) return;
  const hasAssets = AppData.assets.some(a=>a.user_id===uid);
  openModal(`Hapus User: ${u.nama}`, `
    <div style="padding:16px;background:rgba(255,80,80,0.07);border-radius:8px;border:1px solid rgba(255,80,80,0.2)">
      <p style="margin:0 0 8px;font-weight:600;color:var(--red,#ff5050)">⚠ Konfirmasi Hapus</p>
      <p style="margin:0;font-size:13px;color:var(--text2)">Anda akan menghapus user <b>${u.nama}</b> (${u.id}) — Divisi ${u.divisi}.</p>
      ${hasAssets ? `<p style="margin:8px 0 0;font-size:12px;color:var(--orange)">⚡ User ini masih memiliki aset. Aset akan tetap ada tapi tidak memiliki pemilik (unassigned).</p>` : ''}
    </div>`, () => {
    AppData.users = AppData.users.filter(x=>x.id!==uid);
    saveData();
    toast('User dihapus');
    closeModal();
    navigate('users');
  });
  // Ganti label tombol Simpan jadi Hapus
  setTimeout(() => {
    const btn = document.getElementById('modalSave');
    if (btn) { btn.textContent = 'Hapus'; btn.style.background = 'var(--red,#ff5050)'; }
  }, 50);
}

function filterUsers(q, div='') {
  q = (q||'').toLowerCase();
  const filtered = AppData.users.filter(u =>
    (!q || u.nama.toLowerCase().includes(q) || u.divisi.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)) &&
    (!div || u.divisi === div)
  );
  document.getElementById('usersTable').innerHTML = renderUsersTable(filtered);
}

// ─── MASTER ASET ─────────────────────────────────────────────────────────────
function renderAssets() {
  return `
  <div class="filter-bar">
    <input class="search-input" placeholder="🔍 Cari kode, merk, atau user..." oninput="filterAssets(this.value)">
    <select class="filter-select" onchange="filterAssets(document.querySelector('.search-input').value, this.value, document.querySelectorAll('.filter-select')[1].value)">
      <option value="">Semua Tipe</option>
      <option>CPU</option><option>LCD</option><option>Printer</option><option>UPS</option>
    </select>
    <select class="filter-select" onchange="filterAssets(document.querySelector('.search-input').value, document.querySelectorAll('.filter-select')[0].value, this.value)">
      <option value="">Semua Status</option>
      <option>Aktif</option><option>Servis</option><option>Non-Aktif</option>
    </select>
    <button class="btn-primary" onclick="openAddAsset()">+ Tambah Aset</button>
  </div>
  <div id="assetsTable">${renderAssetsTable(AppData.assets)}</div>`;
}

function renderAssetsTable(assets) {
  return `
  <div class="section">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Kode</th><th>Tipe</th><th>Merk / Model</th><th>User</th><th>Divisi</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          ${assets.map(a => {
            const user = AppData.users.find(u=>u.id===a.user_id);
            return `<tr>
              <td><span class="code-tag">${a.kode}</span></td>
              <td><span class="badge badge-aktif" style="background:rgba(0,212,255,0.08);color:var(--accent);border-color:rgba(0,212,255,0.2)">${a.tipe}</span></td>
              <td>${a.merk}</td>
              <td>${user?.nama||'-'}</td>
              <td style="color:var(--text3)">${user?.divisi||'-'}</td>
              <td>${badge(a.status)}</td>
              <td>
                <button class="btn-sm" onclick='openEditAsset(${JSON.stringify(a.kode)})'>Edit</button>
                <button class="btn-sm" onclick='openTransferAsset(${JSON.stringify(a.kode)})' style="margin-left:4px">Tukar</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function filterAssets(q='', tipe='', status='') {
  const filtered = AppData.assets.filter(a => {
    const user = AppData.users.find(u=>u.id===a.user_id);
    const match = !q || a.kode.toLowerCase().includes(q.toLowerCase()) ||
      a.merk.toLowerCase().includes(q.toLowerCase()) ||
      (user?.nama||'').toLowerCase().includes(q.toLowerCase());
    return match && (!tipe || a.tipe===tipe) && (!status || a.status===status);
  });
  document.getElementById('assetsTable').innerHTML = renderAssetsTable(filtered);
}

// ─── SPESIFIKASI PC ───────────────────────────────────────────────────────────
function renderSpecs() {
  return `
  <div style="padding:10px 18px 0;font-size:12px;color:var(--green);background:rgba(0,229,160,0.05);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;">
    <span>⚡</span>
    <span>Kolom <b>Processor, RAM, SSD, HDD, VGA</b> otomatis terupdate dari Log Komponen. Warna hijau = sudah pernah diganti.</span>
  </div>
  <div class="filter-bar">
    <input class="search-input" placeholder="🔍 Cari nama, kode, spek..." oninput="filterSpecs(this.value)">
  </div>
  <div id="specsTable">${renderSpecsTable(AppData.users)}</div>`;
}

function renderSpecsTable(users) {
  const autoFields = ['RAM','SSD','HDD','VGA','Processor'];
  return `
  <div class="section">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>No</th><th>User</th><th>Kode CPU</th>
            <th>Processor</th><th>RAM</th><th>SSD</th><th>HDD</th><th>VGA</th>
            <th>Motherboard</th><th>PSU</th><th>OS</th>
            <th>Tgl Update</th><th>Total Biaya</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((u,i) => {
            const cpu = AppData.assets.find(a=>a.tipe==='CPU'&&a.user_id===u.id);
            const s   = cpu ? getSpek(cpu.kode) : null;
            if (!s) return `<tr><td>${i+1}</td><td>${u.nama}</td><td colspan="11" style="color:var(--text3)">Belum ada data spesifikasi</td></tr>`;
            const logs = AppData.logKomponen.filter(l=>l.cpu_kode===cpu.kode);
            const lastLog = logs[logs.length-1];
            const updated = new Set(s._updated||[]);
            const hlClass = f => updated.has(f.toLowerCase()) ? 'style="color:var(--green);font-family:var(--font-mono);font-size:11px"' : 'style="font-size:12px"';
            const upd = updated.size>0 ? `<span style="color:var(--green);font-size:11px">${updated.size} komponen diganti<br>${fmtDate(lastLog?.tgl)}</span>` : `<span style="color:var(--text3);font-size:11px">-</span>`;
            return `<tr>
              <td class="mono">${i+1}</td>
              <td><b>${u.nama}</b><br><span style="font-size:11px;color:var(--text3)">${u.divisi}</span></td>
              <td><span class="code-tag">${cpu.kode}</span></td>
              <td ${hlClass('processor')}>${s.processor}</td>
              <td ${hlClass('ram')}>${s.ram}</td>
              <td ${hlClass('ssd')}>${s.ssd}</td>
              <td ${hlClass('hdd')}>${s.hdd}</td>
              <td ${hlClass('vga')}>${s.vga}</td>
              <td style="font-size:11px;color:var(--text2)">${s.mobo}</td>
              <td style="font-size:11px">${s.psu}</td>
              <td style="font-size:11px">${s.os}</td>
              <td>${upd}</td>
              <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--purple)">${fmtRp(getTotalBiayaKomponen(cpu.kode))}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function filterSpecs(q) {
  q = q.toLowerCase();
  const filtered = AppData.users.filter(u => {
    const cpu = AppData.assets.find(a=>a.tipe==='CPU'&&a.user_id===u.id);
    const s   = cpu ? getSpek(cpu.kode) : null;
    return !q || u.nama.toLowerCase().includes(q) ||
      (cpu?.kode||'').toLowerCase().includes(q) ||
      (s?.processor||'').toLowerCase().includes(q) ||
      (s?.ram||'').toLowerCase().includes(q);
  });
  document.getElementById('specsTable').innerHTML = renderSpecsTable(filtered);
}

// ─── LOG PERTUKARAN ASET ──────────────────────────────────────────────────────
function renderLogAset() {
  return `
  <div class="filter-bar">
    <input class="search-input" placeholder="🔍 Cari ID, user, atau kode aset...">
    <select class="filter-select">
      <option>Semua Jenis</option><option>CPU</option><option>LCD</option><option>Printer</option><option>UPS</option>
    </select>
    <button class="btn-primary" onclick="openAddLogAset()">+ Tambah Pertukaran</button>
  </div>
  <div class="section">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>No. Ref</th><th>Tanggal</th><th>Jenis</th>
            <th>Dari User</th><th>Kode Lama</th><th>Merk Asal</th><th>Kondisi</th>
            <th>Ke User</th><th>Kode Baru</th>
            <th>Alasan</th><th>Disetujui</th>
          </tr>
        </thead>
        <tbody>
          ${AppData.logAset.map(l=>`
            <tr>
              <td class="mono">${l.id}</td>
              <td>${fmtDate(l.tgl)}</td>
              <td><span class="badge badge-aktif" style="background:rgba(0,212,255,0.08);color:var(--accent);border-color:rgba(0,212,255,0.2)">${l.jenis}</span></td>
              <td>${l.user_asal}</td>
              <td><span class="code-tag">${l.kode_lama}</span></td>
              <td style="font-size:12px">${l.merk_asal}</td>
              <td>${badge(l.kondisi==='Baik'?'Aktif':l.kondisi==='Upgrade'?'Aktif':'Servis')}<span style="font-size:11px;margin-left:4px">${l.kondisi}</span></td>
              <td>${l.user_tujuan}</td>
              <td><span class="code-tag">${l.kode_baru}</span></td>
              <td style="font-size:12px;color:var(--text2)">${l.alasan}</td>
              <td style="font-size:11px;color:var(--text3)">${l.disetujui}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ─── LOG KOMPONEN ──────────────────────────────────────────────────────────────
function renderLogKomponen() {
  const total = AppData.logKomponen.reduce((s,k)=>s+(k.biaya||0),0);
  return `
  <div style="padding:10px 18px;background:rgba(167,139,250,0.06);border-bottom:1px solid var(--border);font-size:12px;color:var(--purple)">
    ⚡ Data di sini otomatis memperbarui kolom spesifikasi di halaman <b>Spesifikasi PC</b>
  </div>
  <div class="filter-bar">
    <input class="search-input" placeholder="🔍 Cari user, kode CPU, atau jenis komponen...">
    <select class="filter-select">
      <option>Semua Komponen</option>
      ${['RAM','SSD','HDD','VGA','CPU Fan','Processor','PSU','Motherboard'].map(j=>`<option>${j}</option>`).join('')}
    </select>
    <button class="btn-primary" onclick="openAddLogKomponen()">+ Catat Komponen</button>
  </div>
  <div class="section">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>No. Ref</th><th>Tanggal</th><th>User</th><th>Kode CPU</th>
            <th>Jenis</th><th>Spek Lama</th><th>Kondisi</th><th>Spek Baru</th>
            <th>Sumber</th><th>Teknisi</th><th>Biaya</th><th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          ${AppData.logKomponen.map(k=>`
            <tr>
              <td class="mono">${k.id}</td>
              <td>${fmtDate(k.tgl)}</td>
              <td>${k.nama_user}</td>
              <td><span class="code-tag">${k.cpu_kode}</span></td>
              <td><span class="badge" style="background:rgba(167,139,250,0.1);color:var(--purple);border:1px solid rgba(167,139,250,0.2)">${k.jenis}</span></td>
              <td style="font-size:11px;color:var(--text3)">${k.spek_lama}</td>
              <td style="font-size:11px">${k.kondisi_lama}</td>
              <td style="font-size:12px;color:var(--green);font-family:var(--font-mono)">${k.spek_baru}</td>
              <td style="font-size:11px">${k.sumber}</td>
              <td style="font-size:11px">${k.teknisi}</td>
              <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${k.biaya>0?'var(--orange)':'var(--text3)'}">${k.biaya>0?fmtRp(k.biaya):'Gratis'}</td>
              <td style="font-size:11px;color:var(--text2)">${k.ket||'-'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 18px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;align-items:center;gap:24px">
      <span style="font-size:12px;color:var(--text3)">Total biaya upgrade komponen:</span>
      <span style="font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--orange)">${fmtRp(total)}</span>
    </div>
  </div>`;
}

// ─── LOG SERVIS ────────────────────────────────────────────────────────────────
function renderLogServis() {
  const totPart  = AppData.logServis.reduce((s,k)=>s+(k.biaya_part||0),0);
  const totJasa  = AppData.logServis.reduce((s,k)=>s+(k.biaya_jasa||0),0);
  return `
  <div class="filter-bar">
    <input class="search-input" placeholder="🔍 Cari tiket, user, atau keluhan...">
    <select class="filter-select">
      <option>Semua Status</option><option>Selesai</option><option>Proses Servis</option>
    </select>
    <button class="btn-primary" onclick="openAddLogServis()">+ Catat Servis</button>
  </div>
  <div class="section">
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>No. Tiket</th><th>Tgl Masuk</th><th>User</th><th>Jenis</th><th>Kode Aset</th>
            <th>Keluhan</th><th>Tindakan</th><th>Part</th><th>Qty</th>
            <th>Biaya Part</th><th>Biaya Jasa</th><th>Tgl Selesai</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${AppData.logServis.map(s=>`
            <tr>
              <td class="mono">${s.id}</td>
              <td>${fmtDate(s.tgl_masuk)}</td>
              <td>${s.nama_user}</td>
              <td><span class="badge badge-aktif" style="background:rgba(255,140,66,0.08);color:var(--orange);border-color:rgba(255,140,66,0.2)">${s.jenis}</span></td>
              <td><span class="code-tag">${s.kode_aset}</span></td>
              <td style="font-size:12px;max-width:160px">${s.keluhan}</td>
              <td style="font-size:11px;color:var(--text2);max-width:160px">${s.tindakan}</td>
              <td style="font-size:11px">${s.part}</td>
              <td style="text-align:center">${s.qty}</td>
              <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--orange)">${s.biaya_part>0?fmtRp(s.biaya_part):'-'}</td>
              <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--accent)">${s.biaya_jasa>0?fmtRp(s.biaya_jasa):'-'}</td>
              <td>${s.tgl_selesai?fmtDate(s.tgl_selesai):'<span style="color:var(--yellow)">-</span>'}</td>
              <td>${badge(s.status)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:12px 18px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:28px;align-items:center">
      <span style="font-size:12px;color:var(--text3)">Total Part: <b style="color:var(--orange)">${fmtRp(totPart)}</b></span>
      <span style="font-size:12px;color:var(--text3)">Total Jasa: <b style="color:var(--accent)">${fmtRp(totJasa)}</b></span>
      <span style="font-size:12px;color:var(--text3)">Grand Total: <b style="color:var(--text);font-family:var(--font-display);font-size:16px">${fmtRp(totPart+totJasa)}</b></span>
    </div>
  </div>`;
}

// ─── MODALS ────────────────────────────────────────────────────────────────────
function openModal(title, bodyHTML, onSave) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalOverlay').classList.add('open');
  currentModal = onSave;
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  currentModal = null;
}
function saveModal() {
  if (currentModal) currentModal();
}

// Add Asset
function openAddAsset() {
  const users = AppData.users;
  openModal('Tambah Aset Baru', `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Kode Aset</label>
        <input id="f_kode" class="form-input" placeholder="CPU-16">
      </div>
      <div class="form-group">
        <label class="form-label">Tipe</label>
        <select id="f_tipe" class="form-select">
          <option>CPU</option><option>LCD</option><option>Printer</option><option>UPS</option>
        </select>
      </div>
      <div class="form-group span2">
        <label class="form-label">Merk / Model</label>
        <input id="f_merk" class="form-input" placeholder="Dell OptiPlex 7090">
      </div>
      <div class="form-group">
        <label class="form-label">User Pemilik</label>
        <select id="f_user" class="form-select">
          ${users.map(u=>`<option value="${u.id}">${u.nama} (${u.divisi})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select id="f_status" class="form-select">
          <option>Aktif</option><option>Servis</option><option>Non-Aktif</option>
        </select>
      </div>
    </div>`, () => {
      const kode   = document.getElementById('f_kode').value.trim();
      const tipe   = document.getElementById('f_tipe').value;
      const merk   = document.getElementById('f_merk').value.trim();
      const uid2   = document.getElementById('f_user').value;
      const status = document.getElementById('f_status').value;
      if (!kode || !merk) { toast('Kode dan Merk wajib diisi','error'); return; }
      if (AppData.assets.find(a=>a.kode===kode)) { toast('Kode aset sudah ada','error'); return; }
      AppData.assets.push({ kode, tipe, merk, user_id:uid2, status });
      saveData();
      toast('Aset berhasil ditambahkan ✓');
      closeModal();
      navigate('assets');
    }
  );
}

// Edit Asset
function openEditAsset(kode) {
  const a = AppData.assets.find(x=>x.kode===kode);
  const users = AppData.users;
  openModal(`Edit Aset: ${kode}`, `
    <div class="form-grid">
      <div class="form-group span2">
        <label class="form-label">Merk / Model</label>
        <input id="f_merk" class="form-input" value="${a.merk}">
      </div>
      <div class="form-group">
        <label class="form-label">User Pemilik</label>
        <select id="f_user" class="form-select">
          ${users.map(u=>`<option value="${u.id}" ${u.id===a.user_id?'selected':''}>${u.nama} (${u.divisi})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select id="f_status" class="form-select">
          ${['Aktif','Servis','Non-Aktif'].map(s=>`<option ${s===a.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>`, () => {
      a.merk    = document.getElementById('f_merk').value.trim();
      a.user_id = document.getElementById('f_user').value;
      a.status  = document.getElementById('f_status').value;
      saveData();
      toast('Aset diperbarui ✓');
      closeModal();
      navigate('assets');
    }
  );
}

// Transfer Asset
function openTransferAsset(kode) {
  const a = AppData.assets.find(x=>x.kode===kode);
  const users = AppData.users;
  const currentUser = AppData.users.find(u=>u.id===a.user_id);
  openModal(`Pertukaran Aset: ${kode}`, `
    <div style="padding:10px;background:var(--bg3);border-radius:6px;margin-bottom:14px;font-size:12px">
      <span style="color:var(--text3)">Aset saat ini:</span> <b>${a.merk}</b> (${badge(a.status)}) — milik <b>${currentUser?.nama||'-'}</b>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">User Tujuan</label>
        <select id="f_user_tujuan" class="form-select">
          ${users.filter(u=>u.id!==a.user_id).map(u=>`<option value="${u.id}">${u.nama} (${u.divisi})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Kondisi Aset</label>
        <select id="f_kondisi" class="form-select">
          <option>Baik</option><option>Perlu servis</option><option>Upgrade</option>
        </select>
      </div>
      <div class="form-group span2">
        <label class="form-label">Alasan Pertukaran</label>
        <input id="f_alasan" class="form-input" placeholder="Rotasi divisi / mutasi user / dll">
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal</label>
        <input id="f_tgl" type="date" class="form-input" value="${new Date().toISOString().slice(0,10)}">
      </div>
      <div class="form-group">
        <label class="form-label">Disetujui Oleh</label>
        <input id="f_approve" class="form-input" placeholder="Manager IT">
      </div>
    </div>`, () => {
      const userTujuanId = document.getElementById('f_user_tujuan').value;
      const userTujuan   = AppData.users.find(u=>u.id===userTujuanId);
      const kondisi      = document.getElementById('f_kondisi').value;
      const alasan       = document.getElementById('f_alasan').value.trim();
      const tgl          = document.getElementById('f_tgl').value;
      const approve      = document.getElementById('f_approve').value.trim();
      if (!alasan) { toast('Alasan wajib diisi','error'); return; }
      // Cari aset di user tujuan dengan tipe sama (untuk swap)
      const assetTujuan = AppData.assets.find(x=>x.tipe===a.tipe&&x.user_id===userTujuanId);
      // Log
      AppData.logAset.push({
        id: 'TKR-' + uid(),
        tgl, jenis: a.tipe,
        user_asal: currentUser?.nama,
        kode_lama: a.kode, merk_asal: a.merk, kondisi,
        user_tujuan: userTujuan?.nama,
        kode_baru: assetTujuan?.kode || a.kode,
        merk_tujuan: assetTujuan?.merk || '-',
        alasan, disetujui: approve || '-'
      });
      // Update kepemilikan
      a.user_id = userTujuanId;
      if (assetTujuan) assetTujuan.user_id = currentUser.id;
      saveData();
      toast('Pertukaran aset dicatat ✓');
      closeModal();
      navigate('log-asset');
    }
  );
}

// Add Log Komponen
function openAddLogKomponen() {
  const cpuAssets = AppData.assets.filter(a=>a.tipe==='CPU');
  openModal('Catat Pergantian Komponen', `
    <div style="font-size:11px;color:var(--green);padding:8px 12px;background:rgba(0,229,160,0.06);border-radius:6px;margin-bottom:14px">
      ⚡ Spesifikasi PC akan otomatis terupdate setelah disimpan
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Kode CPU</label>
        <select id="f_cpu" class="form-select">
          ${cpuAssets.map(a=>{
            const u = AppData.users.find(x=>x.id===a.user_id);
            return `<option value="${a.kode}">${a.kode} — ${u?.nama||'?'}</option>`;
          }).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Jenis Komponen</label>
        <select id="f_jenis" class="form-select">
          ${['RAM','SSD','HDD','VGA','Processor','CPU Fan','PSU','Motherboard','Keyboard','Mouse','Kabel','Lainnya'].map(j=>`<option>${j}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Spek Lama</label>
        <input id="f_spek_lama" class="form-input" placeholder="8 GB DDR4 2666">
      </div>
      <div class="form-group">
        <label class="form-label">Kondisi Lama</label>
        <input id="f_kondisi_lama" class="form-input" placeholder="Rusak / Bad sector / dll">
      </div>
      <div class="form-group span2">
        <label class="form-label">Spek Baru ★</label>
        <input id="f_spek_baru" class="form-input" placeholder="16 GB DDR4 3200">
        <span class="form-hint">★ Nilai ini akan muncul di halaman Spesifikasi PC</span>
      </div>
      <div class="form-group">
        <label class="form-label">Sumber Part</label>
        <select id="f_sumber" class="form-select">
          <option>Beli baru</option><option>Stok Gudang</option><option>Garansi</option><option>Donasi</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Teknisi</label>
        <input id="f_teknisi" class="form-input" placeholder="Nama teknisi / vendor">
      </div>
      <div class="form-group">
        <label class="form-label">Biaya (Rp)</label>
        <input id="f_biaya" type="number" class="form-input" placeholder="0">
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal</label>
        <input id="f_tgl" type="date" class="form-input" value="${new Date().toISOString().slice(0,10)}">
      </div>
      <div class="form-group span2">
        <label class="form-label">Keterangan</label>
        <textarea id="f_ket" class="form-textarea" placeholder="Keterangan tambahan..."></textarea>
      </div>
    </div>`, () => {
      const cpu_kode  = document.getElementById('f_cpu').value;
      const jenis     = document.getElementById('f_jenis').value;
      const spek_lama = document.getElementById('f_spek_lama').value.trim();
      const kond_lama = document.getElementById('f_kondisi_lama').value.trim();
      const spek_baru = document.getElementById('f_spek_baru').value.trim();
      const sumber    = document.getElementById('f_sumber').value;
      const teknisi   = document.getElementById('f_teknisi').value.trim();
      const biaya     = parseInt(document.getElementById('f_biaya').value)||0;
      const tgl       = document.getElementById('f_tgl').value;
      const ket       = document.getElementById('f_ket').value.trim();
      if (!spek_baru) { toast('Spek baru wajib diisi','error'); return; }
      const cpu = AppData.assets.find(a=>a.kode===cpu_kode);
      const user = AppData.users.find(u=>u.id===cpu?.user_id);
      AppData.logKomponen.push({
        id: 'UPG-'+uid(), tgl,
        nama_user: user?.nama||'-', cpu_kode,
        jenis, spek_lama, kondisi_lama: kond_lama, spek_baru,
        sumber, teknisi, biaya, ket
      });
      saveData();
      toast('Komponen dicatat & spesifikasi PC diperbarui ✓');
      closeModal();
      navigate('log-component');
    }
  );
}

// Add Log Aset
function openAddLogAset() {
  const users = AppData.users;
  openModal('Tambah Log Pertukaran Aset', `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Jenis Aset</label>
        <select id="f_jenis" class="form-select" onchange="updateAsetOptions()">
          <option>CPU</option><option>LCD</option><option>Printer</option><option>UPS</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Tanggal</label>
        <input id="f_tgl" type="date" class="form-input" value="${new Date().toISOString().slice(0,10)}">
      </div>
      <div class="form-group">
        <label class="form-label">User Asal</label>
        <select id="f_user_asal" class="form-select">
          ${users.map(u=>`<option value="${u.id}">${u.nama}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">User Tujuan</label>
        <select id="f_user_tujuan" class="form-select">
          ${users.map(u=>`<option value="${u.id}">${u.nama}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Kondisi</label>
        <select id="f_kondisi" class="form-select">
          <option>Baik</option><option>Perlu servis</option><option>Upgrade</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Disetujui Oleh</label>
        <input id="f_approve" class="form-input" placeholder="Manager IT">
      </div>
      <div class="form-group span2">
        <label class="form-label">Alasan</label>
        <input id="f_alasan" class="form-input" placeholder="Rotasi / mutasi / dll">
      </div>
    </div>`, () => {
      const jenis       = document.getElementById('f_jenis').value;
      const tgl         = document.getElementById('f_tgl').value;
      const asalId      = document.getElementById('f_user_asal').value;
      const tujuanId    = document.getElementById('f_user_tujuan').value;
      const kondisi     = document.getElementById('f_kondisi').value;
      const alasan      = document.getElementById('f_alasan').value.trim();
      const approve     = document.getElementById('f_approve').value.trim();
      const userAsal    = AppData.users.find(u=>u.id===asalId);
      const userTujuan  = AppData.users.find(u=>u.id===tujuanId);
      const asetAsal    = AppData.assets.find(a=>a.tipe===jenis&&a.user_id===asalId);
      const asetTujuan  = AppData.assets.find(a=>a.tipe===jenis&&a.user_id===tujuanId);
      if (!alasan) { toast('Alasan wajib diisi','error'); return; }
      AppData.logAset.push({
        id:'TKR-'+uid(), tgl, jenis,
        user_asal: userAsal?.nama, kode_lama: asetAsal?.kode||'-', merk_asal: asetAsal?.merk||'-', kondisi,
        user_tujuan: userTujuan?.nama, kode_baru: asetTujuan?.kode||'-', merk_tujuan: asetTujuan?.merk||'-',
        alasan, disetujui: approve||'-'
      });
      // swap ownership
      if (asetAsal) asetAsal.user_id = tujuanId;
      if (asetTujuan) asetTujuan.user_id = asalId;
      saveData();
      toast('Log pertukaran disimpan ✓');
      closeModal();
      navigate('log-asset');
    }
  );
}

// Add Log Servis
function openAddLogServis() {
  const users = AppData.users;
  openModal('Catat Servis / Perbaikan', `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">User</label>
        <select id="f_user" class="form-select">
          ${users.map(u=>`<option value="${u.id}">${u.nama} (${u.divisi})</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Jenis Aset</label>
        <select id="f_jenis" class="form-select">
          <option>CPU</option><option>LCD</option><option>Printer</option><option>UPS</option>
        </select>
      </div>
      <div class="form-group span2">
        <label class="form-label">Keluhan / Masalah</label>
        <input id="f_keluhan" class="form-input" placeholder="Deskripsi keluhan...">
      </div>
      <div class="form-group span2">
        <label class="form-label">Tindakan Servis</label>
        <input id="f_tindakan" class="form-input" placeholder="Ganti komponen / bersihkan / dll">
      </div>
      <div class="form-group">
        <label class="form-label">Part Ditambahkan</label>
        <input id="f_part" class="form-input" placeholder="Nama part atau -">
      </div>
      <div class="form-group">
        <label class="form-label">Qty Part</label>
        <input id="f_qty" type="number" class="form-input" value="1">
      </div>
      <div class="form-group">
        <label class="form-label">Biaya Part (Rp)</label>
        <input id="f_bpart" type="number" class="form-input" value="0">
      </div>
      <div class="form-group">
        <label class="form-label">Biaya Jasa (Rp)</label>
        <input id="f_bjasa" type="number" class="form-input" value="0">
      </div>
      <div class="form-group">
        <label class="form-label">Tgl Masuk</label>
        <input id="f_tgl" type="date" class="form-input" value="${new Date().toISOString().slice(0,10)}">
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select id="f_status" class="form-select">
          <option>Proses Servis</option><option>Selesai</option>
        </select>
      </div>
    </div>`, () => {
      const userId   = document.getElementById('f_user').value;
      const jenis    = document.getElementById('f_jenis').value;
      const keluhan  = document.getElementById('f_keluhan').value.trim();
      const tindakan = document.getElementById('f_tindakan').value.trim();
      const part     = document.getElementById('f_part').value.trim() || '-';
      const qty      = parseInt(document.getElementById('f_qty').value)||1;
      const bpart    = parseInt(document.getElementById('f_bpart').value)||0;
      const bjasa    = parseInt(document.getElementById('f_bjasa').value)||0;
      const tgl      = document.getElementById('f_tgl').value;
      const status   = document.getElementById('f_status').value;
      if (!keluhan) { toast('Keluhan wajib diisi','error'); return; }
      const user  = AppData.users.find(u=>u.id===userId);
      const aset  = AppData.assets.find(a=>a.tipe===jenis&&a.user_id===userId);
      // Update asset status
      if (aset && status==='Proses Servis') aset.status = 'Servis';
      if (aset && status==='Selesai') aset.status = 'Aktif';
      AppData.logServis.push({
        id:'SRV-'+uid(), tgl_masuk:tgl,
        nama_user: user?.nama||'-',
        jenis, kode_aset: aset?.kode||'-',
        keluhan, tindakan, part, qty,
        biaya_part: bpart, biaya_jasa: bjasa,
        tgl_selesai: status==='Selesai' ? tgl : '',
        status
      });
      saveData();
      toast('Servis dicatat ✓' + (aset && status==='Proses Servis' ? ' · Status aset → Servis' : ''));
      closeModal();
      navigate('log-service');
    }
  );
}

// ─── EXPORT ────────────────────────────────────────────────────────────────────
function exportData() {
  const blob = new Blob([JSON.stringify(AppData, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `assetit_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  toast('Data diekspor ✓');
}
