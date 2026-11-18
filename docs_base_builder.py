import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

DOCS_DIR = r"c:\Users\dell\Desktop\EventSphere\docs"
DIAG_DIR = os.path.join(DOCS_DIR, "diagrams")
BRAIN_DIR = r"C:\Users\dell\.gemini\antigravity\brain\eece5012-a7bb-4163-ac34-83b945b7affe"

# Colors
C_NAVY = RGBColor(0x0F, 0x17, 0x2A)     # #0F172A
C_PRIMARY = RGBColor(0x1E, 0x3A, 0x8A)  # #1E3A8A Dark Navy Blue
C_ACCENT = RGBColor(0x02, 0x84, 0xC7)   # #0284C7 Sky Blue
C_SLATE = RGBColor(0x33, 0x41, 0x55)    # #334155 Slate
C_MUTED = RGBColor(0x64, 0x74, 0x8B)    # #64748B
C_SUCCESS = RGBColor(0x05, 0x96, 0x69)  # #059669
C_DARK = RGBColor(0x0F, 0x17, 0x2A)

HEX_PRIMARY = "1E3A8A"
HEX_LIGHT_BG = "F1F5F9"
HEX_CARD_BG = "F8FAFC"
HEX_BORDER = "CBD5E1"
HEX_ALT_ROW = "F8FAFC"
HEX_WHITE = "FFFFFF"
HEX_ACCENT_BG = "E0F2FE"
HEX_SUCCESS_BG = "ECFDF5"
HEX_WARN_BG = "FFFBEB"

def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(20)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = C_PRIMARY
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = C_ACCENT
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(11.5)
    run.font.bold = True
    run.font.color.rgb = C_SLATE
    return p

def add_body(doc, text, bold=False, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(11)
    run.font.color.rgb = C_DARK
    run.bold = bold
    run.italic = italic
    return p

def add_bullet(doc, title, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    r_title = p.add_run(title + ": ")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(10.5)
    r_title.font.bold = True
    r_title.font.color.rgb = C_PRIMARY
    
    r_text = p.add_run(text)
    r_text.font.name = "Calibri"
    r_text.font.size = Pt(10.5)
    r_text.font.color.rgb = C_DARK
    return p

def add_callout(doc, title, text, box_type="NOTE"):
    bg_color = HEX_ACCENT_BG if box_type == "NOTE" else (HEX_SUCCESS_BG if box_type == "TIP" else HEX_WARN_BG)
    border_color = HEX_PRIMARY if box_type == "NOTE" else ("059669" if box_type == "TIP" else "D97706")
    
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=180)
    
    # Left border
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="36" w:space="0" w:color="{border_color}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r_t = p.add_run(f"[{box_type}] {title}")
    r_t.font.name = "Segoe UI"
    r_t.font.size = Pt(10)
    r_t.font.bold = True
    r_t.font.color.rgb = C_PRIMARY if box_type == "NOTE" else (C_SUCCESS if box_type == "TIP" else RGBColor(0xD9, 0x77, 0x06))
    
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    r_desc = p2.add_run(text)
    r_desc.font.name = "Calibri"
    r_desc.font.size = Pt(10)
    r_desc.font.color.rgb = C_DARK
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_image_figure(doc, img_path, caption, width_in=6.2):
    if not os.path.exists(img_path):
        print(f"Warning: image {img_path} not found.")
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run()
    run.add_picture(img_path, width=Inches(width_in))
    
    # Caption
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(10)
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = "Segoe UI"
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True
    r_cap.font.bold = True
    r_cap.font.color.rgb = C_MUTED

def style_table(tbl, col_widths, headers, data):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Set header row
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], HEX_PRIMARY)
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.name = "Segoe UI"
            run.font.size = Pt(10)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            
    # Data rows
    for row_idx, row_data in enumerate(data):
        row_cells = tbl.add_row().cells
        bg_color = HEX_ALT_ROW if row_idx % 2 == 1 else HEX_WHITE
        for col_idx, cell_value in enumerate(row_data):
            row_cells[col_idx].text = str(cell_value)
            set_cell_background(row_cells[col_idx], bg_color)
            set_cell_margins(row_cells[col_idx], top=100, bottom=100, left=140, right=140)
            p = row_cells[col_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Calibri"
                run.font.size = Pt(9.5)
                run.font.color.rgb = C_DARK
                
    # Column widths
    for row in tbl.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = Inches(width)
            
    doc_p = tbl._element.getparent()
    # Add small spacing after table
    p_after = tbl._element.getparent().add_p()
    p_after.get_or_add_pPr()

print("Base helper library configured.")
