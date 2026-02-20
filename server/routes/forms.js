import { Router } from 'express';
import { runSql } from '../db.js';

const router = Router();

const FIELDS = {
    customer: ['name', 'address', 'country', 'state'],
    inspector: ['first_name', 'last_name', 'designation', 'organization', 'email', 'mobile_number'],
    marketing: [
        'work_order_no', 'serial_no', 'project_name', 'project_location',
        'customer_name', 'purchase_order_no', 'contractor_name',
        'epc_contractor_name', 'sub_contractor_name', 'consultant_name',
        'end_customer_name', 'loa_no', 'order_receipt_date',
    ],
    design: [
        'work_order_no', 'serial_no', 'no_of_phase', 'vector_group',
        'frequency', 'phase_marking', 'reference_standard', 'winding_material',
        'mva_rating_1', 'mva_rating_2', 'mva_rating_3',
        'cooling_type_1', 'cooling_type_2', 'cooling_type_3',
        'voltage_rating_wdg1', 'voltage_rating_wdg2', 'voltage_rating_wdg3',
        'hr_test_oil', 'hr_test_wdg1', 'hr_test_wdg2', 'hr_test_wdg3',
        'ins_wdg1_line_li', 'ins_wdg1_line_av', 'ins_wdg1_line_iov',
        'ins_wdg1_neutral_li', 'ins_wdg1_neutral_av', 'ins_wdg1_neutral_iov',
        'ins_wdg2_line_li', 'ins_wdg2_line_av', 'ins_wdg2_line_iov',
        'ins_wdg2_neutral_li', 'ins_wdg2_neutral_av', 'ins_wdg2_neutral_iov',
        'ins_wdg3_line_li', 'ins_wdg3_line_av', 'ins_wdg3_line_iov',
        'ins_wdg3_neutral_li', 'ins_wdg3_neutral_av', 'ins_wdg3_neutral_iov',
        'volt_var_pos_tap_wdg1', 'volt_var_pos_tap_wdg2', 'volt_var_pos_tap_wdg3',
        'volt_var_neg_tap_wdg1', 'volt_var_neg_tap_wdg2', 'volt_var_neg_tap_wdg3',
        'volt_var_tap_ins_pct_wdg1', 'volt_var_tap_ins_pct_wdg2', 'volt_var_tap_ins_pct_wdg3',
    ],
};

const TABLES = {
    customer: 'customers',
    inspector: 'inspectors',
    marketing: 'marketing',
    design: 'design',
};

// Tables that require work_order_no
const REQUIRES_WO = new Set(['marketing', 'design']);

function createFormHandler(type) {
    return (req, res) => {
        try {
            const data = req.body;

            if (REQUIRES_WO.has(type) && (!data.work_order_no || data.work_order_no.trim() === '')) {
                return res.status(400).json({ error: 'Work Order Number is required.' });
            }

            const fields = FIELDS[type];
            const tableName = TABLES[type];
            const values = fields.map(f => data[f] !== undefined && data[f] !== '' ? String(data[f]) : null);
            const placeholders = fields.map(() => '?').join(', ');
            const fieldNames = fields.join(', ');

            const result = runSql(`INSERT INTO ${tableName} (${fieldNames}) VALUES (${placeholders})`, values);
            return res.json({ success: true, id: result.lastId });
        } catch (error) {
            console.error(`Form submission error (${type}):`, error);
            return res.status(500).json({ error: 'Failed to save data. Please try again.' });
        }
    };
}

router.post('/inspector', createFormHandler('inspector'));
router.post('/customer', createFormHandler('customer'));
router.post('/marketing', createFormHandler('marketing'));
router.post('/design', createFormHandler('design'));

export default router;
