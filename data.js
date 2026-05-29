// ─── SEED DATA (dari Manajemen_Aset_IT_v2.xlsx) ───────────────────────────
const SEED = {
  users: [
    { id:"EMP01", nama:"Andi Pratama",    divisi:"Finance"     },
    { id:"EMP02", nama:"Budi Santoso",    divisi:"Finance"     },
    { id:"EMP03", nama:"Citra Dewi",      divisi:"Finance"     },
    { id:"EMP04", nama:"Dian Lestari",    divisi:"HR"          },
    { id:"EMP05", nama:"Eko Wahyu",       divisi:"HR"          },
    { id:"EMP06", nama:"Fani Rahayu",     divisi:"HR"          },
    { id:"EMP07", nama:"Galih Saputra",   divisi:"IT"          },
    { id:"EMP08", nama:"Hendra Kusuma",   divisi:"IT"          },
    { id:"EMP09", nama:"Irma Yanti",      divisi:"IT"          },
    { id:"EMP10", nama:"Joko Susilo",     divisi:"Marketing"   },
    { id:"EMP11", nama:"Kartika Sari",    divisi:"Marketing"   },
    { id:"EMP12", nama:"Lina Marlina",    divisi:"Operasional" },
    { id:"EMP13", nama:"Maulana Rizki",   divisi:"Operasional" },
    { id:"EMP14", nama:"Ninda Putri",     divisi:"Operasional" },
    { id:"EMP15", nama:"Oki Firmansyah",  divisi:"Operasional" },
  ],
  assets: [
    { kode:"CPU-01", tipe:"CPU",     user_id:"EMP01", merk:"Lenovo ThinkCentre M720", status:"Aktif"     },
    { kode:"CPU-02", tipe:"CPU",     user_id:"EMP02", merk:"Dell OptiPlex 7080",       status:"Aktif"     },
    { kode:"CPU-03", tipe:"CPU",     user_id:"EMP03", merk:"HP ProDesk 400 G7",        status:"Aktif"     },
    { kode:"CPU-04", tipe:"CPU",     user_id:"EMP04", merk:"Asus ExpertCenter D700MC", status:"Aktif"     },
    { kode:"CPU-05", tipe:"CPU",     user_id:"EMP05", merk:"Lenovo IdeaCentre 510S",   status:"Aktif"     },
    { kode:"CPU-06", tipe:"CPU",     user_id:"EMP06", merk:"Dell OptiPlex 3090",       status:"Aktif"     },
    { kode:"CPU-07", tipe:"CPU",     user_id:"EMP07", merk:"HP ProDesk 600 G6",        status:"Aktif"     },
    { kode:"CPU-08", tipe:"CPU",     user_id:"EMP08", merk:"Lenovo ThinkCentre M920",  status:"Aktif"     },
    { kode:"CPU-09", tipe:"CPU",     user_id:"EMP09", merk:"Dell OptiPlex 5090",       status:"Aktif"     },
    { kode:"CPU-10", tipe:"CPU",     user_id:"EMP10", merk:"HP EliteDesk 800 G8",      status:"Aktif"     },
    { kode:"CPU-11", tipe:"CPU",     user_id:"EMP11", merk:"Asus ExpertCenter D500MC", status:"Servis"    },
    { kode:"CPU-12", tipe:"CPU",     user_id:"EMP12", merk:"Lenovo ThinkCentre M70s",  status:"Aktif"     },
    { kode:"CPU-13", tipe:"CPU",     user_id:"EMP13", merk:"Dell OptiPlex 7490",       status:"Aktif"     },
    { kode:"CPU-14", tipe:"CPU",     user_id:"EMP14", merk:"HP ProDesk 400 G8",        status:"Aktif"     },
    { kode:"CPU-15", tipe:"CPU",     user_id:"EMP15", merk:"Lenovo IdeaCentre 5",      status:"Non-Aktif" },
    { kode:"LCD-01", tipe:"LCD",     user_id:"EMP01", merk:"LG 24MK430H",             status:"Aktif"     },
    { kode:"LCD-02", tipe:"LCD",     user_id:"EMP02", merk:"Samsung S24F350",          status:"Aktif"     },
    { kode:"LCD-03", tipe:"LCD",     user_id:"EMP03", merk:"AOC 24B1XH",              status:"Servis"    },
    { kode:"LCD-04", tipe:"LCD",     user_id:"EMP04", merk:"Asus VA24EHE",             status:"Aktif"     },
    { kode:"LCD-05", tipe:"LCD",     user_id:"EMP05", merk:"LG 27ML600M",             status:"Aktif"     },
    { kode:"LCD-06", tipe:"LCD",     user_id:"EMP06", merk:"Dell E2421HN",             status:"Aktif"     },
    { kode:"LCD-07", tipe:"LCD",     user_id:"EMP07", merk:"Samsung S27F350",          status:"Aktif"     },
    { kode:"LCD-08", tipe:"LCD",     user_id:"EMP08", merk:"HP V27i",                  status:"Aktif"     },
    { kode:"LCD-09", tipe:"LCD",     user_id:"EMP09", merk:"AOC 27B2H",               status:"Aktif"     },
    { kode:"LCD-10", tipe:"LCD",     user_id:"EMP10", merk:"Asus VZ27EHE",             status:"Aktif"     },
    { kode:"LCD-11", tipe:"LCD",     user_id:"EMP11", merk:"LG 24MK600M",             status:"Aktif"     },
    { kode:"LCD-12", tipe:"LCD",     user_id:"EMP12", merk:"Dell P2422H",              status:"Aktif"     },
    { kode:"LCD-13", tipe:"LCD",     user_id:"EMP13", merk:"Samsung S24R350",          status:"Aktif"     },
    { kode:"LCD-14", tipe:"LCD",     user_id:"EMP14", merk:"HP P244",                  status:"Servis"    },
    { kode:"LCD-15", tipe:"LCD",     user_id:"EMP15", merk:"LG 27UL500",              status:"Aktif"     },
    { kode:"PRT-01", tipe:"Printer", user_id:"EMP01", merk:"HP LaserJet Pro M404dn",   status:"Aktif"     },
    { kode:"PRT-02", tipe:"Printer", user_id:"EMP02", merk:"Canon LBP6030",            status:"Aktif"     },
    { kode:"PRT-03", tipe:"Printer", user_id:"EMP03", merk:"Epson L3110",              status:"Aktif"     },
    { kode:"PRT-04", tipe:"Printer", user_id:"EMP04", merk:"HP DeskJet 2775",          status:"Aktif"     },
    { kode:"PRT-05", tipe:"Printer", user_id:"EMP05", merk:"Brother HL-L2321D",        status:"Aktif"     },
    { kode:"PRT-06", tipe:"Printer", user_id:"EMP06", merk:"Canon PIXMA G2010",        status:"Aktif"     },
    { kode:"PRT-07", tipe:"Printer", user_id:"EMP07", merk:"HP LaserJet M107w",        status:"Aktif"     },
    { kode:"PRT-08", tipe:"Printer", user_id:"EMP08", merk:"Epson EcoTank L5290",      status:"Servis"    },
    { kode:"PRT-09", tipe:"Printer", user_id:"EMP09", merk:"Brother MFC-L2750DW",      status:"Aktif"     },
    { kode:"PRT-10", tipe:"Printer", user_id:"EMP10", merk:"Canon MF3010",             status:"Aktif"     },
    { kode:"PRT-11", tipe:"Printer", user_id:"EMP11", merk:"HP LaserJet Pro M15w",     status:"Aktif"     },
    { kode:"PRT-12", tipe:"Printer", user_id:"EMP12", merk:"Epson L4150",              status:"Aktif"     },
    { kode:"PRT-13", tipe:"Printer", user_id:"EMP13", merk:"Canon LBP2900",            status:"Aktif"     },
    { kode:"PRT-14", tipe:"Printer", user_id:"EMP14", merk:"HP LaserJet M111a",        status:"Aktif"     },
    { kode:"PRT-15", tipe:"Printer", user_id:"EMP15", merk:"Brother DCP-L2550DW",      status:"Aktif"     },
    { kode:"UPS-01", tipe:"UPS",     user_id:"EMP01", merk:"APC BX1100LI-MS",          status:"Aktif"     },
    { kode:"UPS-02", tipe:"UPS",     user_id:"EMP02", merk:"Prolink PRO700SFC",         status:"Aktif"     },
    { kode:"UPS-03", tipe:"UPS",     user_id:"EMP03", merk:"Eaton 5E700i",              status:"Aktif"     },
    { kode:"UPS-04", tipe:"UPS",     user_id:"EMP04", merk:"APC BVK700MI",              status:"Aktif"     },
    { kode:"UPS-05", tipe:"UPS",     user_id:"EMP05", merk:"Prolink PRO1000SFC",        status:"Aktif"     },
    { kode:"UPS-06", tipe:"UPS",     user_id:"EMP06", merk:"CyberPower CP1000AVRLCD",   status:"Aktif"     },
    { kode:"UPS-07", tipe:"UPS",     user_id:"EMP07", merk:"APC BX1100CI-MS",           status:"Aktif"     },
    { kode:"UPS-08", tipe:"UPS",     user_id:"EMP08", merk:"Eaton 5S550I",              status:"Aktif"     },
    { kode:"UPS-09", tipe:"UPS",     user_id:"EMP09", merk:"Prolink PRO1500SFC",        status:"Aktif"     },
    { kode:"UPS-10", tipe:"UPS",     user_id:"EMP10", merk:"APC BVK1000MI",             status:"Aktif"     },
    { kode:"UPS-11", tipe:"UPS",     user_id:"EMP11", merk:"CyberPower CP650AVRLCD",    status:"Aktif"     },
    { kode:"UPS-12", tipe:"UPS",     user_id:"EMP12", merk:"Eaton 5E1100i",             status:"Non-Aktif" },
    { kode:"UPS-13", tipe:"UPS",     user_id:"EMP13", merk:"APC BX1500MI",              status:"Aktif"     },
    { kode:"UPS-14", tipe:"UPS",     user_id:"EMP14", merk:"Prolink PRO2000SFC",        status:"Aktif"     },
    { kode:"UPS-15", tipe:"UPS",     user_id:"EMP15", merk:"CyberPower CP1500AVRLCD",   status:"Aktif"     },
  ],
  specs: [
    { cpu_kode:"CPU-01", processor:"Intel Core i5-10400",  ram:"8 GB DDR4 3200",  ssd:"256 GB SATA", hdd:"1 TB",  vga:"Intel UHD 630",        mobo:"Lenovo OEM B460", psu:"180W OEM", os:"Windows 10 Pro" },
    { cpu_kode:"CPU-02", processor:"Intel Core i5-10500",  ram:"16 GB DDR4 2666", ssd:"512 GB NVMe", hdd:"2 TB",  vga:"Intel UHD 630",        mobo:"Dell OEM H470",   psu:"200W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-03", processor:"AMD Ryzen 5 5600G",    ram:"8 GB DDR4 3200",  ssd:"256 GB SATA", hdd:"1 TB",  vga:"AMD Radeon Vega 7",    mobo:"Asus Prime B550M",psu:"300W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-04", processor:"Intel Core i5-11400",  ram:"16 GB DDR4 3200", ssd:"512 GB NVMe", hdd:"2 TB",  vga:"Intel UHD 730",        mobo:"Asus B560M-A",    psu:"200W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-05", processor:"AMD Ryzen 3 4350G",    ram:"8 GB DDR4 2666",  ssd:"256 GB SATA", hdd:"-",     vga:"AMD Radeon RX 6400",   mobo:"Lenovo OEM A520M",psu:"180W OEM", os:"Windows 10 Pro" },
    { cpu_kode:"CPU-06", processor:"Intel Core i3-10100",  ram:"8 GB DDR4 2400",  ssd:"240 GB SATA", hdd:"1 TB",  vga:"Intel UHD 630",        mobo:"Dell OEM H410",   psu:"200W OEM", os:"Windows 10 Pro" },
    { cpu_kode:"CPU-07", processor:"Intel Core i7-10700",  ram:"16 GB DDR4 3200", ssd:"512 GB NVMe", hdd:"2 TB",  vga:"Intel UHD 630",        mobo:"HP OEM Q470",     psu:"300W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-08", processor:"Intel Core i9-10900",  ram:"32 GB DDR4 3200", ssd:"1 TB NVMe",   hdd:"4 TB",  vga:"NVIDIA RTX 3060",      mobo:"Lenovo OEM Z490", psu:"500W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-09", processor:"AMD Ryzen 7 5700G",    ram:"16 GB DDR4 3200", ssd:"512 GB NVMe", hdd:"2 TB",  vga:"AMD Radeon Vega 8",    mobo:"Dell OEM B560",   psu:"300W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-10", processor:"Intel Core i5-11500",  ram:"8 GB DDR4 3200",  ssd:"256 GB NVMe", hdd:"1 TB",  vga:"Intel UHD 750",        mobo:"HP OEM H570",     psu:"200W OEM", os:"Windows 10 Pro" },
    { cpu_kode:"CPU-11", processor:"AMD Ryzen 5 3600",     ram:"16 GB DDR4 3000", ssd:"512 GB SATA", hdd:"1 TB",  vga:"NVIDIA GTX 1650",      mobo:"Asus Prime B450M",psu:"350W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-12", processor:"Intel Core i5-10400T", ram:"8 GB DDR4 2666",  ssd:"240 GB SATA", hdd:"1 TB",  vga:"Intel UHD 630",        mobo:"Lenovo OEM H410", psu:"180W OEM", os:"Windows 10 Pro" },
    { cpu_kode:"CPU-13", processor:"Intel Core i7-11700",  ram:"32 GB DDR4 3200", ssd:"1 TB NVMe",   hdd:"4 TB",  vga:"Intel UHD 750",        mobo:"Dell OEM Z590",   psu:"300W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-14", processor:"AMD Ryzen 5 5500",     ram:"8 GB DDR4 3200",  ssd:"256 GB NVMe", hdd:"1 TB",  vga:"AMD Radeon RX 6400",   mobo:"HP OEM A520M",    psu:"200W OEM", os:"Windows 11 Pro" },
    { cpu_kode:"CPU-15", processor:"Intel Core i3-12100",  ram:"16 GB DDR4 4800", ssd:"512 GB NVMe", hdd:"2 TB",  vga:"Intel UHD 730",        mobo:"Lenovo OEM H610", psu:"300W OEM", os:"Windows 11 Pro" },
  ],
  logAset: [
    { id:"TKR-001", tgl:"2025-01-10", jenis:"CPU", user_asal:"Andi Pratama",    kode_lama:"CPU-01", merk_asal:"Lenovo ThinkCentre M720",    kondisi:"Baik",         user_tujuan:"Budi Santoso",   kode_baru:"CPU-02", merk_tujuan:"Dell OptiPlex 7080",     alasan:"Rotasi divisi",               disetujui:"Manager IT"  },
    { id:"TKR-002", tgl:"2025-01-15", jenis:"LCD", user_asal:"Citra Dewi",      kode_lama:"LCD-03", merk_asal:"AOC 24B1XH",                  kondisi:"Baik",         user_tujuan:"Eko Wahyu",      kode_baru:"LCD-05", merk_tujuan:"LG 27ML600M",            alasan:"Layar lebih besar",           disetujui:"Manager IT"  },
    { id:"TKR-003", tgl:"2025-02-03", jenis:"Printer", user_asal:"Joko Susilo", kode_lama:"PRT-10", merk_asal:"Canon MF3010",                kondisi:"Perlu servis", user_tujuan:"Lina Marlina",   kode_baru:"PRT-12", merk_tujuan:"Epson L4150",            alasan:"Unit pengganti sementara",    disetujui:"Supervisor"  },
    { id:"TKR-004", tgl:"2025-02-20", jenis:"UPS",    user_asal:"Galih Saputra",kode_lama:"UPS-07", merk_asal:"APC BX1100CI-MS",             kondisi:"Baik",         user_tujuan:"Irma Yanti",     kode_baru:"UPS-09", merk_tujuan:"Prolink PRO1500SFC",     alasan:"Penyesuaian kapasitas",       disetujui:"Manager IT"  },
    { id:"TKR-005", tgl:"2025-03-05", jenis:"CPU",    user_asal:"Maulana Rizki",kode_lama:"CPU-13", merk_asal:"Dell OptiPlex 7490",           kondisi:"Upgrade",      user_tujuan:"Ninda Putri",    kode_baru:"CPU-14", merk_tujuan:"HP ProDesk 400 G8",      alasan:"Butuh spek lebih tinggi",     disetujui:"Direktur IT" },
  ],
  logKomponen: [
    { id:"UPG-001", tgl:"2025-01-20", nama_user:"Budi Santoso",    cpu_kode:"CPU-02", jenis:"RAM",        spek_lama:"8 GB DDR4 2666",    kondisi_lama:"Masih ok",   spek_baru:"16 GB DDR4 2666",         sumber:"Beli baru",    teknisi:"Galih Saputra",  biaya:350000,  ket:"Upgrade untuk desain"        },
    { id:"UPG-002", tgl:"2025-01-25", nama_user:"Galih Saputra",   cpu_kode:"CPU-07", jenis:"SSD",        spek_lama:"512 GB NVMe",       kondisi_lama:"Bad sector", spek_baru:"1 TB NVMe",               sumber:"Beli baru",    teknisi:"Vendor IT",      biaya:850000,  ket:"Boot lama, bad sector"       },
    { id:"UPG-003", tgl:"2025-02-10", nama_user:"Kartika Sari",    cpu_kode:"CPU-11", jenis:"CPU Fan",    spek_lama:"Fan OEM",           kondisi_lama:"Berisik",    spek_baru:"Cooler Master Hyper 212", sumber:"Beli baru",    teknisi:"Hendra Kusuma", biaya:165000,  ket:"Fan berisik"                 },
    { id:"UPG-004", tgl:"2025-02-15", nama_user:"Eko Wahyu",       cpu_kode:"CPU-05", jenis:"RAM",        spek_lama:"8 GB DDR4 2666",    kondisi_lama:"Masih ok",   spek_baru:"16 GB DDR4 3200",         sumber:"Stok Gudang",  teknisi:"Galih Saputra",  biaya:0,       ket:"Dari stok gudang"            },
    { id:"UPG-005", tgl:"2025-03-01", nama_user:"Lina Marlina",    cpu_kode:"CPU-12", jenis:"HDD",        spek_lama:"1 TB HDD",          kondisi_lama:"Mati total", spek_baru:"2 TB HDD",                sumber:"Beli baru",    teknisi:"Vendor IT",      biaya:620000,  ket:"HDD failure"                 },
    { id:"UPG-006", tgl:"2025-03-10", nama_user:"Maulana Rizki",   cpu_kode:"CPU-13", jenis:"VGA",        spek_lama:"Intel UHD 750",     kondisi_lama:"Masih ok",   spek_baru:"NVIDIA GTX 1650 4GB",     sumber:"Beli baru",    teknisi:"Hendra Kusuma", biaya:1750000, ket:"Butuh VGA dedicated"         },
  ],
  logServis: [
    { id:"SRV-001", tgl_masuk:"2025-01-08", nama_user:"Citra Dewi",      jenis:"Printer", kode_aset:"PRT-03", keluhan:"Tidak bisa print, paper jam",   tindakan:"Bersihkan roller, reset printer", part:"-",                       qty:1, biaya_part:0,      biaya_jasa:0,      tgl_selesai:"2025-01-08", status:"Selesai"        },
    { id:"SRV-002", tgl_masuk:"2025-01-18", nama_user:"Andi Pratama",    jenis:"CPU",     kode_aset:"CPU-01", keluhan:"Blue screen, OS crash",          tindakan:"Reinstall Windows, update driver",part:"SSD Thermal Pad",         qty:1, biaya_part:45000,  biaya_jasa:150000, tgl_selesai:"2025-01-20", status:"Selesai"        },
    { id:"SRV-003", tgl_masuk:"2025-01-28", nama_user:"Hendra Kusuma",   jenis:"LCD",     kode_aset:"LCD-08", keluhan:"Layar bergaris horizontal",      tindakan:"Cek kabel, ganti kabel LVDS",    part:"Kabel LVDS 24\"",          qty:1, biaya_part:120000, biaya_jasa:100000, tgl_selesai:"2025-01-30", status:"Selesai"        },
    { id:"SRV-004", tgl_masuk:"2025-02-05", nama_user:"Dian Lestari",    jenis:"UPS",     kode_aset:"UPS-04", keluhan:"Bunyi alarm terus",              tindakan:"Ganti baterai",                  part:"Baterai 12V 7Ah",         qty:1, biaya_part:180000, biaya_jasa:75000,  tgl_selesai:"2025-02-05", status:"Selesai"        },
    { id:"SRV-005", tgl_masuk:"2025-02-12", nama_user:"Fani Rahayu",     jenis:"CPU",     kode_aset:"CPU-06", keluhan:"Lemot, CPU 100%",                tindakan:"Cleaning, thermal paste, defrag", part:"Thermal Paste Arctic MX-4",qty:1, biaya_part:35000,  biaya_jasa:100000, tgl_selesai:"2025-02-13", status:"Selesai"        },
    { id:"SRV-006", tgl_masuk:"2025-02-25", nama_user:"Kartika Sari",    jenis:"Printer", kode_aset:"PRT-11", keluhan:"Hasil print bergaris",           tindakan:"Ganti head print",               part:"Head Printer Canon",      qty:1, biaya_part:350000, biaya_jasa:125000, tgl_selesai:"2025-03-01", status:"Selesai"        },
    { id:"SRV-007", tgl_masuk:"2025-03-08", nama_user:"Irma Yanti",      jenis:"CPU",     kode_aset:"CPU-09", keluhan:"PC tidak bisa nyala",            tindakan:"Ganti PSU",                      part:"PSU 300W Seasonic",       qty:1, biaya_part:450000, biaya_jasa:100000, tgl_selesai:"2025-03-09", status:"Selesai"        },
    { id:"SRV-008", tgl_masuk:"2025-03-15", nama_user:"Ninda Putri",     jenis:"LCD",     kode_aset:"LCD-14", keluhan:"Backlight mati",                 tindakan:"Kirim ke service center",        part:"-",                       qty:1, biaya_part:0,      biaya_jasa:0,      tgl_selesai:"",           status:"Proses Servis"  },
  ]
};

// ─── STORAGE ENGINE ──────────────────────────────────────────────────────────
const DB = {
  _key: 'assetit_v1',
  load() {
    try {
      const raw = localStorage.getItem(this._key);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return null;
  },
  save(data) {
    localStorage.setItem(this._key, JSON.stringify(data));
  },
  init() {
    const existing = this.load();
    if (existing) return existing;
    this.save(SEED);
    return JSON.parse(JSON.stringify(SEED));
  }
};

let AppData = DB.init();

function saveData() {
  DB.save(AppData);
}
