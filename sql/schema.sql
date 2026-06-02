-- ============================================================
-- AssetPro — Supabase Schema (moved to sql/)
-- Jalankan seluruh file ini di Supabase SQL Editor
-- ============================================================

-- ENUM TYPES
CREATE TYPE asset_status AS ENUM ('Aktif', 'Dalam Servis', 'Tidak Aktif', 'Disposal');
CREATE TYPE wo_status    AS ENUM ('Terbuka', 'Dalam Proses', 'Selesai', 'Overdue', 'Dibatalkan');
CREATE TYPE wo_priority  AS ENUM ('Kritis', 'Tinggi', 'Sedang', 'Rendah');
CREATE TYPE wo_type      AS ENUM ('Korektif', 'Preventive', 'Upgrade', 'Inspeksi');
CREATE TYPE user_role    AS ENUM ('admin', 'manager', 'teknisi');
CREATE TYPE po_status    AS ENUM ('Menunggu Approval', 'Disetujui', 'Dikirim', 'Diterima', 'Dibatalkan');
CREATE TYPE transfer_status AS ENUM ('Menunggu', 'Dikirim', 'Selesai', 'Dibatalkan');

-- ============================================================
-- TABEL USERS
-- ============================================================
CREATE TABLE users (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  username    TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  role        user_role NOT NULL DEFAULT 'teknisi',
  dept        TEXT,
  status      TEXT NOT NULL DEFAULT 'Aktif',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABEL ASSETS
-- ============================================================
CREATE TABLE assets (
  id            BIGSERIAL PRIMARY KEY,
  code          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  location      TEXT NOT NULL,
  pic           TEXT,
  status        asset_status NOT NULL DEFAULT 'Aktif',
  book_value    TEXT,
  serial_number TEXT,
  brand_model   TEXT,
  specs         TEXT,
  purchase_date DATE,
  vendor        TEXT,
  warranty_years INT DEFAULT 1,
  start_date    DATE,
  purchase_price BIGINT DEFAULT 0,
  residual_value BIGINT DEFAULT 0,
  economic_life  INT DEFAULT 5,
  depreciation_method TEXT DEFAULT 'Garis Lurus',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABEL WORK ORDERS
-- ============================================================
CREATE TABLE work_orders (
  id            BIGSERIAL PRIMARY KEY,
  wo_number     TEXT NOT NULL UNIQUE,
  asset_id      BIGINT REFERENCES assets(id) ON DELETE SET NULL,
  asset_name    TEXT NOT NULL,
  wo_type       wo_type NOT NULL DEFAULT 'Korektif',
  description   TEXT,
  priority      wo_priority NOT NULL DEFAULT 'Sedang',
  technician    TEXT,
  start_date    DATE,
  due_date      DATE,
  parts_needed  TEXT,
  status        wo_status NOT NULL DEFAULT 'Terbuka',
  notes         TEXT,
  completed_at  TIMESTAMPTZ,
  created_by    BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABEL COMPONENTS / STOCK
-- ============================================================
CREATE TABLE components (
  id          BIGSERIAL PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  category    TEXT,
  rack        TEXT,
  stock       INT NOT NULL DEFAULT 0,
  min_stock   INT NOT NULL DEFAULT 1,
  condition   TEXT DEFAULT 'Baru',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABEL TRANSFER ASET
-- ============================================================
CREATE TABLE transfers (
  id              BIGSERIAL PRIMARY KEY,
  transfer_number TEXT NOT NULL UNIQUE,
  asset_id        BIGINT REFERENCES assets(id) ON DELETE SET NULL,
  asset_name      TEXT NOT NULL,
  from_location   TEXT NOT NULL,
  to_location     TEXT NOT NULL,
  from_pic        TEXT,
  to_pic          TEXT,
  transfer_date   DATE,
  approved_by     TEXT,
  asset_condition TEXT DEFAULT 'Baik',
  notes           TEXT,
  status          transfer_status NOT NULL DEFAULT 'Menunggu',
  created_by      BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABEL PURCHASE ORDERS
-- ============================================================
CREATE TABLE purchase_orders (
  id          BIGSERIAL PRIMARY KEY,
  po_number   TEXT NOT NULL UNIQUE,
  vendor      TEXT NOT NULL,
  po_date     DATE,
  total_value BIGINT DEFAULT 0,
  notes       TEXT,
  status      po_status NOT NULL DEFAULT 'Menunggu Approval',
  created_by  BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE po_items (
  id          BIGSERIAL PRIMARY KEY,
  po_id       BIGINT REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_name   TEXT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  unit_price  BIGINT DEFAULT 0
);

-- ============================================================
-- TABEL AUDIT LOG
-- ============================================================
CREATE TABLE audit_log (
  id          BIGSERIAL PRIMARY KEY,
  table_name  TEXT NOT NULL,
  record_id   BIGINT,
  action      TEXT NOT NULL,
  old_data    JSONB,
  new_data    JSONB,
  performed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIGGER: auto update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_wo_updated_at
  BEFORE UPDATE ON work_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_po_updated_at
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SEED DATA — Data awal / demo
-- ============================================================
INSERT INTO users (name, username, password, role, dept, status) VALUES
  ('Admin Dian',    'admin',    'admin123', 'admin',    'IT',          'Aktif'),
  ('Sari Manager',  'manager',  'mgr123',   'manager',  'Operasional', 'Aktif'),
  ('Budi Raharjo',  'teknisi',  'tek123',   'teknisi',  'Maintenance', 'Aktif'),
  ('Andi Susanto',  'andi',     'andi123',  'teknisi',  'Maintenance', 'Aktif'),
  ('Candra Wijaya', 'candra',   'candra123','teknisi',  'Maintenance', 'Aktif');

INSERT INTO assets (code, name, category, location, pic, status, book_value, serial_number) VALUES
  ('AST-001', 'PC Desktop Asus',      'IT & Elektronik',    'Gedung A - Lt.1', 'Andi S.',  'Aktif',       'Rp 8,5jt',  'SN-ASUS-001'),
  ('AST-002', 'Laptop Dell XPS 15',   'IT & Elektronik',    'Gedung A - Lt.2', 'Sari M.',  'Aktif',       'Rp 14jt',   'SN-DELL-015'),
  ('AST-003', 'AC Daikin 2PK',        'Furnitur',           'Gedung A - Lt.1', '—',        'Dalam Servis','Rp 9jt',    'SN-DAI-003'),
  ('AST-004', 'Forklift Crown FC',    'Kendaraan',          'Gudang',          'Budi R.',  'Aktif',       'Rp 112jt',  'SN-CRW-004'),
  ('AST-005', 'Mesin CNC-01',         'Mesin & Peralatan',  'Workshop',        'Candra W.','Dalam Servis','Rp 960jt',  'SN-CNC-001'),
  ('AST-006', 'Server HP ProLiant',   'IT & Elektronik',    'Gedung A - Lt.2', 'IT Team',  'Aktif',       'Rp 27jt',   'SN-HP-006'),
  ('AST-007', 'Generator Set 50kVA',  'Mesin & Peralatan',  'Lapangan',        '—',        'Aktif',       'Rp 180jt',  'SN-GEN-007'),
  ('AST-008', 'Toyota Hiace',         'Kendaraan',          'Lapangan',        'Driver',   'Aktif',       'Rp 320jt',  'SN-TOY-008'),
  ('AST-009', 'Printer HP LaserJet',  'IT & Elektronik',    'Gedung A - Lt.1', 'HRD',      'Aktif',       'Rp 3,2jt',  'SN-HPP-009'),
  ('AST-010', 'UPS APC 2000VA',       'IT & Elektronik',    'Gedung A - Lt.2', 'IT Team',  'Tidak Aktif', 'Rp 4,5jt',  'SN-APC-010');

INSERT INTO work_orders (wo_number, asset_name, wo_type, priority, technician, due_date, status, description) VALUES
  ('WO-0089', 'AC Ruang 3',      'Korektif',  'Tinggi', 'Andi S.',   '2026-05-27', 'Dalam Proses', 'AC tidak dingin'),
  ('WO-0088', 'Forklift #2',     'Korektif',  'Kritis', 'Budi R.',   '2026-05-25', 'Overdue',      'Mesin tidak menyala'),
  ('WO-0087', 'Generator Set A', 'Preventive','Sedang', 'Candra W.', '2026-05-30', 'Terbuka',      'Ganti oli & filter'),
  ('WO-0086', 'PC-045',          'Upgrade',   'Rendah', 'Andi S.',   '2026-05-28', 'Dalam Proses', 'Upgrade SSD'),
  ('WO-0085', 'Mesin CNC-01',    'Korektif',  'Tinggi', 'Budi R.',   '2026-05-24', 'Overdue',      'Kalibrasi gagal');

INSERT INTO components (code, name, category, rack, stock, min_stock, condition) VALUES
  ('CMP-001', 'RAM DDR4 16GB',       'IT',       'A-3', 23, 5,  'Baru'),
  ('CMP-002', 'SSD Samsung 512GB',   'IT',       'A-3', 8,  3,  'Baru'),
  ('CMP-003', 'Filter AC Daikin',    'AC',       'B-1', 2,  5,  'Baru'),
  ('CMP-004', 'Oli SAE 10W-40',      'Kendaraan','C-2', 4,  10, 'Baru'),
  ('CMP-005', 'Ban Forklift 7.00-12','Kendaraan','D-1', 6,  2,  'Bekas Baik'),
  ('CMP-006', 'V-Belt A-78',         'Mesin',    'B-3', 1,  5,  'Baru');
