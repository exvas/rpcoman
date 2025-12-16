frappe.ui.form.on('Supplier', {
    refresh: function(frm) {
        // Set VAT as default tax category when form loads
        if (frm.is_new() && !frm.doc.tax_category) {
            frm.set_value('tax_category', 'VAT');
        }
    },

    before_save: function(frm) {
        // Ensure VAT is set before saving
        if (!frm.doc.tax_category) {
            frm.set_value('tax_category', 'VAT');
        }
    },

    onload: function(frm) {
        // Set VAT when form is loaded for new records
        if (frm.is_new() && !frm.doc.tax_category) {
            frm.set_value('tax_category', 'VAT');
        }
    }
});
