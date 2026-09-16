import asyncio
import os
import sys
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.core.config import settings
from backend.app.core.security import get_password_hash
from backend.app.models.schemas import UserRole, EventStatus

async def seed_database():
    print(f"Connecting to MongoDB at {settings.MONGO_URI}...")
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]

    now_iso = datetime.now(timezone.utc).isoformat()

    print("Cleaning existing collections...")
    await db.users.delete_many({})
    await db.events.delete_many({})
    await db.checkpoints.delete_many({})
    await db.riders.delete_many({})
    await db.volunteers.delete_many({})
    await db.scans.delete_many({})
    await db.settings.delete_many({})

    # --------------------------------------------------
    # 1. USERS
    # --------------------------------------------------
    print("Seeding users...")
    super_admin_user = {
        "id": "user-superadmin-01",
        "email": "superadmin@ridetrack.com",
        "name": "Platform Super Admin",
        "hashedPassword": get_password_hash("AdminPassword@123"),
        "role": UserRole.SUPER_ADMIN.value,
        "organizationName": "RideTrack Platform",
        "phone": "+91 99000 00001",
        "status": "Active",
        "createdAt": now_iso,
        "updatedAt": now_iso,
    }

    organizer_user = {
        "id": "user-organizer-01",
        "email": "organizer@kolhapur.com",
        "name": "Kolhapur Cycling Club",
        "hashedPassword": get_password_hash("OrganizerPassword@123"),
        "role": UserRole.ORGANIZER.value,
        "organizationName": "Kolhapur Randonneurs",
        "phone": "+91 98765 43210",
        "status": "Active",
        "createdAt": now_iso,
        "updatedAt": now_iso,
    }

    volunteer_user = {
        "id": "user-volunteer-01",
        "email": "volunteer@kolhapur.com",
        "name": "Amit Shinde",
        "hashedPassword": get_password_hash("VolunteerPassword@123"),
        "role": UserRole.VOLUNTEER.value,
        "organizationName": "Kolhapur Randonneurs",
        "phone": "+91 98230 11223",
        "status": "Active",
        "createdAt": now_iso,
        "updatedAt": now_iso,
    }

    await db.users.insert_many([super_admin_user, organizer_user, volunteer_user])

    # --------------------------------------------------
    # 2. EVENT
    # --------------------------------------------------
    print("Seeding event...")
    event_id = "ev-kolhapur-2026"
    event_doc = {
        "id": event_id,
        "eventName": "Kolhapur 200 BRM 2026",
        "description": "Annual endurance cycling brevet through Western Ghats passes and scenic rural countryside.",
        "location": "Kolhapur, Maharashtra",
        "rideDistance": 200.0,
        "rideDate": "2026-10-18",
        "startTime": "06:00 AM",
        "organizerId": organizer_user["id"],
        "organizerName": organizer_user["organizationName"],
        "status": EventStatus.ACTIVE.value,
        "createdAt": now_iso,
        "updatedAt": now_iso,
    }
    await db.events.insert_one(event_doc)

    # --------------------------------------------------
    # 3. 10 CHECKPOINTS (7 Mandatory, 3 Optional)
    # --------------------------------------------------
    print("Seeding 10 checkpoints (7 mandatory, 3 optional)...")
    checkpoints_data = [
        {"id": "cp-kolhapur-01", "name": "CP1 - Mahavir Garden (Start)", "type": "Start", "sequenceNumber": 1, "mandatory": True},
        {"id": "cp-kolhapur-02", "name": "CP2 - Shiroli Toll Plaza", "type": "Standard", "sequenceNumber": 2, "mandatory": True},
        {"id": "cp-kolhapur-03", "name": "CP3 - Hatkanangle Phata", "type": "Standard", "sequenceNumber": 3, "mandatory": True},
        {"id": "cp-kolhapur-04", "name": "CP4 - Ichalkaranji Bypass", "type": "Standard", "sequenceNumber": 4, "mandatory": True},
        {"id": "cp-kolhapur-05", "name": "CP5 - Jaysingpur Sugar Factory", "type": "Hydration", "sequenceNumber": 5, "mandatory": False},
        {"id": "cp-kolhapur-06", "name": "CP6 - Sangli Miraj Junction", "type": "Midway", "sequenceNumber": 6, "mandatory": True},
        {"id": "cp-kolhapur-07", "name": "CP7 - Tasgaon Grape Valley", "type": "Rest", "sequenceNumber": 7, "mandatory": False},
        {"id": "cp-kolhapur-08", "name": "CP8 - Ashta High School", "type": "Standard", "sequenceNumber": 8, "mandatory": True},
        {"id": "cp-kolhapur-09", "name": "CP9 - Vadgaon Water Point", "type": "Hydration", "sequenceNumber": 9, "mandatory": False},
        {"id": "cp-kolhapur-10", "name": "CP10 - Mahavir Garden (Finish)", "type": "Finish", "sequenceNumber": 10, "mandatory": True},
    ]

    for cp in checkpoints_data:
        cp["eventId"] = event_id
        cp["createdAt"] = now_iso
        cp["updatedAt"] = now_iso

    await db.checkpoints.insert_many(checkpoints_data)

    # --------------------------------------------------
    # 4. RIDERS (Stable RT-XXXX IDs and QR value = RT-XXXX)
    # --------------------------------------------------
    print("Seeding riders...")
    riders_data = [
        {
            "id": "r-001",
            "riderId": "RT-0001",
            "eventId": event_id,
            "name": "Vikram Malhotra",
            "mobile": "+91 98220 12345",
            "emergencyContact": "+91 98220 54321",
            "bloodGroup": "B+",
            "age": 34,
            "gender": "Male",
            "club": "Kolhapur Randonneurs",
            "bicycleType": "Road Bike",
            "jerseyNumber": "101",
            "medicalNotes": "None",
            "qrCodeValue": "RT-0001",
            "status": "In-Transit",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
        {
            "id": "r-002",
            "riderId": "RT-0002",
            "eventId": event_id,
            "name": "Pooja Deshmukh",
            "mobile": "+91 98221 23456",
            "emergencyContact": "+91 98221 65432",
            "bloodGroup": "O+",
            "age": 29,
            "gender": "Female",
            "club": "Pune Cyclists",
            "bicycleType": "Gravel Bike",
            "jerseyNumber": "102",
            "medicalNotes": "Asthma inhaler in saddle bag",
            "qrCodeValue": "RT-0002",
            "status": "In-Transit",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
        {
            "id": "r-003",
            "riderId": "RT-0003",
            "eventId": event_id,
            "name": "Rajesh Kulkarni",
            "mobile": "+91 98222 34567",
            "emergencyContact": "+91 98222 76543",
            "bloodGroup": "A+",
            "age": 42,
            "gender": "Male",
            "club": "Kolhapur Randonneurs",
            "bicycleType": "Road Bike",
            "jerseyNumber": "103",
            "medicalNotes": "None",
            "qrCodeValue": "RT-0003",
            "status": "Completed",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
        {
            "id": "r-004",
            "riderId": "RT-0004",
            "eventId": event_id,
            "name": "Sneha Patil",
            "mobile": "+91 98223 45678",
            "emergencyContact": "+91 98223 87654",
            "bloodGroup": "AB+",
            "age": 31,
            "gender": "Female",
            "club": "Goa Riders",
            "bicycleType": "Road Bike",
            "jerseyNumber": "104",
            "medicalNotes": "Allergic to penicillin",
            "qrCodeValue": "RT-0004",
            "status": "In-Transit",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
        {
            "id": "r-005",
            "riderId": "RT-0005",
            "eventId": event_id,
            "name": "Aniket Joshi",
            "mobile": "+91 98224 56789",
            "emergencyContact": "+91 98224 98765",
            "bloodGroup": "O-",
            "age": 38,
            "gender": "Male",
            "club": "Independent",
            "bicycleType": "Hybrid Bike",
            "jerseyNumber": "105",
            "medicalNotes": "None",
            "qrCodeValue": "RT-0005",
            "status": "DNF",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
        {
            "id": "r-006",
            "riderId": "RT-0006",
            "eventId": event_id,
            "name": "Siddharth Rao",
            "mobile": "+91 98225 67890",
            "emergencyContact": "+91 98225 09876",
            "bloodGroup": "B+",
            "age": 27,
            "gender": "Male",
            "club": "Satara Cyclists",
            "bicycleType": "Road Bike",
            "jerseyNumber": "106",
            "medicalNotes": "None",
            "qrCodeValue": "RT-0006",
            "status": "Home Safe",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
    ]
    await db.riders.insert_many(riders_data)

    # --------------------------------------------------
    # 5. VOLUNTEERS & ASSIGNMENTS
    # --------------------------------------------------
    print("Seeding volunteer assignments...")
    volunteers_data = [
        {
            "id": "vol-001",
            "userId": volunteer_user["id"],
            "eventId": event_id,
            "checkpointId": "cp-kolhapur-01",
            "checkpointName": "CP1 - Mahavir Garden (Start)",
            "name": "Amit Shinde",
            "mobile": "+91 98230 11223",
            "status": "Assigned",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
        {
            "id": "vol-002",
            "userId": None,
            "eventId": event_id,
            "checkpointId": "cp-kolhapur-02",
            "checkpointName": "CP2 - Shiroli Toll Plaza",
            "name": "Rohan Gaikwad",
            "mobile": "+91 98230 44556",
            "status": "Assigned",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
    ]
    await db.volunteers.insert_many(volunteers_data)

    # --------------------------------------------------
    # 6. SCANS (To populate live tracking)
    # --------------------------------------------------
    print("Seeding initial scans...")
    scans_data = [
        # Start checkpoint scans (CP1)
        {
            "id": "scan-001",
            "clientScanId": "client-scan-001",
            "riderId": "RT-0001",
            "riderName": "Vikram Malhotra",
            "jerseyNumber": "101",
            "eventId": event_id,
            "eventName": event_doc["eventName"],
            "checkpointId": "cp-kolhapur-01",
            "checkpointName": "CP1 - Mahavir Garden (Start)",
            "volunteerId": "vol-001",
            "scanTime": "2026-10-18T06:02:15Z",
            "status": "Recorded",
            "createdAt": now_iso,
        },
        {
            "id": "scan-002",
            "clientScanId": "client-scan-002",
            "riderId": "RT-0002",
            "riderName": "Pooja Deshmukh",
            "jerseyNumber": "102",
            "eventId": event_id,
            "eventName": event_doc["eventName"],
            "checkpointId": "cp-kolhapur-01",
            "checkpointName": "CP1 - Mahavir Garden (Start)",
            "volunteerId": "vol-001",
            "scanTime": "2026-10-18T06:03:40Z",
            "status": "Recorded",
            "createdAt": now_iso,
        },
        {
            "id": "scan-003",
            "clientScanId": "client-scan-003",
            "riderId": "RT-0003",
            "riderName": "Rajesh Kulkarni",
            "jerseyNumber": "103",
            "eventId": event_id,
            "eventName": event_doc["eventName"],
            "checkpointId": "cp-kolhapur-01",
            "checkpointName": "CP1 - Mahavir Garden (Start)",
            "volunteerId": "vol-001",
            "scanTime": "2026-10-18T06:04:10Z",
            "status": "Recorded",
            "createdAt": now_iso,
        },
        {
            "id": "scan-004",
            "clientScanId": "client-scan-004",
            "riderId": "RT-0004",
            "riderName": "Sneha Patil",
            "jerseyNumber": "104",
            "eventId": event_id,
            "eventName": event_doc["eventName"],
            "checkpointId": "cp-kolhapur-01",
            "checkpointName": "CP1 - Mahavir Garden (Start)",
            "volunteerId": "vol-001",
            "scanTime": "2026-10-18T06:05:00Z",
            "status": "Recorded",
            "createdAt": now_iso,
        },
        # Checkpoint 2 scans (CP2)
        {
            "id": "scan-005",
            "clientScanId": "client-scan-005",
            "riderId": "RT-0001",
            "riderName": "Vikram Malhotra",
            "jerseyNumber": "101",
            "eventId": event_id,
            "eventName": event_doc["eventName"],
            "checkpointId": "cp-kolhapur-02",
            "checkpointName": "CP2 - Shiroli Toll Plaza",
            "volunteerId": "vol-002",
            "scanTime": "2026-10-18T06:55:20Z",
            "status": "Recorded",
            "createdAt": now_iso,
        },
        {
            "id": "scan-006",
            "clientScanId": "client-scan-006",
            "riderId": "RT-0003",
            "riderName": "Rajesh Kulkarni",
            "jerseyNumber": "103",
            "eventId": event_id,
            "eventName": event_doc["eventName"],
            "checkpointId": "cp-kolhapur-02",
            "checkpointName": "CP2 - Shiroli Toll Plaza",
            "volunteerId": "vol-002",
            "scanTime": "2026-10-18T06:58:10Z",
            "status": "Recorded",
            "createdAt": now_iso,
        },
        # Finish scan for Rajesh Kulkarni (CP10)
        {
            "id": "scan-007",
            "clientScanId": "client-scan-007",
            "riderId": "RT-0003",
            "riderName": "Rajesh Kulkarni",
            "jerseyNumber": "103",
            "eventId": event_id,
            "eventName": event_doc["eventName"],
            "checkpointId": "cp-kolhapur-10",
            "checkpointName": "CP10 - Mahavir Garden (Finish)",
            "volunteerId": "vol-001",
            "scanTime": "2026-10-18T13:42:00Z",
            "status": "Recorded",
            "createdAt": now_iso,
        },
    ]
    await db.scans.insert_many(scans_data)

    # --------------------------------------------------
    # 7. SYSTEM SETTINGS
    # --------------------------------------------------
    print("Seeding system settings...")
    settings_doc = {
        "type": "system",
        "platformName": "RideTrack",
        "supportEmail": "support@ridetrack.com",
        "allowPublicRegistration": True,
        "qrCodeGracePeriodHours": 48,
        "offlineSyncWindowHours": 72,
        "maintenanceMode": False,
        "updatedAt": now_iso,
    }
    await db.settings.insert_one(settings_doc)

    print("[SUCCESS] Database seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
