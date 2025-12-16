frappe.ui.form.on('Sales Invoice', {
    refresh(frm) {
        // Hide fields
        frm.set_df_property('shipping_rule', 'hidden', 1);
        frm.set_df_property('incoterm', 'hidden', 1);
        frm.set_df_property('named_place', 'hidden', 1);
        frm.set_df_property('timesheets', 'hidden', 1);
    },

    onload(frm) {
        // Hide fields only - don't set tax_category here
        frm.set_df_property('shipping_rule', 'hidden', 1);
        frm.set_df_property('incoterm', 'hidden', 1);
        frm.set_df_property('named_place', 'hidden', 1);
        frm.set_df_property('timesheets', 'hidden', 1);
    },

    // Set Tax Category AFTER customer is selected
    customer(frm) {
        if (frm.doc.customer && !frm.doc.tax_category) {
            frm.set_value('tax_category', 'VAT');
        }
    },

    before_save(frm) {
        // Ensure Tax Category is set before save
        if (frm.doc.customer && !frm.doc.tax_category) {
            frm.set_value('tax_category', 'VAT');
        }
    }
});
