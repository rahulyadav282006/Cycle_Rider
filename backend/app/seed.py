import asyncio
import os
import sys
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.core.config import settings
from backend.app.core.security import get_password_hash
from backend.app.models.schemas import UserRole


async def seed_database():
    print(f"Connecting to MongoDB at {settings.MONGO_URI}...")
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    now_iso = datetime.now(timezone.utc).isoformat()

    print("Removing non-authentication data...")
    for collection in ("events", "checkpoints", "riders", "volunteers", "scans", "settings"):
        await db[collection].delete_many({})

    print("Seeding authentication users...")
    await db.users.delete_many({})
    users = [
        {
            "id": "user-organizer-01",
            "email": "rideowner005@gmail.com",
            "name": "RideTrack Ride Owner",
            "hashedPassword": get_password_hash("owner005"),
            "role": UserRole.ORGANIZER.value,
            "organizationName": "Kolhapur Randonneurs",
            "phone": "+91 98765 43210",
            "status": "Active",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
        {
            "id": "user-volunteer-01",
            "email": "volunteer500@gmail.com",
            "name": "Amit Volunteer",
            "hashedPassword": get_password_hash("volunteer500"),
            "role": UserRole.VOLUNTEER.value,
            "organizationName": "Kolhapur Randonneurs",
            "phone": "+91 98230 11223",
            "status": "Active",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
        {
            "id": "user-volunteer-02",
            "email": "bikevolunteer@gmail.com",
            "name": "Bike Point Volunteer",
            "hashedPassword": get_password_hash("bikevolunteer500"),
            "role": UserRole.VOLUNTEER.value,
            "organizationName": "Kolhapur Randonneurs",
            "phone": "+91 98230 44556",
            "status": "Active",
            "createdAt": now_iso,
            "updatedAt": now_iso,
        },
    ]
    await db.users.insert_many(users)
    print("[SUCCESS] Authentication users seeded; domain collections are empty.")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
