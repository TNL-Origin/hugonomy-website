"""
Hugonomy Marketing Experiment Ledger — .xlsx generator
Run: python generate_ledger_xlsx.py
Output: experiment_ledger.xlsx (same folder)

Requires: pip install openpyxl
"""

import csv
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

INPUT_CSV = "experiment_ledger.csv"
OUTPUT_XLSX = "experiment_ledger.xlsx"

PLATFORM_COLORS = {
    "TikTok":    "FF0050",
    "LinkedIn":  "0A66C2",
    "Facebook":  "1877F2",
    "MailerLite":"14B389",
}

DECISION_COLORS = {
    "Scale":       "00B050",
    "Repeat":      "92D050",
    "Remix":       "FFEB9C",
    "Investigate": "BDD7EE",
    "Kill":        "FFC7CE",
}

HEADER_FILL = PatternFill("solid", fgColor="1A1A2E")
HEADER_FONT = Font(bold=True, color="F0C040", size=10)
ALT_FILL    = PatternFill("solid", fgColor="F2F2F2")

thin = Side(style="thin", color="D0D0D0")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)


def header_fill_for(value):
    return HEADER_FILL


def cell_fill(hex_color):
    return PatternFill("solid", fgColor=hex_color)


def build_xlsx(csv_path, xlsx_path):
    with open(csv_path, newline="", encoding="utf-8") as f:
        rows = list(csv.reader(f))

    if not rows:
        print("Empty CSV — nothing to write.")
        return

    headers = rows[0]
    data_rows = rows[1:]

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Experiment Ledger"

    # --- Headers ---
    for col_idx, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col_idx, value=header)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER

    ws.row_dimensions[1].height = 36

    # --- Data rows ---
    platform_col = headers.index("Platform") if "Platform" in headers else None
    decision_col = headers.index("Decision") if "Decision" in headers else None

    for row_idx, row in enumerate(data_rows, start=2):
        is_alt = (row_idx % 2 == 0)
        for col_idx, value in enumerate(row, start=1):
            cell = ws.cell(row=row_idx, column=col_idx, value=value)
            cell.alignment = Alignment(wrap_text=True, vertical="top")
            cell.border = BORDER

            # Platform colour strip (column A = Post ID gets the accent)
            if col_idx == 1 and platform_col is not None and platform_col < len(row):
                platform = row[platform_col]
                hex_c = PLATFORM_COLORS.get(platform)
                if hex_c:
                    cell.fill = cell_fill(hex_c)
                    cell.font = Font(color="FFFFFF", bold=True, size=10)
                elif is_alt:
                    cell.fill = ALT_FILL
            elif col_idx - 1 == decision_col and value:
                key = value.split("—")[0].strip().split(" ")[0]
                hex_c = DECISION_COLORS.get(key)
                if hex_c:
                    cell.fill = cell_fill(hex_c)
                    cell.font = Font(bold=True, size=9)
                elif is_alt:
                    cell.fill = ALT_FILL
            elif is_alt:
                cell.fill = ALT_FILL

        # Row height — taller for interpretation + decision cols
        ws.row_dimensions[row_idx].height = 80

    # --- Column widths ---
    COL_WIDTHS = {
        "ExperimentID":     10,
        "Date":             13,
        "Platform":         12,
        "ChannelType":      12,
        "ContentTitle":     28,
        "ContentURL":       22,
        "HookType":         18,
        "PrimaryGoal":      18,
        "Hook":             38,
        "CoreMessage":      38,
        "CTA":              20,
        "TargetAudience":   22,
        "Views":             9,
        "Impressions":      12,
        "WatchTime":        12,
        "RetentionRate":    13,
        "Likes":             8,
        "Comments":          9,
        "Shares":            8,
        "Saves":             8,
        "ProfileVisits":    13,
        "WebsiteClicks":    14,
        "ExtensionInstalls":16,
        "WaitlistSignups":  15,
        "Notes_Human":      45,
        "Notes_Gemini":     45,
        "Notes_Claude":     45,
        "Decision":         45,
    }

    for col_idx, header in enumerate(headers, start=1):
        col_letter = get_column_letter(col_idx)
        ws.column_dimensions[col_letter].width = COL_WIDTHS.get(header, 20)

    # --- Freeze pane (keep Post ID + Platform + Date visible) ---
    ws.freeze_panes = "E2"

    # --- Auto-filter ---
    ws.auto_filter.ref = ws.dimensions

    wb.save(xlsx_path)
    print(f"Saved: {xlsx_path}")
    print(f"  {len(data_rows)} data rows, {len(headers)} columns")


if __name__ == "__main__":
    build_xlsx(INPUT_CSV, OUTPUT_XLSX)
