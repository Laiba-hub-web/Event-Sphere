import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Wedge

os.makedirs(r"docs\diagrams", exist_ok=True)

# 1. UI Mockup: Organizer Dashboard
def generate_organizer_ui_mockup():
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=200)
    ax.set_xlim(0, 1400)
    ax.set_ylim(0, 850)
    ax.axis("off")

    # Background window
    bg = FancyBboxPatch((0, 0), 1400, 850, boxstyle="round,pad=0,rounding_size=12", facecolor="#0B132B", edgecolor="#1C2541", lw=2)
    ax.add_patch(bg)

    # Top Navigation Bar
    topnav = Rectangle((0, 780), 1400, 70, facecolor="#1C2541")
    ax.add_patch(topnav)
    ax.text(30, 815, "EventSphere", fontsize=18, fontweight="bold", color="#48CAE4", va="center")
    ax.text(180, 815, "ORGANIZER COMMAND CENTER", fontsize=11, fontweight="bold", color="#90E0EF", va="center")

    # Nav links
    nav_items = ["Dashboard", "Expos & Floors", "Exhibitors (3 Pending)", "Master Schedule", "Analytics & Reports"]
    for i, item in enumerate(nav_items):
        color = "#00B4D8" if i == 0 else "#CBD5E1"
        weight = "bold" if i == 0 else "normal"
        ax.text(480 + i * 160, 815, item, fontsize=10, fontweight=weight, color=color, va="center")
        if i == 0:
            ax.plot([475, 545], [785, 785], color="#00B4D8", lw=3)

    # User badge
    ax.add_patch(Circle((1340, 815), 18, facecolor="#0077B6"))
    ax.text(1340, 815, "AD", fontsize=10, fontweight="bold", color="#FFFFFF", ha="center", va="center")
    ax.text(1240, 815, "Admin Console", fontsize=10, color="#FFFFFF", ha="right", va="center")

    # Sidebar
    sidebar = Rectangle((0, 0), 220, 780, facecolor="#111B33")
    ax.add_patch(sidebar)
    side_items = [
        ("Overview & Stats", True),
        ("Create New Expo", False),
        ("Floor Plan Designer", False),
        ("Exhibitor Vetting", False),
        ("Booth Allocation", False),
        ("Session Scheduler", False),
        ("Live Audience Polls", False),
        ("Financial Reports", False),
        ("System Audit Logs", False),
        ("Platform Settings", False)
    ]
    for i, (title, active) in enumerate(side_items):
        y = 730 - i * 48
        if active:
            ax.add_patch(FancyBboxPatch((10, y - 16), 200, 34, boxstyle="round,pad=0,rounding_size=6", facecolor="#0077B6"))
            ax.text(25, y, title, fontsize=10, fontweight="bold", color="#FFFFFF", va="center")
        else:
            ax.text(25, y, title, fontsize=9.5, color="#94A3B8", va="center")

    # Main Header
    ax.text(250, 740, "Global FinTech & Digital Banking Forum 2026", fontsize=16, fontweight="bold", color="#FFFFFF")
    ax.text(250, 718, "Status: Active • Venue: Hall 4, Javits Convention Center • Dates: Nov 14-17, 2026", fontsize=9.5, color="#94A3B8")

    # 4 KPI Cards
    kpis = [
        ("Total Booths", "120", "84 Reserved (70%)", "#00B4D8", "#03045E"),
        ("Approved Exhibitors", "78", "+12 this week", "#2A9D8F", "#1D3557"),
        ("Registered Attendees", "3,450", "Target: 4,000 (86%)", "#E76F51", "#3D1308"),
        ("Total Revenue", "$284,500", "+18% vs 2025 Expo", "#E9C46A", "#3A3310")
    ]
    for i, (title, val, sub, border_col, bg_col) in enumerate(kpis):
        x = 250 + i * 280
        y = 610
        card = FancyBboxPatch((x, y), 260, 85, boxstyle="round,pad=0,rounding_size=8", facecolor="#16223F", edgecolor=border_col, lw=1.5)
        ax.add_patch(card)
        ax.text(x + 15, y + 62, title, fontsize=9, fontweight="bold", color="#94A3B8")
        ax.text(x + 15, y + 36, val, fontsize=18, fontweight="bold", color="#FFFFFF")
        ax.text(x + 15, y + 14, sub, fontsize=8.5, color=border_col)

    # Floor Plan Interactive Preview Widget (Left Panel)
    panel1 = FancyBboxPatch((250, 200), 540, 390, boxstyle="round,pad=0,rounding_size=8", facecolor="#16223F", edgecolor="#2D3B60", lw=1)
    ax.add_patch(panel1)
    ax.text(270, 565, "Interactive Floor Plan & Allocation Studio", fontsize=12, fontweight="bold", color="#FFFFFF")
    ax.text(710, 565, "[ Fullscreen Editor ]", fontsize=9, fontweight="bold", color="#48CAE4")

    # Mini floor layout preview inside card
    mini_floor = Rectangle((270, 220), 500, 320, facecolor="#0B132B", edgecolor="#334155")
    ax.add_patch(mini_floor)

    # Entrance and Stage indicators
    ax.add_patch(FancyBboxPatch((280, 500), 100, 25, boxstyle="round,pad=0,rounding_size=4", facecolor="#1E3A8A"))
    ax.text(330, 512, "MAIN STAGE", fontsize=7.5, fontweight="bold", color="#FFFFFF", ha="center", va="center")

    ax.add_patch(FancyBboxPatch((650, 230), 100, 25, boxstyle="round,pad=0,rounding_size=4", facecolor="#065F46"))
    ax.text(700, 242, "REGISTRATION", fontsize=7.5, fontweight="bold", color="#FFFFFF", ha="center", va="center")

    # Booths Grid inside mini-floor
    for row in range(3):
        for col in range(5):
            bx = 310 + col * 90
            by = 430 - row * 85
            # status
            if (row == 0 and col == 0) or (row == 1 and col == 3):
                col_b = "#EF4444" # Occupied
                status_txt = "OCCUPIED"
            elif (row == 0 and col == 2) or (row == 2 and col == 1):
                col_b = "#F59E0B" # Reserved
                status_txt = "PENDING"
            else:
                col_b = "#10B981" # Available
                status_txt = "FREE"

            b_rect = FancyBboxPatch((bx, by), 70, 55, boxstyle="round,pad=0,rounding_size=4", facecolor="#1E293B", edgecolor=col_b, lw=1.5)
            ax.add_patch(b_rect)
            ax.text(bx + 35, by + 36, f"B-{row*5 + col + 1}", fontsize=8, fontweight="bold", color="#FFFFFF", ha="center")
            ax.text(bx + 35, by + 18, status_txt, fontsize=6.5, color=col_b, ha="center")

    # Right Top Panel: Pending Exhibitor Applications
    panel2 = FancyBboxPatch((810, 395), 560, 195, boxstyle="round,pad=0,rounding_size=8", facecolor="#16223F", edgecolor="#2D3B60", lw=1)
    ax.add_patch(panel2)
    ax.text(830, 565, "Pending Exhibitor Applications (Vetting Queue)", fontsize=11, fontweight="bold", color="#FFFFFF")

    # Table header
    ax.text(830, 535, "COMPANY", fontsize=8, fontweight="bold", color="#94A3B8")
    ax.text(990, 535, "CATEGORY", fontsize=8, fontweight="bold", color="#94A3B8")
    ax.text(1110, 535, "REQUESTED", fontsize=8, fontweight="bold", color="#94A3B8")
    ax.text(1230, 535, "ACTIONS", fontsize=8, fontweight="bold", color="#94A3B8")
    ax.plot([830, 1350], [525, 525], color="#2D3B60", lw=1)

    exhibitor_queue = [
        ("FinWave AI Analytics", "FinTech / BigData", "Booth B-04 (Premium)", "Approve | Reject"),
        ("QuantumPay Gateways", "Payment Solutions", "Booth A-02 (Standard)", "Approve | Reject"),
        ("CyberShield Defense", "Cybersecurity", "Booth C-08 (Island)", "Approve | Reject")
    ]
    for idx, (comp, cat, bth, act) in enumerate(exhibitor_queue):
        yy = 495 - idx * 36
        ax.text(830, yy, comp, fontsize=9, fontweight="bold", color="#FFFFFF")
        ax.text(990, yy, cat, fontsize=8.5, color="#CBD5E1")
        ax.text(1110, yy, bth, fontsize=8, color="#F59E0B")

        # Action buttons
        ax.add_patch(FancyBboxPatch((1220, yy - 6), 55, 20, boxstyle="round,pad=0,rounding_size=3", facecolor="#059669"))
        ax.text(1247, yy + 4, "Approve", fontsize=7.5, fontweight="bold", color="#FFFFFF", ha="center")
        ax.add_patch(FancyBboxPatch((1285, yy - 6), 50, 20, boxstyle="round,pad=0,rounding_size=3", facecolor="#DC2626"))
        ax.text(1310, yy + 4, "Reject", fontsize=7.5, fontweight="bold", color="#FFFFFF", ha="center")

    # Right Bottom Panel: Live Schedule & Session Monitor
    panel3 = FancyBboxPatch((810, 200), 560, 180, boxstyle="round,pad=0,rounding_size=8", facecolor="#16223F", edgecolor="#2D3B60", lw=1)
    ax.add_patch(panel3)
    ax.text(830, 355, "Live Keynote & Workshop Schedule Monitor", fontsize=11, fontweight="bold", color="#FFFFFF")

    sessions_data = [
        ("10:00 AM - 11:15 AM", "Opening Keynote: The Future of Autonomous Finance", "Main Stage", "480 Attendees (96% Cap)", "#10B981"),
        ("11:30 AM - 12:45 PM", "Panel: Next-Gen Fraud Prevention with Deep Learning", "Auditorium B", "320 Attendees (80% Cap)", "#3B82F6"),
        ("02:00 PM - 03:15 PM", "Workshop: Scalable Decentralized Ledger APIs", "Workshop Lab 1", "150 Attendees (FULL)", "#EF4444")
    ]
    for idx, (tm, title, loc, cap, dot_col) in enumerate(sessions_data):
        yy = 320 - idx * 40
        ax.add_patch(Circle((840, yy + 5), 4, facecolor=dot_col))
        ax.text(855, yy + 5, tm, fontsize=8, fontweight="bold", color="#94A3B8")
        ax.text(975, yy + 5, title[:42] + ("..." if len(title)>42 else ""), fontsize=8.5, fontweight="bold", color="#FFFFFF")
        ax.text(1220, yy + 5, loc, fontsize=8, color="#00B4D8")
        ax.text(1290, yy + 5, cap, fontsize=7.5, color=dot_col)

    # Bottom status bar
    botbar = Rectangle((0, 0), 1400, 30, facecolor="#0B132B", edgecolor="#1C2541")
    ax.add_patch(botbar)
    ax.text(30, 15, "EventSphere System Engine v2.4.0 • Node.js / Express / Socket.io Backend Connected • Response Time: 42ms • SSL Encrypted", fontsize=8.5, color="#64748B", va="center")
    ax.text(1370, 15, "Database: MongoDB Atlas Cluster • Replica Status: HEALTHY", fontsize=8.5, color="#10B981", ha="right", va="center")

    plt.tight_layout()
    path = r"docs\diagrams\ui_mockup_organizer_dashboard.png"
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved ui_mockup_organizer_dashboard.png")

