import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle

os.makedirs(r"docs\diagrams", exist_ok=True)

def generate_db_architecture_diagram():
    fig, ax = plt.subplots(figsize=(14, 9), dpi=200)
    ax.set_xlim(0, 1400)
    ax.set_ylim(0, 900)
    ax.axis("off")

    # Background canvas
    bg = FancyBboxPatch((0, 0), 1400, 900, boxstyle="round,pad=0,rounding_size=12", facecolor="#0B132B", edgecolor="#1C2541", lw=2)
    ax.add_patch(bg)

    # Header bar
    ax.add_patch(Rectangle((0, 830), 1400, 70, facecolor="#1C2541"))
    ax.text(40, 865, "EventSphere Database Architecture & Persistence Topology", fontsize=16, fontweight="bold", color="#48CAE4", va="center")
    ax.text(40, 845, "MongoDB Atlas Replica Set • Mongoose ODM v7+ • Atomic Write Operations & Compound Indexing", fontsize=10, color="#94A3B8", va="center")

    # Tier 1: Application & Connection Resiliency Layer (Top)
    ax.add_patch(FancyBboxPatch((40, 670), 1320, 140, boxstyle="round,pad=0,rounding_size=8", facecolor="#16223F", edgecolor="#2D3B60", lw=1.5))
    ax.text(60, 785, "1. CONNECTION RESILIENCE & DNS RESOLUTION LAYER (`backend/config/db.js`)", fontsize=11, fontweight="bold", color="#38BDF8")

    # 3 Boxes in Tier 1
    t1_boxes = [
        ("DNS Fallback & Patching", "Global dns.lookup patched\nFallback: 8.8.8.8, 1.1.1.1\nEliminates IPv6 fe80::1 timeout", 60, "#0284C7"),
        ("Static Atlas Shard Cache", "Static IP map for Atlas hosts:\n159.41.170.80, .90, .100\nZero getaddrinfo ENOTFOUND", 490, "#059669"),
        ("Connection Pool & Health", "serverSelectionTimeoutMS: 10s\nsocketTimeoutMS: 45s, family: 4\nAuto-reconnect retry: 3s loop", 920, "#D97706")
    ]
    for title, desc, x, accent in t1_boxes:
        ax.add_patch(FancyBboxPatch((x, 685), 410, 85, boxstyle="round,pad=0,rounding_size=6", facecolor="#0F172A", edgecolor=accent, lw=1.2))
        ax.text(x + 15, 750, title, fontsize=9.5, fontweight="bold", color=accent)
        ax.text(x + 15, 715, desc, fontsize=8.5, color="#CBD5E1")

    # Downward arrow to Mongoose ODM
    ax.annotate("", xy=(700, 635), xytext=(700, 670), arrowprops=dict(arrowstyle="->", color="#38BDF8", lw=2.5))
    ax.text(715, 650, "Mongoose Client Pool (mongoose.connect)", fontsize=8.5, color="#38BDF8")

    # Tier 2: Mongoose ODM Schema & Business Logic Layer (Middle)
    ax.add_patch(FancyBboxPatch((40, 310), 1320, 320, boxstyle="round,pad=0,rounding_size=8", facecolor="#16223F", edgecolor="#2D3B60", lw=1.5))
    ax.text(60, 605, "2. MONGOOSE DATA MODELING, RELATIONAL NORMALIZATION & ATOMIC INDEXES", fontsize=11, fontweight="bold", color="#38BDF8")

    # 8 Collections in 2 rows of 4
    collections_row1 = [
        ("User", "Role: admin|exhibitor|attendee\nbcrypt Salt 10 pre('save')\nIndex: { email: 1 } (Unique)", 60, "#38BDF8"),
        ("Expo", "boothRows & boothColumns\nstatus: draft|published|active\norganizer: ref User", 380, "#38BDF8"),
        ("Booth", "Unique: { expo: 1, number: 1 }\ntier: standard|premium|island\nstatus: available|reserved|occupied", 700, "#10B981"),
        ("ExhibitorProfile", "Unique: { user: 1, expo: 1 }\nEmbedded: products, services\nstatus: pending|approved|rejected", 1020, "#10B981")
    ]
    for title, desc, x, accent in collections_row1:
        ax.add_patch(FancyBboxPatch((x, 465), 310, 120, boxstyle="round,pad=0,rounding_size=6", facecolor="#0F172A", edgecolor=accent, lw=1.5))
        ax.text(x + 15, 560, f"Collection: {title}", fontsize=10, fontweight="bold", color=accent)
        ax.text(x + 15, 510, desc, fontsize=8.5, color="#E2E8F0")

    collections_row2 = [
        ("Session", "expo: ref Expo\nEmbedded: attendees: [{user}]\ncapacity & status validation", 60, "#F59E0B"),
        ("Registration", "Unique: { user: 1, expo: 1 }\nEmbedded: sessions: [ref Session]\nqrCode: string (Unique)", 380, "#F59E0B"),
        ("Message", "Index: { sender: 1, receiver: 1 }\ncontent: string, read: boolean\nReal-time B2B & Organizer chat", 700, "#8B5CF6"),
        ("Feedback", "Unique: { user: 1, expo: 1 }\nrating: 1-5, category: enum\nAttendee & Exhibitor feedback", 1020, "#EC4899")
    ]
    for title, desc, x, accent in collections_row2:
        ax.add_patch(FancyBboxPatch((x, 325), 310, 120, boxstyle="round,pad=0,rounding_size=6", facecolor="#0F172A", edgecolor=accent, lw=1.5))
        ax.text(x + 15, 420, f"Collection: {title}", fontsize=10, fontweight="bold", color=accent)
        ax.text(x + 15, 370, desc, fontsize=8.5, color="#E2E8F0")

    # Downward arrow to Atlas Replica Set
    ax.annotate("", xy=(700, 275), xytext=(700, 310), arrowprops=dict(arrowstyle="->", color="#10B981", lw=2.5))
    ax.text(715, 290, "WiredTiger Engine / TLS 1.3 Wired Storage", fontsize=8.5, color="#10B981")

    # Tier 3: MongoDB Atlas Storage & High-Availability Cluster (Bottom)
    ax.add_patch(FancyBboxPatch((40, 40), 1320, 230, boxstyle="round,pad=0,rounding_size=8", facecolor="#16223F", edgecolor="#2D3B60", lw=1.5))
    ax.text(60, 245, "3. MONGODB ATLAS 3-NODE REPLICA SET ARCHITECTURE & REPLICATION", fontsize=11, fontweight="bold", color="#10B981")

    # 3 Replica nodes
    nodes = [
        ("Primary Shard Node (Read/Write)", "ac-0d9vmqe-shard-00-00\nIP: 159.41.170.80\nWiredTiger Storage Engine\nAccepts All Writes & Primary Reads", 60, "#10B981"),
        ("Secondary Node 1 (Replication)", "ac-0d9vmqe-shard-00-01\nIP: 159.41.170.90\nOplog Async Replication (<10ms)\nAutomatic Failover Candidate", 490, "#0284C7"),
        ("Secondary Node 2 (Disaster Recovery)", "ac-0d9vmqe-shard-00-02\nIP: 159.41.170.100\nMulti-AZ High Availability\nNightly mongodump Hot Backups", 920, "#6366F1")
    ]
    for title, desc, x, accent in nodes:
        ax.add_patch(FancyBboxPatch((x, 60), 410, 165, boxstyle="round,pad=0,rounding_size=6", facecolor="#0F172A", edgecolor=accent, lw=1.5))
        ax.text(x + 20, 195, title, fontsize=10, fontweight="bold", color=accent)
        ax.text(x + 20, 130, desc, fontsize=8.5, color="#CBD5E1")

    # Bottom status bar
    ax.add_patch(Rectangle((0, 0), 1400, 30, facecolor="#0B132B"))
    ax.text(40, 15, "EventSphere Persistence Tier • MongoDB v6.0+ Atlas Replica Set • WiredTiger Document Store • ACID Multi-Document Transactions", fontsize=8.5, color="#64748B", va="center")

    plt.tight_layout()
    path = r"docs\diagrams\database_architecture_topology.png"
    plt.savefig(path, bbox_inches="tight")
    plt.close()
    print("Saved database_architecture_topology.png successfully!")

if __name__ == "__main__":
    generate_db_architecture_diagram()
