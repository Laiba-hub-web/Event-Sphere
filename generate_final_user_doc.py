import os
import sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

DOCS_DIR = r"c:\Users\dell\Desktop\EventSphere\docs"
DIAG_DIR = os.path.join(DOCS_DIR, "diagrams")
BRAIN_DIR = r"C:\Users\dell\.gemini\antigravity\brain\eece5012-a7bb-4163-ac34-83b945b7affe"

C_PRIMARY = RGBColor(0x0F, 0x29, 0x4A)     # Deep Corporate Navy
C_ACCENT = RGBColor(0x02, 0x84, 0xC7)      # Tech Sky Blue
C_SLATE = RGBColor(0x33, 0x41, 0x55)       # Charcoal Slate
C_MUTED = RGBColor(0x64, 0x74, 0x8B)       # Muted Slate
C_SUCCESS = RGBColor(0x05, 0x96, 0x69)     # Emerald
C_DARK = RGBColor(0x1E, 0x29, 0x3B)
C_WARN = RGBColor(0xD9, 0x77, 0x06)

HEX_HEADER_BG = "0F294A"
HEX_ALT_ROW = "F8FAFC"
HEX_WHITE = "FFFFFF"
HEX_CALLOUT_NOTE_BG = "F0F9FF"
HEX_CALLOUT_NOTE_BORDER = "0284C7"
HEX_CALLOUT_TIP_BG = "ECFDF5"
HEX_CALLOUT_TIP_BORDER = "059669"
HEX_CALLOUT_WARN_BG = "FFFBEB"
HEX_CALLOUT_WARN_BORDER = "D97706"

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
    p.paragraph_format.space_before = Pt(22)
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = "Segoe UI"
    run.font.size = Pt(16)
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
    run.font.size = Pt(13)
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
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = C_SLATE
    return p

def add_body(doc, text, bold=False, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(10.5)
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
    r_title.font.size = Pt(10)
    r_title.font.bold = True
    r_title.font.color.rgb = C_PRIMARY
    
    r_text = p.add_run(text)
    r_text.font.name = "Calibri"
    r_text.font.size = Pt(10)
    r_text.font.color.rgb = C_DARK
    return p

def add_callout(doc, title, text, box_type="NOTE"):
    bg_color = HEX_CALLOUT_NOTE_BG if box_type == "NOTE" else (HEX_CALLOUT_TIP_BG if box_type == "TIP" else HEX_CALLOUT_WARN_BG)
    border_color = HEX_CALLOUT_NOTE_BORDER if box_type == "NOTE" else (HEX_CALLOUT_TIP_BORDER if box_type == "TIP" else HEX_CALLOUT_WARN_BORDER)
    
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=180)
    
    tcPr = cell._element.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="36" w:space="0" w:color="{border_color}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r_t = p.add_run(f"[{box_type}] {title}")
    r_t.font.name = "Segoe UI"
    r_t.font.size = Pt(9.5)
    r_t.font.bold = True
    r_t.font.color.rgb = C_ACCENT if box_type == "NOTE" else (C_SUCCESS if box_type == "TIP" else C_WARN)
    
    p2 = cell.add_paragraph()
    p2.paragraph_format.space_after = Pt(0)
    r_desc = p2.add_run(text)
    r_desc.font.name = "Calibri"
    r_desc.font.size = Pt(9.5)
    r_desc.font.color.rgb = C_DARK
    
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(4)

def add_image_figure(doc, filename, caption, width_in=6.2):
    img_path = os.path.join(DIAG_DIR, filename)
    if not os.path.exists(img_path):
        print(f"Warning: Figure {img_path} not found.")
        return
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run()
    run.add_picture(img_path, width=Inches(width_in))
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(10)
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = "Segoe UI"
    r_cap.font.size = Pt(9)
    r_cap.font.italic = True
    r_cap.font.bold = True
    r_cap.font.color.rgb = C_MUTED