# 2. UI Mockup: Exhibitor Portal
def generate_exhibitor_ui_mockup():
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=200)
    ax.set_xlim(0, 1400)
    ax.set_ylim(0, 850)
    ax.axis("off")

    # Background
    bg = FancyBboxPatch((0, 0), 1400, 850, boxstyle="round,pad=0,rounding_size=12", facecolor="#0F172A", edgecolor="#1E293B", lw=2)
    ax.add_patch(bg)

    # Topbar
    topnav = Rectangle((0, 780), 1400, 70, facecolor="#1E293B")
    ax.add_patch(topnav)
    ax.text(30, 815, "EventSphere", fontsize=18, fontweight="bold", color="#38BDF8", va="center")
    ax.text(180, 815, "EXHIBITOR PORTAL & SHOWCASE STUDIO", fontsize=11, fontweight="bold", color="#7DD3FC", va="center")

    # Nav
    navs = ["My Showcase", "Floor Plan & Booth Booking", "Product Catalog", "Lead Inquiries (14)", "B2B Messages", "Support"]
    for i, itm in enumerate(navs):
        col = "#38BDF8" if i == 0 else "#CBD5E1"
        ax.text(500 + i * 140, 815, itm, fontsize=9.5, fontweight="bold" if i==0 else "normal", color=col, va="center")
        if i == 0:
            ax.plot([495, 590], [785, 785], color="#38BDF8", lw=3)

    # Profile top right
    ax.add_patch(Circle((1340, 815), 18, facecolor="#0284C7"))
    ax.text(1340, 815, "FW", fontsize=10, fontweight="bold", color="#FFFFFF", ha="center", va="center")
    ax.text(1240, 815, "FinWave AI Analytics", fontsize=10, color="#FFFFFF", ha="right", va="center")

    # Left Column: Profile Card & Booth Badge
    prof_card = FancyBboxPatch((40, 200), 380, 550, boxstyle="round,pad=0,rounding_size=10", facecolor="#1E293B", edgecolor="#334155", lw=1)
    ax.add_patch(prof_card)

    # Profile Avatar / Logo placeholder
    ax.add_patch(FancyBboxPatch((70, 650), 90, 80, boxstyle="round,pad=0,rounding_size=8", facecolor="#0284C7"))
    ax.text(115, 690, "LOGO", fontsize=14, fontweight="bold", color="#FFFFFF", ha="center", va="center")

    ax.text(180, 715, "FinWave AI Analytics", fontsize=14, fontweight="bold", color="#FFFFFF")
    ax.text(180, 695, "Category: FinTech & Predictive AI", fontsize=9, color="#94A3B8")
    ax.text(180, 675, "Global FinTech Forum 2026", fontsize=8.5, color="#38BDF8")

    # Assigned Booth Badge
    ax.add_patch(FancyBboxPatch((70, 560), 320, 65, boxstyle="round,pad=0,rounding_size=6", facecolor="#0F172A", edgecolor="#10B981", lw=1.5))
    ax.text(85, 605, "ASSIGNED BOOTH SPACE", fontsize=8, fontweight="bold", color="#10B981")
    ax.text(85, 580, "Booth B-04 • Premium Corner (20x20 ft)", fontsize=11, fontweight="bold", color="#FFFFFF")
    ax.text(320, 580, "$4,500 PAID", fontsize=9, fontweight="bold", color="#34D399")

    # Company Details Form Inputs Preview
    fields = [
        ("Primary Contact Name", "Dr. Alexander Wright"),
        ("Contact Email", "a.wright@finwave-analytics.io"),
        ("Phone Number", "+1 (555) 349-8821"),
        ("Website", "https://finwave-analytics.io"),
        ("On-Site Booth Staff Count", "4 Certified Specialists"),
        ("Electrical Hookup (kW)", "3-Phase 220V (10 kW Dedicated)")
    ]
    for i, (lbl, val) in enumerate(fields):
        yy = 520 - i * 48
        ax.text(70, yy + 16, lbl, fontsize=8, fontweight="bold", color="#94A3B8")
        ax.add_patch(FancyBboxPatch((70, yy - 12), 320, 24, boxstyle="round,pad=0,rounding_size=4", facecolor="#0F172A", edgecolor="#334155"))
        ax.text(80, yy, val, fontsize=8.5, color="#F8FAFC")

    # Save Profile Button
    ax.add_patch(FancyBboxPatch((70, 220), 320, 36, boxstyle="round,pad=0,rounding_size=6", facecolor="#0284C7"))
    ax.text(230, 238, "Update Company Profile", fontsize=10, fontweight="bold", color="#FFFFFF", ha="center", va="center")

    # Center Panel: Product & Service Showcase Catalog
    prod_panel = FancyBboxPatch((450, 480), 520, 270, boxstyle="round,pad=0,rounding_size=10", facecolor="#1E293B", edgecolor="#334155", lw=1)
    ax.add_patch(prod_panel)
    ax.text(470, 725, "Product & Service Showcase (Attendee-Facing)", fontsize=12, fontweight="bold", color="#FFFFFF")
    ax.text(880, 725, "+ Add New Product", fontsize=9, fontweight="bold", color="#38BDF8")

    products = [
        ("FinWave Predict™ v4.2", "Autonomous loan underwriting model with 99.4% precision.", "$25k/yr enterprise license"),
        ("RiskGuard Real-Time Shield", "Sub-millisecond anti-fraud transaction screening engine.", "$18k/yr cloud SaaS"),
        ("OmniLedger Compliance SDK", "Automated AML/KYC audit trails for banking institutions.", "$12k/yr integration")
    ]
    for i, (pname, pdesc, pprice) in enumerate(products):
        yy = 665 - i * 65
        ax.add_patch(FancyBboxPatch((470, yy - 20), 480, 52, boxstyle="round,pad=0,rounding_size=6", facecolor="#0F172A", edgecolor="#2D3B60"))
        ax.add_patch(Circle((495, yy + 6), 14, facecolor="#0369A1"))
        ax.text(495, yy + 6, str(i+1), fontsize=9, fontweight="bold", color="#FFFFFF", ha="center", va="center")
        ax.text(525, yy + 12, pname, fontsize=9.5, fontweight="bold", color="#FFFFFF")
        ax.text(525, yy - 3, pdesc, fontsize=8, color="#94A3B8")
        ax.text(935, yy + 5, pprice, fontsize=8, fontweight="bold", color="#38BDF8", ha="right")

    # Center-Bottom Panel: Floor Space Selector Widget
    floor_widget = FancyBboxPatch((450, 200), 520, 260, boxstyle="round,pad=0,rounding_size=10", facecolor="#1E293B", edgecolor="#334155", lw=1)
    ax.add_patch(floor_widget)
    ax.text(470, 435, "Floor Plan View & Neighboring Booth Collaboration", fontsize=11, fontweight="bold", color="#FFFFFF")

    # Visual mini map
    ax.add_patch(Rectangle((470, 220), 480, 190, facecolor="#0F172A", edgecolor="#334155"))
    # draw neighbors
    ax.add_patch(FancyBboxPatch((490, 290), 90, 70, boxstyle="round,pad=0,rounding_size=4", facecolor="#1E293B", edgecolor="#64748B"))
    ax.text(535, 335, "Booth B-03", fontsize=8, fontweight="bold", color="#CBD5E1", ha="center")
    ax.text(535, 315, "CloudTrust", fontsize=7.5, color="#94A3B8", ha="center")
    ax.text(535, 298, "[Message]", fontsize=7, color="#38BDF8", ha="center")

    # Our booth
    ax.add_patch(FancyBboxPatch((600, 290), 100, 70, boxstyle="round,pad=0,rounding_size=4", facecolor="#0284C7", edgecolor="#38BDF8", lw=2))
    ax.text(650, 335, "Booth B-04 (YOU)", fontsize=8, fontweight="bold", color="#FFFFFF", ha="center")
    ax.text(650, 315, "FinWave AI", fontsize=8, color="#FFFFFF", ha="center")
    ax.text(650, 298, "20x20 ft Premium", fontsize=7, color="#E0F2FE", ha="center")

    # Neighbor 2
    ax.add_patch(FancyBboxPatch((720, 290), 90, 70, boxstyle="round,pad=0,rounding_size=4", facecolor="#1E293B", edgecolor="#64748B"))
    ax.text(765, 335, "Booth B-05", fontsize=8, fontweight="bold", color="#CBD5E1", ha="center")
    ax.text(765, 315, "PayMatrix", fontsize=7.5, color="#94A3B8", ha="center")
    ax.text(765, 298, "[Message]", fontsize=7, color="#38BDF8", ha="center")

    # Aisle label
    ax.text(650, 250, "<-- MAIN CENTRAL AISLE B (High Attendee Traffic) -->", fontsize=8, fontweight="bold", color="#E2E8F0", ha="center")

    # Right Panel: Real-Time B2B Inquiries & Messaging
    msg_panel = FancyBboxPatch((1000, 200), 360, 550, boxstyle="round,pad=0,rounding_size=10", facecolor="#1E293B", edgecolor="#334155", lw=1)
    ax.add_patch(msg_panel)
    ax.text(1020, 725, "Live Lead Inquiries & Messaging", fontsize=11, fontweight="bold", color="#FFFFFF")
    ax.text(1020, 705, "14 Inquiries • 3 New Today", fontsize=8.5, color="#34D399")

    # Chat preview
    chat_box = FancyBboxPatch((1020, 270), 320, 420, boxstyle="round,pad=0,rounding_size=6", facecolor="#0F172A", edgecolor="#334155")
    ax.add_patch(chat_box)

    # Chat messages
    # Msg 1: Attendee inquiry
    ax.add_patch(FancyBboxPatch((1035, 620), 220, 55, boxstyle="round,pad=0,rounding_size=6", facecolor="#334155"))
    ax.text(1045, 655, "Sarah Jenkins (VP Tech, Apex Capital):", fontsize=7.5, fontweight="bold", color="#38BDF8")
    ax.text(1045, 635, "Can we schedule a 15-min live demo\nat Booth B-04 on Day 2 morning?", fontsize=7.5, color="#FFFFFF")

    # Msg 2: Reply from exhibitor
    ax.add_patch(FancyBboxPatch((1115, 545), 220, 55, boxstyle="round,pad=0,rounding_size=6", facecolor="#0369A1"))
    ax.text(1125, 580, "FinWave Staff (You):", fontsize=7.5, fontweight="bold", color="#BAE6FD")
    ax.text(1125, 560, "Hi Sarah, absolutely! We have slotted\nyou for 10:30 AM on Nov 15.", fontsize=7.5, color="#FFFFFF")

    # Msg 3: Organizer message
    ax.add_patch(FancyBboxPatch((1035, 460), 260, 60, boxstyle="round,pad=0,rounding_size=6", facecolor="#1E3A8A"))
    ax.text(1045, 502, "Expo Operations Office (Organizer):", fontsize=7.5, fontweight="bold", color="#FDE047")
    ax.text(1045, 480, "Notice: Heavy machinery load-in window\nis scheduled from 6 AM to 8 AM Nov 14.", fontsize=7.5, color="#FFFFFF")

    # Message input area
    ax.add_patch(FancyBboxPatch((1020, 220), 240, 36, boxstyle="round,pad=0,rounding_size=4", facecolor="#0F172A", edgecolor="#334155"))
    ax.text(1030, 238, "Type inquiry reply...", fontsize=8.5, color="#64748B", va="center")
    ax.add_patch(FancyBboxPatch((1270, 220), 70, 36, boxstyle="round,pad=0,rounding_size=4", facecolor="#0284C7"))
    ax.text(1305, 238, "Send", fontsize=9, fontweight="bold", color="#FFFFFF", ha="center", va="center")

    # Bottom status bar
    botbar = Rectangle((0, 0), 1400, 30, facecolor="#0F172A", edgecolor="#1E293B")
    ax.add_patch(botbar)
    ax.text(30, 15, "EventSphere Exhibitor Studio • Active Session: FinWave AI Analytics • Socket.io: Connected • Real-Time Sync Enabled", fontsize=8.5, color="#64748B", va="center")

    plt.tight_layout()
    path = r"docs\diagrams\ui_mockup_exhibitor_portal.png"
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved ui_mockup_exhibitor_portal.png")

