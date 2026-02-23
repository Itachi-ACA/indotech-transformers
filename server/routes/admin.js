import { Router } from 'express';
import { queryAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import ExcelJS from 'exceljs';

const router = Router();
router.use(requireAuth);

const TABLES = ['inspectors', 'customers', 'marketing', 'design'];
const TABLE_LABELS = {
    inspectors: 'Inspector',
    customers: 'Customer',
    marketing: 'Marketing',
    design: 'Design',
};

function getSearchColumns(table) {
    const tableMap = {
        customers: ['name', 'address', 'country', 'state'],
        inspectors: ['first_name', 'last_name', 'designation', 'organization', 'email'],
        marketing: ['work_order_no', 'serial_no', 'project_name', 'customer_name', 'purchase_order_no'],
        design: ['work_order_no', 'serial_no', 'no_of_phase', 'vector_group'],
    };
    return tableMap[table] || ['id'];
}

function fetchFiltered(table, search) {
    if (search) {
        const searchPattern = `%${search}%`;
        const searchCols = getSearchColumns(table);
        const whereClause = searchCols.map(col => `${col} LIKE ?`).join(' OR ');
        const params = searchCols.map(() => searchPattern);
        return queryAll(`SELECT * FROM ${table} WHERE ${whereClause} ORDER BY created_at DESC`, params);
    }
    return queryAll(`SELECT * FROM ${table} ORDER BY created_at DESC`);
}

router.get('/data/:table', (req, res) => {
    try {
        const { table } = req.params;
        if (!TABLES.includes(table)) {
            return res.status(400).json({ error: 'Invalid table name.' });
        }
        const search = req.query.search?.trim();
        const data = fetchFiltered(table, search);
        return res.json({ data });
    } catch (error) {
        console.error('Admin data fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch data.' });
    }
});

router.get('/export', async (req, res) => {
    try {
        const search = req.query.search?.trim();
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Indotech Transformers Ltd';
        workbook.created = new Date();

        for (const table of TABLES) {
            const rows = fetchFiltered(table, search);
            const sheet = workbook.addWorksheet(TABLE_LABELS[table]);

            const colCount = rows.length > 0 ? Object.keys(rows[0]).length : 6;
            const lastCol = String.fromCharCode(64 + Math.min(colCount, 26));

            sheet.mergeCells(`A1:${lastCol}1`);
            const headerCell = sheet.getCell('A1');
            headerCell.value = 'INDOTECH TRANSFORMERS LTD';
            headerCell.font = { bold: true, size: 16, color: { argb: 'FF003366' } };
            headerCell.alignment = { horizontal: 'center' };

            sheet.mergeCells(`A2:${lastCol}2`);
            const tsCell = sheet.getCell('A2');
            tsCell.value = `Exported: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
            tsCell.font = { italic: true, size: 10, color: { argb: 'FF666666' } };
            tsCell.alignment = { horizontal: 'center' };

            sheet.addRow([]);

            if (rows.length > 0) {
                // Filter out internal fields if needed, but here we just ignore 'id'
                const columns = Object.keys(rows[0]).filter(k => k !== 'id');

                sheet.addTable({
                    name: `Table_${table}`,
                    ref: 'A4',
                    headerRow: true,
                    totalsRow: false,
                    style: {
                        theme: 'TableStyleMedium2',
                        showRowStripes: true,
                    },
                    columns: columns.map(c => ({
                        name: c.replace(/_/g, ' ').toUpperCase(),
                        filterButton: true
                    })),
                    rows: rows.map(row => columns.map(c => row[c] ?? ''))
                });

                // Auto-fit columns
                columns.forEach((col, i) => {
                    let maxLen = col.length;
                    rows.forEach(row => {
                        const val = String(row[col] ?? '');
                        if (val.length > maxLen) maxLen = val.length;
                    });
                    sheet.getColumn(i + 1).width = Math.min(maxLen + 4, 40);
                });
            } else {
                sheet.addRow(['No data found']);
            }
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Indotech_Data_${Date.now()}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Excel export error:', error);
        return res.status(500).json({ error: 'Failed to export data.' });
    }
});

export default router;
