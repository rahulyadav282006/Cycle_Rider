from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, Any
from pydantic import BaseModel, Field

# --------------------------------------------------
# ROLES
# --------------------------------------------------
class UserRole(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ORGANIZER = "ORGANIZER"
    VOLUNTEER = "VOLUNTEER"

# --------------------------------------------------
# RESPONSE STANDARD
# --------------------------------------------------
class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[dict] = None

# --------------------------------------------------
# AUTH SCHEMAS
# --------------------------------------------------
class UserRegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: UserRole = UserRole.ORGANIZER
    organizationName: Optional[str] = None
    phone: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    organizationName: Optional[str] = None
    phone: Optional[str] = None
    createdAt: str

class TokenResponse(BaseModel):
    accessToken: str
    refreshToken: str
    tokenType: str = "bearer"
    user: UserResponse

# --------------------------------------------------
# EVENT SCHEMAS
# --------------------------------------------------
class EventStatus(str, Enum):
    DRAFT = "draft"
    UPCOMING = "upcoming"
    ACTIVE = "active"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class EventCreateRequest(BaseModel):
    eventName: str
    description: Optional[str] = ""
    location: str
    rideDistance: str | int | float
    rideDate: str
    startTime: str
    organizerName: Optional[str] = "RideTrack Organizer"
    status: EventStatus = EventStatus.UPCOMING

class EventUpdateRequest(BaseModel):
    eventName: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    rideDistance: Optional[str | int | float] = None
    rideDate: Optional[str] = None
    startTime: Optional[str] = None
    organizerName: Optional[str] = None
    status: Optional[EventStatus] = None

class EventResponse(BaseModel):
    id: str
    eventName: str
    description: str
    location: str
    rideDistance: float
    rideDate: str
    startTime: str
    organizerId: str
    organizerName: str
    status: EventStatus
    riderCount: int = 0
    checkpointCount: int = 0
    volunteerCount: int = 0
    createdAt: str
    updatedAt: str

# --------------------------------------------------
# CHECKPOINT SCHEMAS
# --------------------------------------------------
class CheckpointCreateRequest(BaseModel):
    name: str
    type: str = "Standard"
    sequenceNumber: int
    mandatory: bool = True

class CheckpointUpdateRequest(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    sequenceNumber: Optional[int] = None
    mandatory: Optional[bool] = None

class CheckpointResponse(BaseModel):
    id: str
    eventId: str
    name: str
    type: str
    sequenceNumber: int
    mandatory: bool
    createdAt: str
    updatedAt: str

# --------------------------------------------------
# RIDER SCHEMAS
# --------------------------------------------------
class RiderCreateRequest(BaseModel):
    name: str
    mobile: str
    emergencyContact: str
    bloodGroup: Optional[str] = "O+"
    age: Optional[int] = None
    gender: Optional[str] = "Male"
    club: Optional[str] = "Independent"
    bicycleType: Optional[str] = "Road Bike"
    jerseyNumber: Optional[int | str] = 101
    medicalNotes: Optional[str] = "None reported"

class RiderUpdateRequest(BaseModel):
    name: Optional[str] = None
    mobile: Optional[str] = None
    emergencyContact: Optional[str] = None
    bloodGroup: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    club: Optional[str] = None
    bicycleType: Optional[str] = None
    jerseyNumber: Optional[int | str] = None
    medicalNotes: Optional[str] = None
    status: Optional[str] = None

class RiderResponse(BaseModel):
    id: str
    riderId: str
    eventId: str
    name: str
    mobile: str
    emergencyContact: str
    bloodGroup: str
    age: Optional[int] = None
    gender: str
    club: str
    bicycleType: str
    jerseyNumber: str
    medicalNotes: str
    qrCodeValue: str
    status: str = "Registered"
    createdAt: str
    updatedAt: str
    timeline: Optional[List[dict]] = []

# --------------------------------------------------
# VOLUNTEER SCHEMAS
# --------------------------------------------------
class VolunteerCreateRequest(BaseModel):
    name: str
    mobile: str
    checkpointId: Optional[str] = None
    checkpointName: Optional[str] = None
    status: str = "Assigned"

class VolunteerUpdateRequest(BaseModel):
    name: Optional[str] = None
    mobile: Optional[str] = None
    checkpointId: Optional[str] = None
    checkpointName: Optional[str] = None
    status: Optional[str] = None

class VolunteerResponse(BaseModel):
    id: str
    userId: Optional[str] = None
    eventId: str
    checkpointId: Optional[str] = None
    checkpointName: Optional[str] = None
    name: str
    mobile: str
    status: str
    createdAt: str
    updatedAt: str

# --------------------------------------------------
# SCAN SCHEMAS
# --------------------------------------------------
class ScanRecordRequest(BaseModel):
    clientScanId: str
    riderId: str
    eventId: str
    checkpointId: str
    scanTime: Optional[str] = None

class ScanResponse(BaseModel):
    id: str
    clientScanId: str
    riderId: str
    riderName: str
    jerseyNumber: str
    eventId: str
    eventName: str
    checkpointId: str
    checkpointName: str
    volunteerId: str
    scanTime: str
    status: str = "Recorded"
    createdAt: str

# --------------------------------------------------
# LIVE TRACKING & STATS SCHEMAS
# --------------------------------------------------
class LiveTrackingResponse(BaseModel):
    eventId: str
    eventName: str
    registeredRiders: int
    startedRiders: int
    finishedRiders: int
    dnfRiders: int
    homeSafeRiders: int
    checkpointProgress: List[dict]
    recentScans: List[dict]
    ridersStatusList: List[dict]

# --------------------------------------------------
# SUPER ADMIN SCHEMAS
# --------------------------------------------------
class AdminStatsResponse(BaseModel):
    totalOrganizers: int
    activeOrganizers: int
    totalEvents: int
    activeEvents: int
    totalRiders: int
    totalCheckpoints: int

# --------------------------------------------------
# DYNAMIC QR CODE SCHEMAS
# --------------------------------------------------
class QRCodeCreateRequest(BaseModel):
    destinationUrl: str
    title: Optional[str] = "New Rider Dynamic QR"
    metadata: Optional[dict] = None

class QRCodeResponse(BaseModel):
    id: str
    shortId: str
    destinationUrl: str
    trackingUrl: str
    svgUrl: str
    totalScans: int = 0
    title: Optional[str] = "New Rider Dynamic QR"
    createdAt: str

class QRCodeAnalyticsResponse(BaseModel):
    shortId: str
    destinationUrl: str
    trackingUrl: str
    totalScans: int
    scans: List[dict] = []
    createdAt: str
    updatedAt: str

