import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'indotech.db');

let db;

export async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // ── CUSTOMERS: 4 fields (no work order) ──
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      address TEXT,
      country TEXT,
      state TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `);

  // ── INSPECTORS: 6 fields (no work order) ──
  db.run(`
    CREATE TABLE IF NOT EXISTS inspectors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      designation TEXT,
      organization TEXT,
      email TEXT,
      mobile_number TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `);

  // ── MARKETING: 13 fields (has W.O No) ──
  db.run(`
    CREATE TABLE IF NOT EXISTS marketing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      work_order_no TEXT NOT NULL,
      serial_no TEXT,
      project_name TEXT,
      project_location TEXT,
      customer_name TEXT,
      purchase_order_no TEXT,
      contractor_name TEXT,
      epc_contractor_name TEXT,
      sub_contractor_name TEXT,
      consultant_name TEXT,
      end_customer_name TEXT,
      loa_no TEXT,
      order_receipt_date TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `);

  // ── DESIGN: basic fields + rating/HR/insulation/voltage tables ──
  db.run(`
    CREATE TABLE IF NOT EXISTS design (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      work_order_no TEXT NOT NULL,
      serial_no TEXT,
      no_of_phase TEXT,
      vector_group TEXT,
      frequency TEXT,
      phase_marking TEXT,
      reference_standard TEXT,
      winding_material TEXT,
      cooling_type TEXT,

      /* Rating Table (3 ratings) */
      mva_rating_1 TEXT,
      mva_rating_2 TEXT,
      mva_rating_3 TEXT,
      voltage_rating_wdg1 TEXT,
      voltage_rating_wdg2 TEXT,
      voltage_rating_wdg3 TEXT,

      /* HR Test Detail */
      hr_test_oil TEXT,
      hr_test_wdg1 TEXT,
      hr_test_wdg2 TEXT,
      hr_test_wdg3 TEXT,

      /* Insulation Details (LI / AV / IOV per winding) */
      ins_wdg1_line_li TEXT,
      ins_wdg1_line_av TEXT,
      ins_wdg1_line_iov TEXT,
      ins_wdg1_neutral_li TEXT,
      ins_wdg1_neutral_av TEXT,
      ins_wdg1_neutral_iov TEXT,
      ins_wdg2_line_li TEXT,
      ins_wdg2_line_av TEXT,
      ins_wdg2_line_iov TEXT,
      ins_wdg2_neutral_li TEXT,
      ins_wdg2_neutral_av TEXT,
      ins_wdg2_neutral_iov TEXT,
      ins_wdg3_line_li TEXT,
      ins_wdg3_line_av TEXT,
      ins_wdg3_line_iov TEXT,
      ins_wdg3_neutral_li TEXT,
      ins_wdg3_neutral_av TEXT,
      ins_wdg3_neutral_iov TEXT,

      /* Voltage Variation (per winding) */
      volt_var_pos_tap_wdg1 TEXT,
      volt_var_pos_tap_wdg2 TEXT,
      volt_var_pos_tap_wdg3 TEXT,
      volt_var_neg_tap_wdg1 TEXT,
      volt_var_neg_tap_wdg2 TEXT,
      volt_var_neg_tap_wdg3 TEXT,
      volt_var_tap_ins_pct_wdg1 TEXT,
      volt_var_tap_ins_pct_wdg2 TEXT,
      volt_var_tap_ins_pct_wdg3 TEXT,

      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `);

  // ── ADMIN USERS ──
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      otp TEXT,
      otp_expires TEXT,
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `);

  // Indexes for searchable fields
  db.run(`CREATE INDEX IF NOT EXISTS idx_marketing_wo ON marketing(work_order_no)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_design_wo ON design(work_order_no)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_inspectors_name ON inspectors(first_name)`);

  // Seed default admin
  const existing = db.exec("SELECT id FROM admin_users WHERE username = 'admin'");
  if (existing.length === 0 || existing[0].values.length === 0) {
    const hashedPassword = bcrypt.hashSync('indotech@4321', 12);
    db.run("INSERT INTO admin_users (username, password, email) VALUES (?, ?, ?)", [
      'admin', hashedPassword, 'devaraj.K@indo-tech.com',
    ]);
    console.log('✅ Default admin user created');
  }

  saveDatabase();
  console.log('✅ Database initialized');
  return db;
}

export function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

export function getDb() {
  return db;
}

export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results.length > 0 ? results[0] : null;
}

export function runSql(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
  return { lastId: db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] };
}
