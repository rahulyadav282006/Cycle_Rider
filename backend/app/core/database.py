import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from backend.app.core.config import settings

import asyncio

logger = logging.getLogger("newrider.database")

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None
_client_loop: asyncio.AbstractEventLoop | None = None

def get_database() -> AsyncIOMotorDatabase:
    global db, client, _client_loop
    try:
        current_loop = asyncio.get_running_loop()
    except RuntimeError:
        current_loop = None

    if db is None or client is None or _client_loop != current_loop:
        if client is not None:
            try:
                client.close()
            except Exception:
                pass
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client[settings.DB_NAME]
        _client_loop = current_loop
    return db

async def close_database():
    global client, db, _client_loop
    if client is not None:
        client.close()
        client = None
        db = None
        _client_loop = None
        logger.info("MongoDB connection closed.")

close_db = close_database

async def init_db_indexes():
    database = get_database()
    logger.info("Initializing MongoDB indexes...")

    # Users
    await database.users.create_index("email", unique=True)
    await database.users.create_index("role")

    # Events
    await database.events.create_index("organizerId")
    await database.events.create_index("status")

    # Checkpoints
    await database.checkpoints.create_index("eventId")
    await database.checkpoints.create_index([("eventId", 1), ("sequenceNumber", 1)])

    # Riders
    await database.riders.create_index("eventId")
    await database.riders.create_index([("eventId", 1), ("riderId", 1)], unique=True)

    # Volunteers
    await database.volunteers.create_index("eventId")
    await database.volunteers.create_index("userId")
    await database.volunteers.create_index("checkpointId")

    # Scans
    await database.scans.create_index("clientScanId", unique=True)
    await database.scans.create_index("riderId")
    await database.scans.create_index("eventId")
    await database.scans.create_index("checkpointId")
    # QR Codes
    await database.qr_codes.create_index("shortId", unique=True)
    await database.qr_codes.create_index("createdAt")

    logger.info("MongoDB indexes verified.")

init_db = init_db_indexes
