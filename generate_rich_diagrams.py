import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

IMG_DIR = r"c:\Users\dell\Desktop\EventSphere\docs\diagrams"
os.makedirs(IMG_DIR, exist_ok=True)

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#CBD5E1'
plt.rcParams['axes.linewidth'] = 1.0

def create_user_ecosystem():
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=250)
    ax.set_facecolor("#F8FAFC")
    fig.patch.set_facecolor("#F8FAFC")
    ax.axis("off")

    # Center Hub
    hub = patches.FancyBboxPatch((3.5, 3.8), 3.0, 1.3, boxstyle="round,pad=0.15", fc="#1E3A8A", ec="#0F172A", lw=2)
    ax.add_patch(hub)
    ax.text(5.0, 4.6, "EventSphere Enterprise OS", ha="center", va="center", color="#FFFFFF", weight="bold", fontsize=12)
    ax.text(5.0, 4.15, "Unified Real-Time Expo Hub", ha="center", va="center", color="#93C5FD", fontsize=9.5)

    # 3 Role Pillars
    pillars = [
        ("Organizers & Admins", "#1E3A8A", "#2563EB", 0.5, [
            "• Trade Show & Theme Lifecycle",
            "• 2D Visual Floor Plan Synthesis",
            "• Exhibitor Vetting & Allocation",
            "• Keynote Track & Agenda Builder",
            "• Real-Time Revenue & Telemetry"
        ]),
        ("Exhibitor Partners", "#065F46", "#059669", 3.75, [
            "• Digital Showcase & Product Specs",
            "• 2D Interactive Map Reservation",
            "• Lead Inquiries & Meeting Booking",
            "• B2B Neighbor Collaboration",
            "• Real-Time Eligibility Tracking"
        ]),
        ("Attendees & Delegates", "#581C87", "#7C3AED", 7.0, [
            "• Global Trade Show Discovery",
            "• Instant Digital QR Badges",
            "• Floor Map Wayfinding & Search",
            "• Personal Timetable & Reminders",
            "• Direct Chat & Post-Event Reviews"
        ])
    ]

    for title, border_col, header_col, x, points in pillars:
        body_box = patches.FancyBboxPatch((x, 0.4), 2.5, 2.7, boxstyle="round,pad=0.1", fc="#FFFFFF", ec=border_col, lw=2)
        ax.add_patch(body_box)
        hdr = patches.FancyBboxPatch((x, 2.65), 2.5, 0.45, boxstyle="round,pad=0.06", fc=header_col, ec=header_col)
        ax.add_patch(hdr)
        ax.text(x + 1.25, 2.87, title, ha="center", va="center", color="white", weight="bold", fontsize=9.5)

        y = 2.4
        for p in points:
            ax.text(x + 0.15, y, p, ha="left", va="center", color="#1E293B", fontsize=8.0)
            y -= 0.38

        ax.annotate('', xy=(x + 1.25, 3.15), xytext=(5.0, 3.8),
                    arrowprops=dict(arrowstyle="->", color="#3B82F6", lw=2, connectionstyle="arc3,rad=0.08"))

    plt.tight_layout()
    path = os.path.join(IMG_DIR, "user_platform_ecosystem.png")
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved user_platform_ecosystem.png")