# 3. UI Mockup: Attendee Experience
def generate_attendee_ui_mockup():
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=200)
    ax.set_xlim(0, 1400)
    ax.set_ylim(0, 850)
    ax.axis("off")

    # Background
    bg = FancyBboxPatch((0, 0), 1400, 850, boxstyle="round,pad=0,rounding_size=12", facecolor="#F8FAFC", edgecolor="#CBD5E1", lw=2)
    ax.add_patch(bg)

    # Topbar
    topnav = Rectangle((0, 780), 1400, 70, facecolor="#0F172A")
    ax.add_patch(topnav)
    ax.text(30, 815, "EventSphere", fontsize=18, fontweight="bold", color="#38BDF8", va="center")
    ax.text(175, 815, "ATTENDEE COMPANION PORTAL", fontsize=11, fontweight="bold", color="#E2E8F0", va="center")

    navs = ["Discover Expos", "Exhibitors Directory", "Conference Schedule", "My Personal Timetable (4)", "Floor Map Locator", "My Digital Badge"]
    for i, itm in enumerate(navs):
        col = "#38BDF8" if i == 1 else "#CBD5E1"
        ax.text(480 + i * 140, 815, itm, fontsize=9, fontweight="bold" if i==1 else "normal", color=col, va="center")
        if i == 1:
            ax.plot([475, 595], [785, 785], color="#38BDF8", lw=3)

    # Attendee user badge
    ax.add_patch(Circle((1340, 815), 18, facecolor="#3B82F6"))
    ax.text(1340, 815, "JD", fontsize=10, fontweight="bold", color="#FFFFFF", ha="center", va="center")
    ax.text(1250, 815, "John Doe (VIP Pass)", fontsize=9.5, color="#FFFFFF", ha="right", va="center")

    # Hero / Search Filter Bar
    search_bar = FancyBboxPatch((40, 700), 1320, 60, boxstyle="round,pad=0,rounding_size=8", facecolor="#FFFFFF", edgecolor="#CBD5E1", lw=1)
    ax.add_patch(search_bar)
    ax.text(70, 730, "Search by Company, Product Keywords, or Booth Number...", fontsize=11, color="#64748B", va="center")
    ax.add_patch(FancyBboxPatch((600, 712), 160, 36, boxstyle="round,pad=0,rounding_size=4", facecolor="#F1F5F9", edgecolor="#CBD5E1"))
    ax.text(620, 730, "Category: All (FinTech)", fontsize=8.5, color="#334155", va="center")

    ax.add_patch(FancyBboxPatch((780, 712), 140, 36, boxstyle="round,pad=0,rounding_size=4", facecolor="#F1F5F9", edgecolor="#CBD5E1"))
    ax.text(800, 730, "Hall: Main Hall A", fontsize=8.5, color="#334155", va="center")

    ax.add_patch(FancyBboxPatch((1200, 712), 140, 36, boxstyle="round,pad=0,rounding_size=4", facecolor="#0284C7"))
    ax.text(1270, 730, "Find Exhibitors", fontsize=9.5, fontweight="bold", color="#FFFFFF", ha="center", va="center")

    # Left Column: Exhibitor Search Results
    ax.text(40, 665, "Featured Exhibitors & Interactive Showcases", fontsize=13, fontweight="bold", color="#0F172A")
    ax.text(420, 665, "Showing 78 Certified Exhibitors", fontsize=9.5, color="#64748B")

    exhibitor_cards = [
        ("FinWave AI Analytics", "Booth B-04", "AI & Predictive Scoring", "Next-gen credit risk models and sub-millisecond anti-fraud systems.", "#10B981"),
        ("QuantumPay Global", "Booth A-02", "Cross-Border Payments", "Instant settlement network powered by quantum-resilient encryption.", "#3B82F6"),
        ("CyberShield Defense", "Booth C-08", "Cybersecurity & Identity", "Enterprise zero-trust architecture and automated phishing mitigation.", "#8B5CF6"),
        ("BlockLedger Systems", "Booth D-12", "Decentralized Finance", "Compliant smart contract custody solutions for corporate banking.", "#F59E0B")
    ]

    for idx, (cname, bth, cat, desc, accent) in enumerate(exhibitor_cards):
        yy = 515 - idx * 105
        card = FancyBboxPatch((40, yy), 640, 95, boxstyle="round,pad=0,rounding_size=8", facecolor="#FFFFFF", edgecolor="#E2E8F0", lw=1)
        ax.add_patch(card)
        # Left accent stripe
        ax.add_patch(FancyBboxPatch((40, yy), 8, 95, boxstyle="round,pad=0,rounding_size=4", facecolor=accent))

        ax.text(60, yy + 72, cname, fontsize=11, fontweight="bold", color="#0F172A")
        # Booth pill
        ax.add_patch(FancyBboxPatch((280, yy + 62), 90, 20, boxstyle="round,pad=0,rounding_size=4", facecolor="#EFF6FF", edgecolor="#BFDBFE"))
        ax.text(325, yy + 72, bth, fontsize=8, fontweight="bold", color="#1D4ED8", ha="center", va="center")

        ax.text(390, yy + 72, cat, fontsize=8.5, color="#64748B")
        ax.text(60, yy + 42, desc, fontsize=8.5, color="#475569")

        # Action buttons
        ax.add_patch(FancyBboxPatch((60, yy + 12), 110, 22, boxstyle="round,pad=0,rounding_size=4", facecolor="#0284C7"))
        ax.text(115, yy + 23, "View Profile & Booth", fontsize=7.5, fontweight="bold", color="#FFFFFF", ha="center", va="center")

        ax.add_patch(FancyBboxPatch((185, yy + 12), 100, 22, boxstyle="round,pad=0,rounding_size=4", facecolor="#F1F5F9", edgecolor="#CBD5E1"))
        ax.text(235, yy + 23, "Locate on Map", fontsize=7.5, fontweight="bold", color="#334155", ha="center", va="center")

        ax.add_patch(FancyBboxPatch((295, yy + 12), 110, 22, boxstyle="round,pad=0,rounding_size=4", facecolor="#ECFDF5", edgecolor="#A7F3D0"))
        ax.text(350, yy + 23, "Book 1:1 Meeting", fontsize=7.5, fontweight="bold", color="#065F46", ha="center", va="center")

    # Right Column Top: Interactive Floor Plan Pinpoint
    map_box = FancyBboxPatch((710, 395), 650, 275, boxstyle="round,pad=0,rounding_size=8", facecolor="#FFFFFF", edgecolor="#CBD5E1", lw=1)
    ax.add_patch(map_box)
    ax.text(730, 645, "Live Interactive Floor Map (Booth B-04 Highlighted)", fontsize=11, fontweight="bold", color="#0F172A")
    ax.text(1250, 645, "[ Zoom + / - ]", fontsize=8.5, color="#0284C7")

    # Draw mini floor with pin
    ax.add_patch(Rectangle((730, 410), 610, 215, facecolor="#0F172A", edgecolor="#334155"))
    # Aisle markings
    ax.plot([730, 1340], [515, 515], color="#1E293B", lw=12)
    ax.text(1035, 515, "CENTRAL BOULEVARD AISLE", fontsize=7.5, color="#64748B", ha="center", va="center")

    # Booth boxes
    for col in range(6):
        bx = 760 + col * 90
        # top row
        ax.add_patch(Rectangle((bx, 535), 70, 70, facecolor="#1E293B", edgecolor="#475569"))
        ax.text(bx + 35, 570, f"A-{col+1}", fontsize=8, color="#94A3B8", ha="center")
        # bot row
        is_target = (col == 2)
        col_face = "#0284C7" if is_target else "#1E293B"
        col_edge = "#38BDF8" if is_target else "#475569"
        ax.add_patch(Rectangle((bx, 425), 70, 70, facecolor=col_face, edgecolor=col_edge, lw=2 if is_target else 1))
        ax.text(bx + 35, 460, f"B-{col+1}" if not is_target else "B-04\nHERE", fontsize=8, fontweight="bold" if is_target else "normal", color="#FFFFFF", ha="center")

    # Right Column Bottom: My Bookmarked Schedule & Keynote Reminders
    sched_box = FancyBboxPatch((710, 90), 650, 285, boxstyle="round,pad=0,rounding_size=8", facecolor="#FFFFFF", edgecolor="#CBD5E1", lw=1)
    ax.add_patch(sched_box)
    ax.text(730, 350, "My Bookmarked Agenda & Push Notifications", fontsize=11, fontweight="bold", color="#0F172A")
    ax.text(1220, 350, "Synced with Calendar", fontsize=8.5, color="#10B981")

    bookmarks = [
        ("10:00 AM - 11:15 AM", "Keynote: Autonomous Global Finance 2030", "Auditorium A", "Reminder: 15 mins before", "#10B981"),
        ("11:30 AM - 12:45 PM", "Executive Panel: AI-Driven Fraud Prevention", "Hall 2 Stage", "Reminder: 10 mins before", "#3B82F6"),
        ("02:00 PM - 03:00 PM", "Live Product Demo at Booth B-04 (FinWave)", "Booth B-04", "Booked 1:1 Meeting", "#8B5CF6")
    ]
    for idx, (tm, title, loc, rem, clr) in enumerate(bookmarks):
        yy = 285 - idx * 55
        ax.add_patch(FancyBboxPatch((730, yy), 610, 46, boxstyle="round,pad=0,rounding_size=6", facecolor="#F8FAFC", edgecolor="#E2E8F0"))
        ax.add_patch(Circle((750, yy + 23), 5, facecolor=clr))
        ax.text(765, yy + 23, tm, fontsize=8, fontweight="bold", color="#475569", va="center")
        ax.text(910, yy + 23, title, fontsize=8.5, fontweight="bold", color="#0F172A", va="center")
        ax.text(1180, yy + 23, loc, fontsize=8, color="#64748B", va="center")
        ax.add_patch(FancyBboxPatch((1240, yy + 12), 90, 22, boxstyle="round,pad=0,rounding_size=4", facecolor="#ECFDF5", edgecolor="#A7F3D0"))
        ax.text(1285, yy + 23, "Registered", fontsize=7.5, fontweight="bold", color="#065F46", ha="center", va="center")

    # Bottom status bar
    botbar = Rectangle((0, 0), 1400, 30, facecolor="#0F172A")
    ax.add_patch(botbar)
    ax.text(30, 15, "EventSphere Attendee Web Client • Push Notifications: Enabled • Location Services: Active • Live Expo Sync", fontsize=8.5, color="#94A3B8", va="center")

    plt.tight_layout()
    path = r"docs\diagrams\ui_mockup_attendee_experience.png"
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved ui_mockup_attendee_experience.png")

if __name__ == "__main__":
    generate_organizer_ui_mockup()
    generate_exhibitor_ui_mockup()
    generate_attendee_ui_mockup()
    print("All UI mockups generated successfully!")
