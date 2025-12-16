import frappe


@frappe.whitelist()
def get_next_item_code(item_group):
    """
    Get the next available item code based on item group.

    Args:
        item_group: The item group name (Food, Frozen, Non Food)

    Returns:
        str: The next available item code, or None if item_group is invalid
    """
    # Define ranges for each group
    ranges = {
        "Food": {"start": 100001, "end": 199999},
        "Frozen": {"start": 200000, "end": 299999},
        "Non Food": {"start": 300000, "end": 399999},
        "Asset": {"start": 400000, "end": 499999},
    }

    # Fallback for any other item group not in the defined ranges
    if item_group not in ranges:
        ranges[item_group] = {"start": 500000, "end": 599999}

    range_config = ranges[item_group]

    # Get last item code in this range
    last_code = frappe.db.sql(
        """
        SELECT item_code FROM `tabItem`
        WHERE item_code REGEXP '^[0-9]+$'
        AND CAST(item_code AS UNSIGNED) BETWEEN %s AND %s
        ORDER BY CAST(item_code AS UNSIGNED) DESC
        LIMIT 1
    """,
        (range_config["start"], range_config["end"]),
    )

    if last_code:
        next_code = int(last_code[0][0]) + 1
    else:
        next_code = range_config["start"]

    return str(next_code)
