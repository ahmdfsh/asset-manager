// ============================================================
// AssetPro — Supabase Database Layer (moved to js/)
// Ganti nilai CONFIG di bawah setelah buat project di supabase.com
// ============================================================

const SUPABASE_CONFIG = {
  // Isi dengan Project URL (tanpa "/rest/v1/")
  url: 'https://hekooimwfuffjxrdwmaa.supabase.co',
  // Jangan commit kunci nyata ke repo. Ganti nilai berikut dengan
  // 'YOUR_ANON_PUBLIC_KEY' atau kosongkan lalu atur kunci secara lokal.
  anonKey: 'YOUR_ANON_PUBLIC_KEY',
};

/*
  Keamanan / saran deploy:
  - Jangan pernah commit anonKey/secret ke repo publik.
  - Untuk development lokal, Anda bisa buat file `js/config.local.js` yang
    mendefinisikan `const SUPABASE_CONFIG = { url: '...', anonKey: '...' };`
    dan load file itu sebelum `js/supabase-db.js` di `index.html`.
  - Untuk produksi, simpan kunci di server/backend atau gunakan proxy.
*/

// Inisialisasi Supabase client
const { createClient } = supabase;
const sb = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// ============================================================
// HELPER
// ============================================================
function sbErr(label, error) {
  console.error(`[Supabase] ${label}:`, error?.message || error);
  toast(`Error: ${label} — ${error?.message || 'cek konsol'}`, 'danger');
}