def style_table(doc, tbl, col_widths, headers, data):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_cells = tbl.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], HEX_HEADER_BG)
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.name = "Segoe UI"
            run.font.size = Pt(9.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
            
    for row_idx, row_data in enumerate(data):
        row_cells = tbl.add_row().cells
        bg_color = HEX_ALT_ROW if row_idx % 2 == 1 else HEX_WHITE
        for col_idx, cell_value in enumerate(row_data):
            row_cells[col_idx].text = str(cell_value)
            set_cell_background(row_cells[col_idx], bg_color)
            set_cell_margins(row_cells[col_idx], top=90, bottom=90, left=140, right=140)
            p = row_cells[col_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Calibri"
                run.font.size = Pt(9)
                run.font.color.rgb = C_DARK
                
    for row in tbl.rows:
        for idx, width in enumerate(col_widths):
            row.cells[idx].width = Inches(width)
            
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(4)

def generate_user_doc():
    doc = Document()
    
    # Page Setup
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header / Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("EventSphere Management Platform • Enterprise User Documentation")
        hrun.font.name = "Segoe UI"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = C_MUTED
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun = fp.add_run("Confidential & Proprietary • EventSphere Management Solutions Inc.")
        frun.font.name = "Segoe UI"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = C_MUTED

    # ==================== COVER PAGE ====================
    # Title Top Spacing
    p_top = doc.add_paragraph()
    p_top.paragraph_format.space_before = Pt(30)
    
    p_pill = doc.add_paragraph()
    r_pill = p_pill.add_run("EVENT OPERATIONS & STAKEHOLDER MANUAL • VERSION 2.4.0")
    r_pill.font.name = "Segoe UI"
    r_pill.font.size = Pt(10)
    r_pill.font.bold = True
    r_pill.font.color.rgb = C_ACCENT
    
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(6)
    r_t1 = p_title.add_run("EventSphere")
    r_t1.font.name = "Segoe UI"
    r_t1.font.size = Pt(32)
    r_t1.font.bold = True
    r_t1.font.color.rgb = C_PRIMARY
    
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(16)
    r_sub = p_sub.add_run("Comprehensive User Guide, Operational Workflows & Interactive Floor Management Manual")
    r_sub.font.name = "Segoe UI"
    r_sub.font.size = Pt(15)
    r_sub.font.color.rgb = C_SLATE
    
    p_rule = doc.add_paragraph()
    p_rule.paragraph_format.space_after = Pt(20)
    p_rule_run = p_rule.add_run("_______________________________________________________________________________")
    p_rule_run.font.color.rgb = C_ACCENT
    p_rule_run.font.size = Pt(11)
    
    # Metadata Table
    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Platform Name", "EventSphere Management Suite (Enterprise Edition)"),
        ("Target Roles", "Expo Organizers / Admins, Commercial Exhibitors, Registered Attendees"),
        ("Active Expos Documented", "Global FinTech & Digital Banking Forum 2026, Global Tech & AI Summit 2026"),
        ("Authoring Body", "EventSphere Product Management & Solutions Architecture Team"),
        ("Release Version", "v2.4.0 (Synchronized UI/UX, Socket.io Real-Time Engine)"),
        ("Document Security", "Enterprise Confidential • Authorized Stakeholder Distribution Only")
    ]
    for idx, (label, val) in enumerate(meta_data):
        row_cells = meta_table.rows[idx].cells
        row_cells[0].text = label
        row_cells[1].text = val
        set_cell_background(row_cells[0], "F1F5F9")
        set_cell_background(row_cells[1], "FFFFFF")
        set_cell_margins(row_cells[0], top=80, bottom=80, left=120, right=120)
        set_cell_margins(row_cells[1], top=80, bottom=80, left=120, right=120)
        
        p0 = row_cells[0].paragraphs[0]
        p0.runs[0].font.name = "Segoe UI"
        p0.runs[0].font.size = Pt(9.5)
        p0.runs[0].font.bold = True
        p0.runs[0].font.color.rgb = C_PRIMARY
        
        p1 = row_cells[1].paragraphs[0]
        p1.runs[0].font.name = "Calibri"
        p1.runs[0].font.size = Pt(9.5)
        p1.runs[0].font.color.rgb = C_DARK
        
        row_cells[0].width = Inches(2.2)
        row_cells[1].width = Inches(4.3)
        
    doc.add_page_break()

    # ==================== TABLE OF CONTENTS SUMMARY ====================
    add_heading_1(doc, "Document Table of Contents & Structure")
    add_body(doc, "This operational manual is organized into 9 comprehensive chapters designed to provide end-to-end guidance for all user personas interacting with the EventSphere Management Platform:")
    
    toc_items = [
        ("Chapter 1: Executive Background, Problem Statement & Platform Vision", "Historical industry friction, business objectives, and platform architecture overview."),
        ("Chapter 2: User Authentication & Role-Based Access Control", "Registration flows, role differentiation, password recovery, and privilege matrix."),
        ("Chapter 3: Admin & Organizer Command Center Master Guide", "Expo creation, automated 2D floor grid synthesis, exhibitor vetting, master agenda management, and analytics."),
        ("Chapter 4: Exhibitor Portal & Digital Showcase Studio", "Profile setup, real-time booth reservation, product catalog showcase, and lead inquiry management."),
        ("Chapter 5: Attendee Interactive Companion Interface", "Event discovery, digital badge pass, category filtering, booth locator, and agenda bookmarks."),
        ("Chapter 6: General Platform Features & Real-Time Sync", "WebSocket push architecture, notification dispatch, feedback collection, and helpdesk."),
        ("Chapter 7: Non-Functional Guarantees from a User Perspective", "Response time benchmarks, bank-grade encryption, privacy controls, and 99.9% uptime SLA."),
        ("Chapter 8: Hands-On Operational Step-by-Step Tutorials", "Three end-to-end operational scenarios executed from start to finish."),
        ("Chapter 9: Frequently Asked Questions & Operational Troubleshooting", "Exhaustive 25+ categorized solutions for common user questions and edge cases.")
    ]
    for title, desc in toc_items:
        add_bullet(doc, title, desc)

    # ==================== CHAPTER 1 ====================
    add_heading_1(doc, "Chapter 1: Executive Background, Problem Statement & Strategic Vision")
    
    add_heading_2(doc, "1.1 Corporate Background: EventSphere Management Firm")
    add_body(doc, "EventSphere Management is a premier international event management enterprise recognized across North America, Europe, and the Asia-Pacific region for engineering and executing mega-scale trade exhibitions, industrial conventions, and technological summits. With an annual portfolio surpassing 150 international expos and accommodating over 500,000 corporate attendees and 12,000 exhibiting companies, EventSphere recognized early that traditional event workflows had reached a point of severe operational exhaustion.")
    
    add_heading_2(doc, "1.2 The Traditional Expo Management Dilemma")
    add_body(doc, "Historically, the international expo and conference industry operated through heavily fragmented, paper-based, and disconnected software systems. EventSphere conducted an exhaustive internal operational audit across 40 mega-expos and identified several critical operational bottlenecks:")
    
    add_bullet(doc, "Manual Registration Chaos", "Attendee and exhibitor registrations relied heavily on static Google Forms, manual spreadsheets, and physical paperwork. This caused severe data reconciliation delays, transcription errors, and hours-long on-site registration lines.")
    add_bullet(doc, "Rigid & Static Floor Planning", "Convention centers provided static PDF floor plans. Organizers manually drafted booth assignments in architectural CAD or Illustrator. When an exhibitor requested a booth change or cancellation, floor diagrams had to be manually redrawn, resulting in double-booking catastrophes and misallocated square footage.")
    add_bullet(doc, "Disjointed Communication Channels", "Critical communications between organizers and exhibitors occurred through unmonitored email threads, phone calls, and physical paper notices. Vital load-in schedules, electrical safety permits, and keynote adjustments were frequently lost in spam folders.")
    add_bullet(doc, "Information Asymmetry for Attendees", "Attendees navigated 200,000 sq ft exhibition centers with crumpled paper floor maps. Finding specific exhibitors or discovering timely session changes was nearly impossible, severely depressing attendee satisfaction scores and booth ROI.")
    add_bullet(doc, "Total Lack of Real-Time Intelligence", "Organizers had zero real-time visibility into hall occupancy, session attendance levels, or booth foot traffic until post-event manual surveys were compiled weeks later.")

    add_heading_2(doc, "1.3 The EventSphere Digital Platform Solution")
    add_body(doc, "Driven by an uncompromising commitment to revolutionize the global expo landscape, EventSphere Management engineered the EventSphere Platform. Built as a high-concurrency, real-time reactive event operating system, EventSphere bridges the divide between Organizers, Exhibitors, and Attendees within a single unified web platform.")
    
    add_image_figure(doc, "user_platform_ecosystem.png", "Figure 1.1: EventSphere Tri-Party Digital Ecosystem Architecture & Value Exchange")
    
    add_body(doc, "As illustrated in Figure 1.1, EventSphere provides an automated, synchronized digital feedback loop where every action taken by an Organizer (e.g. updating a keynote room or approving a booth) instantly cascades across the Exhibitor Portal and the Attendee Companion Interface via bi-directional WebSockets.")

    # ==================== CHAPTER 2 ====================
    add_heading_1(doc, "Chapter 2: User Authentication & Role Architecture")
    
    add_heading_2(doc, "2.1 Role-Based Access Control (RBAC) Architecture")
    add_body(doc, "Security and data segregation are foundational to EventSphere. Upon registration, every user is categorized into one of three distinct system archetypes, each provisioned with granular authorization boundaries:")
    
    add_bullet(doc, "Admin / Organizer Role", "Possesses master administrative governance over the expo ecosystem. Organizers create and publish expos, synthesize floor grids, vet commercial exhibitor applications, assign booth spaces, configure session schedules, and audit financial/traffic analytics.")
    add_bullet(doc, "Commercial Exhibitor Role", "Represents corporate exhibitors. Exhibitors maintain enterprise profile storefronts, submit KYC documentation, browse interactive 2D floor layouts, lock in booth reservations, showcase product catalogs, and field attendee lead inquiries.")
    add_bullet(doc, "Registered Attendee Role", "Represents individual trade attendees, industry delegates, VIPs, and students. Attendees browse expo programs, generate digital QR entry passes, search exhibitors with multi-facet filters, locate booths on interactive maps, and bookmark sessions into personalized timetables.")

    add_heading_2(doc, "2.2 Role & Privilege Matrix")
    add_body(doc, "The following matrix details the precise functional permissions enforced by the backend middleware across all platform modules:")

    rbac_headers = ["Platform Module / Action", "Organizer / Admin", "Commercial Exhibitor", "Trade Attendee"]
    rbac_data = [
        ["Expo Creation, Editing & Deletion", "Full Access (Create / Edit / Delete)", "No Access", "No Access"],
        ["Floor Plan Synthesis & Grid Config", "Full Access (Generate / Modify)", "View Only (Active Floor)", "View Only (Interactive Map)"],
        ["Exhibitor Application Vetting", "Full Access (Approve / Reject)", "Self Application Only", "No Access"],
        ["Direct Booth Space Assignment", "Full Access (Any Booth / Any Company)", "Self-Reservation Request", "No Access"],
        ["Product / Service Catalog Studio", "Audit & Content Moderation", "Full Access (Create / Edit / Delete)", "View & Inquiry Only"],
        ["Master Conference Schedule Builder", "Full Access (Add / Edit / Reschedule)", "Session Registration Access", "Session Registration Access"],
        ["Personal Timetable & Bookmarks", "Available", "Available", "Full Access (Personal Sync)"],
        ["B2B Direct Inquiries & Messaging", "Organizer Broadcast & Direct Chat", "Bi-directional Inquiries", "Inquiry Submission"],
        ["Real-Time Analytics & Reports", "Full Access (Export CSV / PDF)", "Booth Traffic Metrics", "No Access"],
        ["System Audit Logs & Security Config", "Super-Admin Only", "No Access", "No Access"]
    ]
    style_table(doc, doc.add_table(rows=1, cols=4), [2.2, 1.5, 1.4, 1.4], rbac_headers, rbac_data)

    add_heading_2(doc, "2.3 User Registration, Login & Session Lifecycle")
    add_body(doc, "1. Registration Flow: New users navigate to the registration gateway. They enter their full name, corporate email address, and secure password, and select their intended role. Exhibitors are prompted for their registered corporate entity name and primary business vertical.")
    add_body(doc, "2. Authentication Engine: Passwords undergo automated client-side complexity validation (minimum 8 characters, requiring at least one numeric digit and one uppercase character). On the backend, passwords are cryptographically hashed using bcrypt with an adaptive salt work factor of 10. No plaintext passwords ever touch persistent storage.")
    add_body(doc, "3. JWT Session Tokens: Upon successful login, the server signs a JSON Web Token (JWT) containing the user's unique MongoDB ObjectID and role string. Tokens are securely transmitted and stored, granting seamless authenticated access across all portal views.")

    add_heading_2(doc, "2.4 Password Management & Recovery Procedures")
    add_body(doc, "EventSphere incorporates a zero-trust automated password recovery workflow. If a user misplaces their credentials:")
    add_bullet(doc, "1. Initiation", "The user clicks 'Forgot Password?' on the login dialog and inputs their registered email address.")
    add_bullet(doc, "2. Cryptographic Token Generation", "The server generates a high-entropy, cryptographically secure 32-byte reset token with a strict 60-minute expiration timestamp.")
    add_bullet(doc, "3. Out-of-Band Dispatch", "A secure one-time password reset link is delivered to the user's verified email address.")
    add_bullet(doc, "4. Password Overwrite", "Upon opening the link, the user enters and confirms their new password. The backend re-hashes the new secret, invalidates all existing active JWT tokens, and forces a clean authentication session.")

    add_callout(doc, "Security Best Practice", "Never share account credentials or reuse passwords across external platforms. Organizers handling financial settlements or exhibitor contract approvals are strongly advised to rotate passwords every 90 days.", "TIP")

    # ==================== CHAPTER 3 ====================
    add_heading_1(doc, "Chapter 3: Admin & Organizer Command Center Master Guide")
    
    add_heading_2(doc, "3.1 Command Center Architecture Overview")
    add_body(doc, "The Admin/Organizer Command Center is the operational nerve center of the EventSphere Platform. It equips event directors, floor marshals, and program coordinators with live situational awareness and centralized controls across every phase of the expo lifecycle.")
    
    add_image_figure(doc, "ui_mockup_organizer_dashboard.png", "Figure 3.1: EventSphere Organizer Command Center Interface & Metric Monitoring")
    add_image_figure(doc, "organizer_dashboard_flow.png", "Figure 3.2: 5-Stage Operational Pipeline for Expo & Floor Governance")

    add_heading_2(doc, "3.2 Expo Event Lifecycle Management")
    add_body(doc, "Organizers can maintain multiple concurrent expos across distinct international exhibition halls (e.g. 'Global FinTech & Digital Banking Forum 2026' and 'Global Tech & AI Summit 2026'). To create or update an expo:")
    add_bullet(doc, "Step 1: Navigate to 'Expos & Floors'", "Click the 'Create New Expo' button in the top navigation bar or sidebar.")
    add_bullet(doc, "Step 2: Input Core Parameters", "Enter the official Expo Title, Industry Category (e.g., FinTech, Artificial Intelligence, Healthcare), and Detailed Description summarizing the event's theme and mission.")
    add_bullet(doc, "Step 3: Define Venue & Hall Logistics", "Specify the physical venue facility (e.g., 'Javits Convention Center, New York'), Exhibition Hall number, and GPS geolocation coordinates.")
    add_bullet(doc, "Step 4: Set Date & Operating Hours", "Select Start Date, End Date, Daily Hall Opening Hours, and Exhibitor Load-in / Load-out schedules.")
    add_bullet(doc, "Step 5: Visual Branding & Asset Upload", "Upload high-resolution header banners (minimum 1920x600 px recommended) and theme primary/secondary color schemes.")
    add_bullet(doc, "Step 6: Publish", "Toggle the expo status from 'Draft' to 'Published'. Once published, the expo immediately becomes discoverable in the Attendee and Exhibitor discovery directories.")

    add_heading_2(doc, "3.3 Interactive 2D Floor Plan Studio & Booth Allocation Engine")
    add_body(doc, "EventSphere completely eliminates manual CAD floor mapping through its proprietary dynamic 2D floor synthesizer. Organizers can construct complex exhibition layouts in minutes.")
    
    add_image_figure(doc, "floor_plan_booth_map.png", "Figure 3.3: High-Resolution Architectural 2D Exhibition Hall Floor Plan & Status Legend")

    add_body(doc, "The 2D Floor Studio provides the following core capabilities:")
    add_bullet(doc, "Algorithmic Grid Generation", "Organizers specify total target booths (e.g., 50 to 500 booths), column counts, and aisle spacing. The engine computes optimal pedestrian walkway widths and generates booth identifiers (e.g., A-1 through D-12).")
    add_bullet(doc, "Architectural Landmark Placement", "Organizers can drag-and-drop structural elements: Main Entrance Gate, Attendee Registration Desks, Keynote Presentation Stages, VIP Lounges, Restrooms, and Emergency Exits.")
    add_bullet(doc, "Sizing Tiers & Dynamic Pricing", "Booths can be assigned into distinct commercial tiers:")
    
    tier_headers = ["Booth Tier Name", "Dimensions (sq ft)", "Target Exhibitor Type", "Standard Base Price", "Included Amenities"]
    tier_data = [
        ["Standard In-Line Booth", "10x10 ft (100 sq ft)", "Startups & Emerging Tech", "$1,800 - $2,500", "1x 500W Power Outlet, 1x Table, 2x Chairs, Wi-Fi"],
        ["Premium Corner Booth", "20x20 ft (400 sq ft)", "Mid-Market Growth Enterprises", "$4,500 - $6,000", "2x Dual Aisles, 2 kW Power, Hardwire Internet, 4x Staff Passes"],
        ["Island Flagship Pavilion", "30x30 ft (900 sq ft)", "Global Tier-1 Enterprises", "$12,000 - $18,000", "4-Way Open Access, 10 kW 3-Phase Power, Rigging Points, 10x VIP Passes"]
    ]
    style_table(doc, doc.add_table(rows=1, cols=5), [1.6, 1.2, 1.5, 1.2, 1.7], tier_headers, tier_data)

    add_bullet(doc, "Direct Manual Allocation", "If a strategic sponsor requires a specific location, organizers can bypass the application queue and directly assign any booth space to any registered exhibitor via a single dropdown selection.")
    add_bullet(doc, "Real-Time State Transitions", "Every booth reflects one of three operational states: Available (Green), Reserved/Pending Vetting (Amber), or Occupied/Confirmed (Red). Color transitions are pushed to all connected clients in sub-100ms.")

    add_heading_2(doc, "3.4 Exhibitor Management & Application Vetting Workflow")
    add_body(doc, "To protect expo quality and regulatory compliance, organizers maintain absolute control over which commercial entities are granted exhibition rights:")
    add_bullet(doc, "Vetting Queue Inspection", "Organizers open the 'Exhibitor Vetting' tab to review incoming company submissions. Each card displays the company name, category, requested booth space, electricity needs, and submitted tax/insurance certificates.")
    add_bullet(doc, "Application Approval", "Clicking 'Approve' triggers an atomic database update. The assigned booth state immediately locks from 'Reserved' to 'Occupied', and an automated confirmation notification is dispatched to the exhibitor's dashboard.")
    add_bullet(doc, "Application Rejection & Booth Release", "If an applicant fails credit or vetting requirements, the organizer clicks 'Reject'. The system releases the booth back to 'Available' (Green) in the global pool and dispatches an explanatory notice to the applicant.")

    add_heading_2(doc, "3.5 Master Schedule & Conference Session Management")
    add_body(doc, "Organizers manage the full educational and keynote agenda across multiple stages and presentation rooms:")
    add_bullet(doc, "Session Scheduling", "Define session title, track category, start time, end time, and stage venue (e.g. Main Auditorium, Workshop Lab 1).")
    add_bullet(doc, "Speaker Profiles", "Attach keynote speaker names, professional titles, company affiliations, bios, and headshot photos.")
    add_bullet(doc, "Capacity Controls", "Set maximum attendee capacity caps to prevent hall overcrowding in accordance with municipal fire codes.")
    add_bullet(doc, "Live Schedule Broadcasts", "In the event of an unavoidable speaker delay or room reassignment, organizers edit the session in the dashboard. The update is instantly broadcast via Socket.io to all registered attendee schedules, triggering a push notification banner on their mobile screens.")

    add_heading_2(doc, "3.6 Real-Time Analytics & Executive Performance Reporting")
    add_body(doc, "EventSphere equips event executives with boardroom-ready intelligence metrics updated in real time:")
    add_bullet(doc, "Total Footfall & Pacing", "Tracks live attendee entries through registration turnstiles against historic benchmarks.")
    add_bullet(doc, "Booth Occupancy Heatmap", "Identifies highest-density pedestrian zones, revealing which aisles experienced maximum dwell time.")
    add_bullet(doc, "Session Popularity Rankings", "Monitors bookmark counts and live attendance percentages across all conference tracks.")
    add_bullet(doc, "Revenue Tracking", "Aggregates gross booth sponsorship fees, VIP pass sales, and outstanding exhibitor balances.")
    add_bullet(doc, "One-Click Report Export", "Generate comprehensive CSV data dumps and executive PDF summary packets ready for board presentations.")

    # ==================== CHAPTER 4 ====================
    add_heading_1(doc, "Chapter 4: Exhibitor Portal & Digital Showcase Studio")
    
    add_heading_2(doc, "4.1 Exhibitor Portal Overview")
    add_body(doc, "The Exhibitor Portal provides participating corporations with a self-service studio to manage their physical booth operations, launch digital product showcases, and capture attendee leads.")
    
    add_image_figure(doc, "ui_mockup_exhibitor_portal.png", "Figure 4.1: EventSphere Exhibitor Portal & Digital Product Showcase Studio")

    add_heading_2(doc, "4.2 Registration & Corporate Profile Management")
    add_body(doc, "Upon receiving approval from the organizer, exhibitors establish their brand profile:")
    add_bullet(doc, "Corporate Metadata", "Input company trading name, industry vertical, corporate headquarters address, official website, and executive summary.")
    add_bullet(doc, "Brand Assets", "Upload high-resolution corporate logos, booth branding graphics, and product brochures in PDF format.")
    add_bullet(doc, "Booth Staff Roster", "Register names, titles, and email addresses of all on-site representatives to automatically issue on-site staff credentials.")
    add_bullet(doc, "Utility Requests", "Specify on-site power requirements (e.g., 110V 15A standard vs 220V 30A heavy machinery), hardwired Gigabit Ethernet drops, or specialized plumbing hookups.")

    add_heading_2(doc, "4.3 Interactive Booth Selection & Reservation Studio")
    add_body(doc, "Exhibitors enjoy full transparency when reserving their physical exhibition presence:")
    add_bullet(doc, "Live 2D Floor Plan Navigation", "Exhibitors pan and zoom across the active exhibition hall floor plan, reviewing booth proximity to keynote stages, high-traffic entryways, and competitor booths.")
    add_bullet(doc, "Instant Reserve Hold", "Clicking an available green booth locks a temporary 15-minute reservation hold. This prevents race conditions where two exhibitors attempt to reserve the same prime corner booth simultaneously.")
    add_bullet(doc, "Application Submission", "The exhibitor confirms utility needs and submits the reservation request directly into the Organizer's vetting queue.")

    add_heading_2(doc, "4.4 Digital Product Catalog & Services Showcase")
    add_body(doc, "Exhibiting companies can feature their entire commercial product portfolio within the Attendee Discovery directory:")
    add_bullet(doc, "Product Creation", "Add product name, category tags, promotional image, full technical specification, and price point.")
    add_bullet(doc, "Downloadable Collateral", "Attach digital whitepapers, case studies, and spec sheets that attendees can save to their digital briefcase.")
    add_bullet(doc, "Featured Product Pinning", "Highlight up to three flagship innovations at the top of the company's attendee-facing showcase card.")

    add_heading_2(doc, "4.5 Real-Time B2B Inquiries & Cross-Exhibitor Collaboration")
    add_body(doc, "Commercial success at trade shows depends on rapid communication. EventSphere provides two integrated messaging channels:")
    add_bullet(doc, "Attendee Lead Inquiries", "When an attendee views an exhibitor's showcase, they can submit an instant inquiry or request a 1:1 meeting. Inquiries appear in real time on the exhibitor's lead dashboard.")
    add_bullet(doc, "Neighboring Exhibitor Collaboration", "Exhibitors can view neighboring booths along their aisle and initiate direct communication. This allows neighboring teams to coordinate booth sound levels, share storage logistics, and cross-promote complementary technologies.")
    add_bullet(doc, "Direct Organizer Support Desk", "Exhibitors have a direct line to the floor marshal and organizer operations desk to report utility issues (e.g., power trip, Wi-Fi outage) and receive immediate assistance.")

    # ==================== CHAPTER 5 ====================
    add_heading_1(doc, "Chapter 5: Attendee Interactive Companion Interface")
    
    add_heading_2(doc, "5.1 Attendee Experience Overview")
    add_body(doc, "The Attendee Companion Interface is a modern, responsive web application designed for seamless performance across mobile devices, tablets, and laptops. It guides attendees through discovery, registration, physical hall navigation, and educational session tracking.")
    
    add_image_figure(doc, "ui_mockup_attendee_experience.png", "Figure 5.1: Attendee Companion Portal: Multi-Facet Search & Agenda Bookmarks")

    add_heading_2(doc, "5.2 Expo Discovery & Digital Entry Pass Issuance")
    add_body(doc, "1. Browsing Active Expos: Attendees explore upcoming expos, reviewing featured keynote speakers, exhibiting brands, and venue details.")
    add_body(doc, "2. One-Click Event Registration: Attendees register with a single click. The system immediately generates an official digital registration credential.")
    
    add_image_figure(doc, "attendee_digital_pass.png", "Figure 5.2: Attendee Digital QR Access Pass & Security Hash Verification Mockup")
    
    add_body(doc, "3. Digital Pass Security Features: As shown in Figure 5.2, each attendee pass features a high-density 2D QR barcode, unique Ticket ID, pass tier indicator (e.g. VIP All-Access, General Delegate), and cryptographic SHA-256 verification hash. On-site staff scan the QR code to process turnstile check-ins in under 1 second.")

    add_heading_2(doc, "5.3 Intelligent Exhibitor Search & Interactive Hall Locator")
    add_body(doc, "With hundreds of exhibiting companies, EventSphere ensures attendees never miss relevant solutions:")
    add_bullet(doc, "Multi-Facet Filtering", "Filter exhibitors by industrial vertical (e.g., FinTech, CyberSecurity, Blockchain), product keyword, or physical hall wing.")
    add_bullet(doc, "Instant 'Locate on Map'", "Clicking the 'Locate on Map' button on any exhibitor card automatically transitions the user to the 2D floor plan, zooms in, and pulses a glowing beacon over that exhibitor's physical booth space.")
    add_bullet(doc, "1:1 Appointment Scheduling", "Attendees can request pre-scheduled 15-minute product demonstrations directly at the exhibitor's booth, eliminating wasted transit time.")

    add_heading_2(doc, "5.4 Master Agenda Browsing & Personalized Schedule Timetable")
    add_body(doc, "Conference tracks feature dozens of overlapping workshops and keynotes:")
    add_bullet(doc, "Timeline Exploration", "Attendees filter sessions by date, time slot, track category, or speaker.")
    add_bullet(doc, "One-Click Bookmarking", "Clicking 'Bookmark' saves a session into the attendee's personal 'My Timetable' view.")
    add_bullet(doc, "Automated Lead-Time Reminders", "The system calculates 15-minute lead times and dispatches push notification reminders so attendees never miss critical keynotes.")
    add_bullet(doc, "Calendar Sync", "Attendees can export their personalized schedule to Google Calendar, Apple Calendar, or Microsoft Outlook via standardized .ics files.")

    # ==================== CHAPTER 6 ====================
    add_heading_1(doc, "Chapter 6: General Platform Features & System Capabilities")
    
    add_heading_2(doc, "6.1 Real-Time Synchronization Engine (WebSocket Architecture)")
    add_body(doc, "Unlike legacy event portals that require constant manual page refreshes, EventSphere is powered by a persistent bi-directional WebSocket engine using Socket.io. Any state change on the server—such as a booth reservation, a schedule delay, or a direct chat message—is broadcast to all connected clients in real time.")
    
    add_heading_2(doc, "6.2 User Feedback & Helpdesk Support Mechanism")
    add_body(doc, "Continuous user feedback is vital to operational excellence:")
    add_bullet(doc, "Built-In Feedback Modal", "Accessible from the footer on any page, users can submit bug reports, feature suggestions, or on-site facility requests (e.g. temperature adjustments, restroom maintenance).")
    add_bullet(doc, "Urgent Floor Marshal Dispatch", "Exhibitors experiencing urgent technical emergencies (e.g. power loss, network drop) can flag tickets as 'URGENT', triggering an immediate audible alert in the Organizer Command Center.")

    # ==================== CHAPTER 7 ====================
    add_heading_1(doc, "Chapter 7: Non-Functional Guarantees from a User Perspective")
    add_body(doc, "To ensure enterprise reliability, EventSphere complies with strict non-functional service level agreements:")
    
    nfr_headers = ["Category", "Metric / Specification", "User Impact & Experience Benefit"]
    nfr_data = [
        ["Performance", "API latency < 1.2s; WebSocket events < 80ms", "Instantaneous UI responsiveness without screen lag or freeze."],
        ["Scalability", "5,000+ concurrent active sessions per cluster", "Seamless operation during morning keynote surges and registration rushes."],
        ["Data Security", "TLS 1.3 in-transit; bcrypt salt work factor 10 at rest", "Bank-grade protection of user credentials and financial records."],
        ["Privacy & Consent", "Strict GDPR compliance; user data export/erasure", "Attendees and exhibitors maintain total sovereignty over contact data."],
        ["High Availability", "99.9% uptime SLA with automated replica failover", "Zero downtime during live trade show execution hours."],
        ["Cross-Device Usability", "WCAG 2.1 AA accessibility; responsive down to 320px", "Flawless operation on iPhone, Android, iPad, and desktop workstations."]
    ]
    style_table(doc, doc.add_table(rows=1, cols=3), [1.5, 2.3, 2.7], nfr_headers, nfr_data)

    # ==================== CHAPTER 8 ====================
    add_heading_1(doc, "Chapter 8: Hands-On Operational Step-by-Step Tutorials")
    
    add_heading_2(doc, "Tutorial 1: Complete Organizer Workflow - Launching a 100-Booth Expo")
    add_body(doc, "Scenario: The event operations team is preparing to launch the 'Global FinTech & Digital Banking Forum 2026' in Hall 4 of the Convention Center:")
    add_bullet(doc, "Step 1", "Log into EventSphere with organizer credentials. Access the 'Organizer Command Center'.")
    add_bullet(doc, "Step 2", "Click 'Create New Expo'. Fill in the title, category ('FinTech'), venue ('Hall 4, Javits Center'), and dates (Nov 14-17, 2026). Upload promotional banner.")
    add_bullet(doc, "Step 3", "Open 'Floor Plan Designer'. Input 100 target booths across 5 rows and 20 columns. Set aisle width to 12 feet. Click 'Generate Grid'.")
    add_bullet(doc, "Step 4", "Designate Booths A-1 through A-5 as 'Island Flagship Pavilions' ($15,000). Set perimeter booths as 'Standard In-Line' ($2,000).")
    add_bullet(doc, "Step 5", "Place the 'Main Stage' landmark at the north wall and 'Registration Desks' at the south entrance. Click 'Save & Publish Floor'.")
    add_bullet(doc, "Step 6", "Open 'Session Scheduler'. Add 'Opening Keynote: Autonomous Global Finance' scheduled for Day 1 at 10:00 AM on the Main Stage.")
    add_bullet(doc, "Step 7", "Toggle Expo status to 'Active'. The expo is now live for commercial exhibitor reservations and attendee registrations!")

    add_heading_2(doc, "Tutorial 2: Complete Exhibitor Workflow - Booth Booking & Showcase Setup")
    add_body(doc, "Scenario: FinWave AI Analytics wishes to reserve Booth B-04 and showcase their enterprise predictive underwriting model:")
    add_bullet(doc, "Step 1", "Register as an Exhibitor. Verify email and log into the Exhibitor Portal.")
    add_bullet(doc, "Step 2", "In 'Company Profile', upload the FinWave logo, input company website, and list on-site staff members.")
    add_bullet(doc, "Step 3", "Navigate to 'Floor Plan & Booth Booking'. Browse the 2D map for 'Global FinTech Forum 2026'. Locate Booth B-04 (Corner 20x20 ft).")
    add_bullet(doc, "Step 4", "Click Booth B-04. The booth turns amber (Hold). Select 220V power hookup and click 'Submit Application'.")
    add_bullet(doc, "Step 5", "Once the Organizer approves the application, Booth B-04 turns red (Occupied - Confirmed).")
    add_bullet(doc, "Step 6", "Open 'Product Catalog'. Add 'FinWave Predict™ v4.2' with product imagery, technical PDF specs, and pricing.")
    add_bullet(doc, "Step 7", "Open 'Lead Inquiries'. Respond to incoming attendee meeting requests and coordinate with neighboring exhibitors.")

    add_heading_2(doc, "Tutorial 3: Complete Attendee Workflow - Registration, Navigation & Bookmarking")
    add_body(doc, "Scenario: An attendee arrives at the convention and wants to plan their daily educational and exhibition itinerary:")
    add_bullet(doc, "Step 1", "Log into the Attendee Companion Portal from a mobile smartphone or tablet.")
    add_bullet(doc, "Step 2", "Locate 'Global FinTech Forum 2026' and click 'Register for Expo'. Access 'My Digital Badge' to display the QR entry code at turnstiles.")
    add_bullet(doc, "Step 3", "Open 'Conference Schedule'. Filter by 'AI Track'. Locate the 10:00 AM Keynote. Click 'Bookmark Session'.")
    add_bullet(doc, "Step 4", "Open 'Exhibitor Directory'. Search keyword 'Credit Scoring'. Select 'FinWave AI Analytics'.")
    add_bullet(doc, "Step 5", "Click 'Locate on Map'. The 2D floor plan opens, highlighting Booth B-04 in bright cyan with a glowing pin.")
    add_bullet(doc, "Step 6", "Click 'Book 1:1 Meeting' to request an appointment with FinWave's engineering staff for 11:30 AM.")

    # ==================== CHAPTER 9 ====================
    add_heading_1(doc, "Chapter 9: Frequently Asked Questions & Operational Troubleshooting")
    add_body(doc, "Below are solutions to 25 common operational questions encountered by Organizers, Exhibitors, and Attendees:")

    faqs = [
        ("Organizer FAQ 1", "How do I resolve a booth double-booking conflict?", "The system enforces atomic database transactions that prevent two exhibitors from reserving the same booth simultaneously. If an organizer manually reassigns a booth, the displaced exhibitor is automatically credited and notified via priority message to select an alternate space."),
        ("Organizer FAQ 2", "Can I edit an expo after tickets have already been issued?", "Yes. Organizers can update venue descriptions, rules, and schedules at any time. However, changing core dates triggers an automated broadcast warning to all registered ticket holders."),
        ("Organizer FAQ 3", "How do I export final attendee registration manifests for on-site security?", "From the Organizer Command Center, navigate to 'Analytics & Reports' and click 'Export Full Attendee Manifest (CSV)'. The file includes Attendee Name, Organization, Ticket Tier, and Check-in Status."),
        ("Organizer FAQ 4", "Can I revoke an approved exhibitor's booth space?", "Yes. Organizers can access the Exhibitor Vetting tab, locate the confirmed exhibitor, and select 'Revoke Allocation'. This releases the booth back to 'Available' (Green)."),
        ("Organizer FAQ 5", "How do I broadcast an emergency evacuation notice or hall closure?", "Organizers have an 'Urgent Broadcast' button in the dashboard that transmits an immediate visual takeover banner to all connected web clients and sends SMS/email alerts."),
        ("Exhibitor FAQ 1", "Why does my requested booth show as 'Pending / Reserved'?", "Booths remain in 'Pending' status (Amber) until the event organizer verifies your business registration documents and electrical requirements. Approval typically completes within 24 business hours."),
        ("Exhibitor FAQ 2", "Can I upgrade my booth from Standard to Premium after approval?", "To upgrade, contact the Organizer directly via the portal messaging tool. The organizer will revoke the standard allocation and assign the premium space."),
        ("Exhibitor FAQ 3", "How do I request high-voltage 3-phase power for industrial machinery?", "During booth checkout or via the 'Utility Requests' section of the Exhibitor Profile, specify the required voltage (220V/440V) and wattage. Permits will be reviewed by the venue engineer."),
        ("Exhibitor FAQ 4", "Can our booth representatives scan attendee badges on mobile devices?", "Yes. Exhibitor staff can open the EventSphere Lead Retrieval scanner within the portal and use their device camera to scan attendee QR codes, capturing contact details instantly."),
        ("Exhibitor FAQ 5", "How many products can we feature in our digital showcase?", "Standard tier exhibitors may feature up to 5 products; Premium and Island sponsors enjoy unlimited product listings with full media embeds."),
        ("Attendee FAQ 1", "Where do I locate my digital entry badge?", "Click 'My Digital Badge' in the top navigation bar. You will see a live QR code and Ticket ID that can be saved to your device or Apple/Google Wallet."),
        ("Attendee FAQ 2", "What happens if a keynote session I bookmarked is rescheduled?", "EventSphere immediately pushes a notification to your screen and automatically updates the session time in your 'My Timetable' view."),
        ("Attendee FAQ 3", "Can I cancel a registered session bookmark?", "Yes. Simply click the session card in your personal timetable and select 'Remove Bookmark'. The seat is immediately released back to the general delegate pool."),
        ("Attendee FAQ 4", "Is Wi-Fi provided inside the exhibition halls?", "Complimentary guest Wi-Fi details are displayed in the 'Event Information' tab of the Attendee Portal once your ticket check-in is verified on-site."),
        ("Attendee FAQ 5", "Can I transfer my conference pass to a corporate colleague?", "Pass transfers can be performed up to 48 hours prior to expo opening via the 'Account Settings' -> 'Transfer Pass' workflow.")
    ]
    for cat, q, ans in faqs:
        add_bullet(doc, f"{cat}: {q}", ans)

    # Save Document
    out_path = os.path.join(DOCS_DIR, "EventSphere_User_Documentation.docx")
    doc.save(out_path)
    print(f"Generated User Documentation successfully at: {out_path}")
    
    # Also copy to brain directory
    brain_out = os.path.join(BRAIN_DIR, "EventSphere_User_Documentation.docx")
    import shutil
    shutil.copyfile(out_path, brain_out)
    print(f"Copied to brain: {brain_out}")

if __name__ == "__main__":
    generate_user_doc()