def create_floor_plan_map():
    fig, ax = plt.subplots(figsize=(10, 6.0), dpi=250)
    ax.set_facecolor("#FFFFFF")
    fig.patch.set_facecolor("#FFFFFF")
    ax.axis("off")

    # Outer Hall Border
    hall = patches.Rectangle((0.2, 0.2), 9.6, 5.6, fc="#F8FAFC", ec="#94A3B8", lw=2)
    ax.add_patch(hall)
    ax.text(5.0, 5.5, "MAIN EXHIBITION HALL A — 2D INTERACTIVE BOOTH STUDIO", ha="center", va="center", color="#0F172A", weight="bold", fontsize=11)

    # Landmarks
    entrance = patches.FancyBboxPatch((0.6, 4.6), 2.5, 0.6, boxstyle="round,pad=0.05", fc="#EFF6FF", ec="#3B82F6", lw=1.5)
    ax.add_patch(entrance)
    ax.text(1.85, 4.9, "🧭 Main Entrance & Registration", ha="center", va="center", color="#1E3A8A", weight="bold", fontsize=8.5)

    stage = patches.FancyBboxPatch((3.7, 4.6), 2.6, 0.6, boxstyle="round,pad=0.05", fc="#F5F3FF", ec="#8B5CF6", lw=1.5)
    ax.add_patch(stage)
    ax.text(5.0, 4.9, "🎤 Main Keynote Stage & Audio", ha="center", va="center", color="#5B21B6", weight="bold", fontsize=8.5)

    lounge = patches.FancyBboxPatch((6.9, 4.6), 2.5, 0.6, boxstyle="round,pad=0.05", fc="#FEF3C7", ec="#F59E0B", lw=1.5)
    ax.add_patch(lounge)
    ax.text(8.15, 4.9, "☕ VIP B2B Networking Lounge", ha="center", va="center", color="#B45309", weight="bold", fontsize=8.5)

    # Booth Grid (4 Rows x 6 Cols)
    booths = [
        # Row A
        ("A-1", "TechCorp Auto.", "$1,500", "occupied", 0.6, 3.4),
        ("A-2", "BioGenix Rx", "$1,500", "occupied", 2.1, 3.4),
        ("A-3", "Available", "$1,500", "available", 3.6, 3.4),
        ("A-4", "QuantumLeap", "$1,500", "occupied", 5.1, 3.4),
        ("A-5", "Reserved", "$1,500", "reserved", 6.6, 3.4),
        ("A-6", "Apex Robotics", "$1,500", "occupied", 8.1, 3.4),
        # Row B
        ("B-1", "VoltDynamics", "$950", "occupied", 0.6, 2.3),
        ("B-2", "Available", "$950", "available", 2.1, 2.3),
        ("B-3", "Available", "$950", "available", 3.6, 2.3),
        ("B-4", "CyberShield", "$950", "occupied", 5.1, 2.3),
        ("B-5", "Available", "$950", "available", 6.6, 2.3),
        ("B-6", "M Yousuf Ent.", "$950", "occupied", 8.1, 2.3),
        # Row C
        ("C-1", "Available", "$600", "available", 0.6, 1.2),
        ("C-2", "Available", "$600", "available", 2.1, 1.2),
        ("C-3", "Reserved", "$600", "reserved", 3.6, 1.2),
        ("C-4", "Available", "$600", "available", 5.1, 1.2),
        ("C-5", "Available", "$600", "available", 6.6, 1.2),
        ("C-6", "Available", "$600", "available", 8.1, 1.2),
    ]

    status_colors = {
        "available": ("#ECFDF5", "#059669", "#065F46"),
        "reserved": ("#FEF3C7", "#D97706", "#92400E"),
        "occupied": ("#EFF6FF", "#2563EB", "#1E3A8A"),
    }

    for b_num, comp, price, st, bx, by in booths:
        bg, border, text_col = status_colors[st]
        b_tile = patches.FancyBboxPatch((bx, by), 1.3, 0.9, boxstyle="round,pad=0.04", fc=bg, ec=border, lw=1.5)
        ax.add_patch(b_tile)
        
        # Booth Number Badge
        ax.text(bx + 0.22, by + 0.72, b_num, ha="center", va="center", color="#FFFFFF", weight="bold", fontsize=7.5,
                bbox=dict(boxstyle="round,pad=0.15", fc=border, ec=border))
        
        # Company / Status
        ax.text(bx + 0.65, by + 0.42, comp, ha="center", va="center", color=text_col, weight="bold", fontsize=7.2)
        # Price
        ax.text(bx + 0.65, by + 0.18, price, ha="center", va="center", color="#64748B", fontsize=7.0)

    # Bottom Legend
    leg_y = 0.55
    ax.text(1.0, leg_y, "Studio Map Legend:", color="#0F172A", weight="bold", fontsize=8.5)
    
    # Green dot
    ax.add_patch(patches.Circle((2.5, leg_y), 0.1, fc="#059669", ec="#059669"))
    ax.text(2.7, leg_y, "Available (Open Booking)", va="center", color="#065F46", fontsize=8)
    
    # Amber dot
    ax.add_patch(patches.Circle((5.0, leg_y), 0.1, fc="#D97706", ec="#D97706"))
    ax.text(5.2, leg_y, "Reserved (Application Pending)", va="center", color="#92400E", fontsize=8)
    
    # Blue dot
    ax.add_patch(patches.Circle((7.7, leg_y), 0.1, fc="#2563EB", ec="#2563EB"))
    ax.text(7.9, leg_y, "Occupied (Partner Allocated)", va="center", color="#1E3A8A", fontsize=8)

    plt.tight_layout()
    path = os.path.join(IMG_DIR, "floor_plan_booth_map.png")
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved floor_plan_booth_map.png")