function fmtDate(val) {
  if (!val) return '—';
  return new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

// ============================================================
// DB — API wrapper
// ============================================================
const DB = {
  getSession()  { try { return JSON.parse(localStorage.getItem('assetpro_session')) || null; } catch { return null; } },
  setSession(u) { localStorage.setItem('assetpro_session', JSON.stringify(u)); },
  clearSession(){ localStorage.removeItem('assetpro_session'); },

  async getUsers() {
    const { data, error } = await sb.from('users').select('*').order('id');
    if (error) { sbErr('getUsers', error); return []; }
    return data;
  },

  async saveUsers(arr) {
    const { error } = await sb.from('users').upsert(arr, { onConflict: 'id' });
    if (error) sbErr('saveUsers', error);
  },

  async findUser(username, password, role) {
    const { data, error } = await sb
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .eq('role', role)
      .eq('status', 'Aktif')
      .maybeSingle();
    if (error) { sbErr('findUser', error); return null; }
    return data;
  },

  async addUser(user) {
    const { data, error } = await sb.from('users').insert(user).select().single();
    if (error) { sbErr('addUser', error); return null; }
    return data;
  },

  async deleteUser(id) {
    const { error } = await sb.from('users').delete().eq('id', id);
    if (error) { sbErr('deleteUser', error); }
  },

  async getAssets(filters = {}) {
    let q = sb.from('assets').select('*').order('created_at', { ascending: false });
    if (filters.search) {
      q = q.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%,serial_number.ilike.%${filters.search}%`);
    }
    if (filters.category) q = q.ilike('category', `%${filters.category.split(' ')[0]}%`);
    if (filters.status)   q = q.eq('status', filters.status);
    const { data, error } = await q;
    if (error) { sbErr('getAssets', error); return []; }
    return data.map(a => ({
      ...a,
      c: a.code, n: a.name, cat: a.category,
      loc: a.location, u: a.pic || '—', s: a.status,
      v: a.book_value || 'Rp 0', sn: a.serial_number || '—',
    }));
  },

  async addAsset(asset) {
    const row = {
      code: asset.c || asset.code,
      name: asset.n || asset.name,
      category: asset.cat || asset.category,
      location: asset.loc || asset.location,
      pic: asset.u || asset.pic || '—',
      status: asset.s || asset.status || 'Aktif',
      book_value: asset.v || asset.book_value || 'Rp 0',
      serial_number: asset.sn || asset.serial_number || '',
    };
    const { data, error } = await sb.from('assets').insert(row).select().single();
    if (error) { sbErr('addAsset', error); return null; }
    return data;
  },

  async updateAsset(code, updates) {
    const { error } = await sb.from('assets').update(updates).eq('code', code);
    if (error) sbErr('updateAsset', error);
  },

  async getWO() {
    const { data, error } = await sb
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { sbErr('getWO', error); return []; }
    return data.map(w => ({
      ...w,
      id: w.wo_number,
      aset: w.asset_name,
      jenis: w.wo_type,
      prio: w.priority,
      teknisi: w.technician || '—',
      est: fmtDate(w.due_date),
      catatan: w.notes || '',
    }));
  },

  async addWO(wo) {
    const row = {
      wo_number: wo.id,
      asset_name: wo.aset,
      wo_type: wo.jenis,
      priority: wo.prio,
      technician: wo.teknisi,
      due_date: wo.due_date || null,
      status: wo.status || 'Terbuka',
      description: wo.catatan || '',
      notes: wo.catatan || '',
    };
    const { data, error } = await sb.from('work_orders').insert(row).select().single();
    if (error) { sbErr('addWO', error); return null; }
    return data;
  },

  async updateWO(woNumber, updates) {
    const row = {};
    if (updates.teknisi !== undefined) row.technician = updates.teknisi;
    if (updates.prio    !== undefined) row.priority   = updates.prio;
    if (updates.status  !== undefined) row.status     = updates.status;
    if (updates.catatan !== undefined) row.notes      = updates.catatan;
    if (updates.due_date !== undefined) row.due_date  = updates.due_date;
    if (updates.status === 'Selesai')   row.completed_at = new Date().toISOString();
    const { error } = await sb.from('work_orders').update(row).eq('wo_number', woNumber);
    if (error) { sbErr('updateWO', error); return false; }
    return true;
  },

  async getNextWONumber() {
    const { data, error } = await sb
      .from('work_orders')
      .select('wo_number')
      .order('wo_number', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return 'WO-0001';
    const last = parseInt(data.wo_number.replace('WO-', '')) || 0;
    return 'WO-' + String(last + 1).padStart(4, '0');
  },

  async getComponents() {
    const { data, error } = await sb.from('components').select('*').order('code');
    if (error) { sbErr('getComponents', error); return []; }
    return data;
  },

  async addComponent(comp) {
    const { data, error } = await sb.from('components').insert(comp).select().single();
    if (error) { sbErr('addComponent', error); return null; }
    return data;
  },

  async updateComponentStock(id, newStock) {
    const { error } = await sb.from('components').update({ stock: newStock }).eq('id', id);
    if (error) sbErr('updateStock', error);
  },

  async getTransfers() {
    const { data, error } = await sb
      .from('transfers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { sbErr('getTransfers', error); return []; }
    return data;
  },

  async addTransfer(transfer) {
    const { data, error } = await sb.from('transfers').insert(transfer).select().single();
    if (error) { sbErr('addTransfer', error); return null; }
    return data;
  },

  async updateTransferStatus(id, status) {
    const { error } = await sb.from('transfers').update({ status }).eq('id', id);
    if (error) sbErr('updateTransfer', error);
  },

  async getPO() {
    const { data, error } = await sb
      .from('purchase_orders')
      .select('*, po_items(*)')
      .order('created_at', { ascending: false });
    if (error) { sbErr('getPO', error); return []; }
    return data;
  },

  async addPO(po, items) {
    const { data, error } = await sb.from('purchase_orders').insert(po).select().single();
    if (error) { sbErr('addPO', error); return null; }
    if (items?.length) {
      const rows = items.map(i => ({ ...i, po_id: data.id }));
      await sb.from('po_items').insert(rows);
    }
    return data;
  },

  async updatePOStatus(id, status) {
    const { error } = await sb.from('purchase_orders').update({ status }).eq('id', id);
    if (error) sbErr('updatePO', error);
  },

  async log(tableName, recordId, action, oldData, newData, userId) {
    await sb.from('audit_log').insert({
      table_name: tableName,
      record_id: recordId,
      action,
      old_data: oldData || null,
      new_data: newData || null,
      performed_by: userId || null,
    });
  },
};
