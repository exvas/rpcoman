import frappe
from frappe.desk.doctype.number_card.number_card import get_result as frappe_get_result
from frappe.model.db_query import DatabaseQuery


# Monkey patch DatabaseQuery to handle empty filter groups
_original_build_conditions = DatabaseQuery.build_conditions


def patched_build_conditions(self):
	"""
	Patched version of build_conditions that filters out empty condition groups.

	This fixes the SQL syntax error caused by empty parentheses: "and ( )"
	"""
	# Call original method
	_original_build_conditions(self)

	# Filter out empty conditions from self.conditions
	if self.conditions:
		self.conditions = [c for c in self.conditions if c and c.strip() not in ('()', '( )')]

	# Filter out empty grouped_or_conditions
	if hasattr(self, 'grouped_or_conditions') and self.grouped_or_conditions:
		self.grouped_or_conditions = [c for c in self.grouped_or_conditions if c and c.strip()]


# Apply the monkey patch
DatabaseQuery.build_conditions = patched_build_conditions


@frappe.whitelist()
def get_result(doc, filters, to_date=None):
	"""
	Override of Frappe's get_result to handle empty filter conditions.

	This fixes the SQL syntax error: "You have an error in your SQL syntax... near ')'"
	which occurs when permission filters or dynamic filters evaluate to empty conditions.
	"""
	try:
		# Call the original function with correct signature
		return frappe_get_result(doc=doc, filters=filters, to_date=to_date)
	except frappe.db.ProgrammingError as e:
		# Check if it's the empty condition error
		if "and ( )" in str(e) or "near ')'" in str(e):
			frappe.log_error(
				title="Number Card Empty Filter Condition",
				message=f"Number Card '{doc}' has empty filter conditions. Error: {str(e)}\nFilters: {filters}"
			)
			# Return a safe default value
			return 0
		else:
			# Re-raise if it's a different error
			raise