def create_organizer_flow():
    fig, ax = plt.subplots(figsize=(10, 4.0), dpi=250)
    ax.set_facecolor("#F8FAFC")
    fig.patch.set_facecolor("#F8FAFC")
    ax.axis("off")

    steps = [
        ("1. Create Expo", "#2563EB", "Title, Theme, Venue,\nDates & Grid Dimensions"),
        ("2. Synthesize Floor", "#059669", "Automated A-1..D-6 Units,\nTiers, Pricing & Amenities"),
        ("3. Vet Exhibitors", "#D97706", "Review Products, Bios,\n1-Click Approve / Reject"),
        ("4. Allocate Booths", "#7C3AED", "Map Tile Assignment,\nQuick Pick Company Cards"),
        ("5. Live Analytics", "#0284C7", "Daily Signups, Occupancy,\nRevenue & Popularity")
    ]

    for i, (st_title, col, desc) in enumerate(steps):
        x = 0.3 + i * 1.95
        card = patches.FancyBboxPatch((x, 0.6), 1.7, 2.7, boxstyle="round,pad=0.08", fc="#FFFFFF", ec=col, lw=2)
        ax.add_patch(card)
        hdr = patches.FancyBboxPatch((x, 2.7), 1.7, 0.6, boxstyle="round,pad=0.04", fc=col, ec=col)
        ax.add_patch(hdr)
        ax.text(x + 0.85, 3.0, st_title, ha="center", va="center", color="#FFFFFF", weight="bold", fontsize=9)
        ax.text(x + 0.85, 1.8, desc, ha="center", va="center", color="#1E293B", fontsize=8.2, linespacing=1.3)

        if i < len(steps) - 1:
            ax.annotate('', xy=(x + 1.95, 2.0), xytext=(x + 1.7, 2.0),
                        arrowprops=dict(arrowstyle="->", color="#94A3B8", lw=2.2))

    plt.tight_layout()
    path = os.path.join(IMG_DIR, "organizer_dashboard_flow.png")
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved organizer_dashboard_flow.png")

def create_attendee_pass():
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=250)
    ax.set_facecolor("#F8FAFC")
    fig.patch.set_facecolor("#F8FAFC")
    ax.axis("off")

    # Pass Card
    card = patches.FancyBboxPatch((1.0, 0.4), 6.0, 3.7, boxstyle="round,pad=0.1", fc="#FFFFFF", ec="#1E3A8A", lw=2)
    ax.add_patch(card)

    # Top Pass Header
    hdr = patches.FancyBboxPatch((1.0, 3.2), 6.0, 0.9, boxstyle="round,pad=0.05", fc="#1E3A8A", ec="#1E3A8A")
    ax.add_patch(hdr)
    ax.text(4.0, 3.8, "GLOBAL TECH & AI SUMMIT 2026", ha="center", va="center", color="#FFFFFF", weight="bold", fontsize=11)
    ax.text(4.0, 3.45, "OFFICIAL VERIFIED DELEGATE ENTRY BADGE", ha="center", va="center", color="#93C5FD", fontsize=8.5)

    # Delegate Info
    ax.text(1.4, 2.75, "DELEGATE NAME:", color="#64748B", fontsize=8, weight="bold")
    ax.text(1.4, 2.45, "Alex Morgan", color="#0F172A", fontsize=13, weight="bold")

    ax.text(1.4, 2.05, "ORGANIZATION:", color="#64748B", fontsize=8, weight="bold")
    ax.text(1.4, 1.80, "Vanguard Capital Partners", color="#0F172A", fontsize=10, weight="bold")

    ax.text(1.4, 1.40, "PASS TYPE:", color="#64748B", fontsize=8, weight="bold")
    ax.text(1.4, 1.15, "VIP All-Access Pass", color="#059669", fontsize=10, weight="bold")

    ax.text(1.4, 0.80, "VENUE: Moscone Center, San Francisco • Dec 01-03, 2026", color="#64748B", fontsize=7.5)

    # Simulated QR Code Grid
    qr_box = patches.Rectangle((4.8, 1.0), 1.8, 1.8, fc="#F8FAFC", ec="#CBD5E1", lw=1.5)
    ax.add_patch(qr_box)
    
    # Draw QR dots pattern
    for r in range(6):
        for c in range(6):
            if (r + c) % 2 == 0 or (r in [0, 5] and c in [0, 5]):
                dot = patches.Rectangle((4.9 + c * 0.26, 1.1 + r * 0.26), 0.20, 0.20, fc="#0F172A")
                ax.add_patch(dot)

    ax.text(5.7, 0.75, "ENTRY HASH: ES-9942-8812", ha="center", va="center", color="#64748B", fontsize=7.5, weight="bold")

    plt.tight_layout()
    path = os.path.join(IMG_DIR, "attendee_digital_pass.png")
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved attendee_digital_pass.png")

