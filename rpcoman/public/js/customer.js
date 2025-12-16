frappe.ui.form.on('Customer', {
    refresh: function(frm) {
        // Set VAT as default tax category when form loads
        if (frm.is_new() && !frm.doc.tax_category) {
            setTimeout(() => {
                frm.set_value('tax_category', 'VAT');
            }, 500);
        }
    },

    before_save: function(frm) {
        // Ensure VAT is set before saving
        if (!frm.doc.tax_category) {
            frm.set_value('tax_category', 'VAT');
        }
    }
});
