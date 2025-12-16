frappe.ui.form.on('Item', {
    refresh(frm) {
        frm.batch_confirmed = false;
    },

    item_group(frm) {
        // Auto-generate item code when item group is selected (only for new items)
        if (frm.is_new() && frm.doc.item_group) {
            frappe.call({
                method: 'rpcoman.api.item.get_next_item_code',
                args: {
                    item_group: frm.doc.item_group
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value('item_code', r.message);
                    }
                }
            });
        }
    },

    before_save(frm) {
        // Auto set Tax Category "VAT" only for new items
        if (frm.is_new() && frm.doc.taxes && frm.doc.taxes.length > 0) {
            frm.doc.taxes.forEach(row => {
                if (!row.tax_category) {
                    row.tax_category = 'VAT';
                }
            });
        }

        // Batch confirmation logic
        if (frm.batch_confirmed || frm.doc.has_batch_no) {
            return;
        }

        frappe.validated = false;

        frappe.confirm(
            'Enable Batch for this Item?<br>هل تريد تفعيل الدفعة لهذا الصنف؟',
            () => {
                frm.set_value('has_batch_no', 1);
                frm.batch_confirmed = true;
                frm.save();
            },
            () => {
                frm.batch_confirmed = true;
                frm.save();
            }
        );
    }
});

frappe.ui.form.on('Item Tax', {
    taxes_add(frm, cdt, cdn) {
        // Auto-set VAT when new tax row is added
        if (frm.is_new()) {
            let row = locals[cdt][cdn];
            row.tax_category = 'VAT';
            frm.refresh_field('taxes');
        }
    },

    item_tax_template(frm, cdt, cdn) {
        // Auto-set VAT when item tax template is selected
        if (frm.is_new()) {
            let row = locals[cdt][cdn];
            if (!row.tax_category) {
                row.tax_category = 'VAT';
                frm.refresh_field('taxes');
            }
        }
    }
});