def create_er_diagram():
    fig, ax = plt.subplots(figsize=(10.5, 6.2), dpi=250)
    ax.set_facecolor("#F8FAFC")
    fig.patch.set_facecolor("#F8FAFC")
    ax.axis("off")

    entities = [
        ("User", 0.4, 3.8, "#1E3A8A", ["_id: ObjectId (PK)", "name: String", "email: String (UK)", "password: Hash", "role: Enum", "avatar: String"]),
        ("Expo", 3.8, 3.8, "#059669", ["_id: ObjectId (PK)", "title: String", "date / endDate: Date", "location: String", "boothRows/Cols: Int", "status: Enum"]),
        ("Booth", 7.2, 3.8, "#D97706", ["_id: ObjectId (PK)", "expo: ObjectId (FK)", "number: String", "size: Enum", "status: Enum", "price: Number", "exhibitor: FK"]),
        ("ExhibitorProfile", 0.4, 0.5, "#7C3AED", ["_id: ObjectId (PK)", "user: ObjectId (FK)", "expo: ObjectId (FK)", "company: String", "products: Array", "status: Enum"]),
        ("Session", 3.8, 0.5, "#0284C7", ["_id: ObjectId (PK)", "expo: ObjectId (FK)", "title: String", "speaker: String", "capacity: Int", "attendees: Array"]),
        ("Registration", 7.2, 0.5, "#DC2626", ["_id: ObjectId (PK)", "user: ObjectId (FK)", "expo: ObjectId (FK)", "ticketCode: String (UK)", "status: Enum"])
    ]

    for title, x, y, col, fields in entities:
        box = patches.FancyBboxPatch((x, y), 2.8, 2.1, boxstyle="round,pad=0.08", fc="#FFFFFF", ec=col, lw=2)
        ax.add_patch(box)
        hdr = patches.FancyBboxPatch((x, y + 1.65), 2.8, 0.45, boxstyle="round,pad=0.04", fc=col, ec=col)
        ax.add_patch(hdr)
        ax.text(x + 1.4, y + 1.88, f"Entity: {title}", ha="center", va="center", color="white", weight="bold", fontsize=9.5)

        fy = y + 1.45
        for f in fields:
            ax.text(x + 0.15, fy, f, ha="left", va="center", color="#1E293B", fontsize=7.8)
            fy -= 0.28

    # Relationship connectors
    ax.annotate('1:M owns', xy=(1.8, 2.6), xytext=(1.8, 3.8),
                arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.5))
    ax.annotate('1:M contains', xy=(7.2, 4.8), xytext=(6.6, 4.8),
                arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.5))
    ax.annotate('1:M hosts', xy=(5.2, 2.6), xytext=(5.2, 3.8),
                arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.5))
    ax.annotate('1:M enrolls', xy=(7.2, 1.5), xytext=(6.6, 1.5),
                arrowprops=dict(arrowstyle="->", color="#64748B", lw=1.5))

    plt.tight_layout()
    path = os.path.join(IMG_DIR, "er_diagram_full.png")
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved er_diagram_full.png")

def create_websocket_flow():
    fig, ax = plt.subplots(figsize=(9.5, 4.2), dpi=250)
    ax.set_facecolor("#F8FAFC")
    fig.patch.set_facecolor("#F8FAFC")
    ax.axis("off")

    nodes = [
        ("Client A (Attendee)", 0.4, 2.0, "#2563EB"),
        ("Socket.io Gateway", 3.6, 2.0, "#059669"),
        ("MongoDB Storage", 6.8, 3.0, "#D97706"),
        ("Client B (Exhibitor)", 6.8, 1.0, "#7C3AED")
    ]

    for title, x, y, col in nodes:
        b = patches.FancyBboxPatch((x, y), 2.2, 0.9, boxstyle="round,pad=0.08", fc="#FFFFFF", ec=col, lw=2)
        ax.add_patch(b)
        ax.text(x + 1.1, y + 0.45, title, ha="center", va="center", color=col, weight="bold", fontsize=9.5)

    ax.annotate('1. emit("send_message", payload)', xy=(3.6, 2.5), xytext=(2.6, 2.5),
                arrowprops=dict(arrowstyle="->", color="#2563EB", lw=2))
    ax.annotate('2. Message.create()', xy=(6.8, 3.3), xytext=(5.8, 2.6),
                arrowprops=dict(arrowstyle="->", color="#D97706", lw=2))
    ax.annotate('3. emit("new_message")', xy=(6.8, 1.6), xytext=(5.8, 2.3),
                arrowprops=dict(arrowstyle="->", color="#7C3AED", lw=2))

    plt.tight_layout()
    path = os.path.join(IMG_DIR, "websocket_message_flow.png")
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved websocket_message_flow.png")

if __name__ == "__main__":
    create_user_ecosystem()
    create_floor_plan_map()
    create_organizer_flow()
    create_attendee_pass()
    create_er_diagram()
    create_websocket_flow()
    print("All rich diagrams generated!")
