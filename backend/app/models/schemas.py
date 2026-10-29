import re
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, Any
from pydantic import BaseModel, Field, field_validator

# --------------------------------------------------
# ROLES
# --------------------------------------------------
class UserRole(str, Enum):
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

    @field_validator("eventName")
    @classmethod
    def validate_event_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Event name cannot be empty")
        if not re.match(r"^[A-Za-z\s]+$", v.strip()):
            raise ValueError("Event name must contain only characters (letters and spaces, no numbers or symbols)")
        return v.strip()

    @field_validator("rideDate")
    @classmethod
    def validate_ride_date(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Ride date cannot be empty")
        date_str = v.strip()
        try:
            if "-" in date_str and len(date_str.split("-")[0]) == 4:
                parsed = datetime.strptime(date_str, "%Y-%m-%d").date()
            else:
                parsed = datetime.strptime(date_str, "%d-%m-%Y").date()
        except ValueError:
            raise ValueError("Ride date must be in YYYY-MM-DD format")
        if parsed < datetime.now().date():
            raise ValueError("Ride date cannot be in the past. Please select today or a future date.")
        return date_str
    description: Optional[str] = ""
    location: str
    rideDistance: str | int | float
    rideDate: str
    startTime: str
    organizerName: Optional[str] = "RideTrack Organizer"
    status: EventStatus = EventStatus.UPCOMING
    routePoints: Optional[List[dict]] = None
    routeGeometry: Optional[List[List[float]]] = None
    startLocation: Optional[dict] = None  # {"name": str, "lat": float, "lng": float}
    finishLocation: Optional[dict] = None  # {"name": str, "lat": float, "lng": float}
    orderedCheckpointIds: Optional[List[str]] = None
    distanceKm: Optional[float] = None
    estimatedDurationMinutes: Optional[float] = None
    routeProfile: Optional[str] = "cycling"
    paymentRequired: Optional[bool] = False

class EventUpdateRequest(BaseModel):
    eventName: Optional[str] = None

    @field_validator("eventName")
    @classmethod
    def validate_event_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v.strip():
                raise ValueError("Event name cannot be empty")
            if not re.match(r"^[A-Za-z\s]+$", v.strip()):
                raise ValueError("Event name must contain only characters (letters and spaces, no numbers or symbols)")
            return v

    @field_validator("rideDate")
    @classmethod
    def validate_ride_date_update(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v.strip():
                raise ValueError("Ride date cannot be empty")
            date_str = v.strip()
            try:
                if "-" in date_str and len(date_str.split("-")[0]) == 4:
                    parsed = datetime.strptime(date_str, "%Y-%m-%d").date()
                else:
                    parsed = datetime.strptime(date_str, "%d-%m-%Y").date()
            except ValueError:
                raise ValueError("Ride date must be in YYYY-MM-DD format")
            if parsed < datetime.now().date():
                raise ValueError("Ride date cannot be in the past. Please select today or a future date.")
            return date_str
        return v.strip()
        return v
    description: Optional[str] = None
    location: Optional[str] = None
    rideDistance: Optional[str | int | float] = None
    rideDate: Optional[str] = None
    startTime: Optional[str] = None
    organizerName: Optional[str] = None
    status: Optional[EventStatus] = None
    routePoints: Optional[List[dict]] = None
    routeGeometry: Optional[List[List[float]]] = None
    startLocation: Optional[dict] = None
    finishLocation: Optional[dict] = None
    orderedCheckpointIds: Optional[List[str]] = None
    distanceKm: Optional[float] = None
    estimatedDurationMinutes: Optional[float] = None
    routeProfile: Optional[str] = None
    paymentRequired: Optional[bool] = None

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
    routePoints: Optional[List[dict]] = None
    routeGeometry: Optional[List[List[float]]] = None
    startLocation: Optional[dict] = None
    finishLocation: Optional[dict] = None
    orderedCheckpointIds: Optional[List[str]] = None
    distanceKm: Optional[float] = None
    estimatedDurationMinutes: Optional[float] = None
    routeProfile: Optional[str] = None
    paymentRequired: Optional[bool] = False
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
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None

class CheckpointUpdateRequest(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    sequenceNumber: Optional[int] = None
    mandatory: Optional[bool] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None

class CheckpointResponse(BaseModel):
    id: str
    eventId: str
    name: str
    type: str
    sequenceNumber: int
    mandatory: bool
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    createdAt: str
    updatedAt: str

# --------------------------------------------------
# RIDER SCHEMAS
# --------------------------------------------------
class RiderCreateRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_rider_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Rider name cannot be empty")
        if not re.match(r"^[A-Za-z\s]+$", v.strip()):
            raise ValueError("Rider name must contain only characters (letters and spaces, no numbers or symbols)")
        return v.strip()
    mobile: str
    emergencyContact: str
    bloodGroup: Optional[str] = "O+"
    age: Optional[int] = None
    gender: Optional[str] = "Male"
    club: Optional[str] = "Independent"
    bicycleType: Optional[str] = "Road Bike"
    jerseyNumber: Optional[int | str] = 101
    medicalNotes: Optional[str] = "None reported"
    paymentStatus: Optional[str] = "pending"

class RiderUpdateRequest(BaseModel):
    name: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_rider_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v.strip():
                raise ValueError("Rider name cannot be empty")
            if not re.match(r"^[A-Za-z\s]+$", v.strip()):
                raise ValueError("Rider name must contain only characters (letters and spaces, no numbers or symbols)")
            return v.strip()
        return v
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
    paymentStatus: Optional[str] = None

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
    paymentStatus: Optional[str] = "pending"
    paymentRequired: Optional[bool] = False
    createdAt: str
    updatedAt: str
    timeline: Optional[List[dict]] = []

class RiderPaymentUpdateRequest(BaseModel):
    paymentStatus: str

# --------------------------------------------------
# VOLUNTEER SCHEMAS
# --------------------------------------------------
class VolunteerCreateRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_volunteer_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Volunteer name cannot be empty")
        if not re.match(r"^[A-Za-z\s]+$", v.strip()):
            raise ValueError("Volunteer name must contain only characters (letters and spaces, no numbers or symbols)")
        return v.strip()
    mobile: str
    email: Optional[str] = None
    password: Optional[str] = None
    checkpointId: Optional[str] = None
    checkpointName: Optional[str] = None
    status: str = "Assigned"

class VolunteerUpdateRequest(BaseModel):
    name: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_volunteer_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            if not v.strip():
                raise ValueError("Volunteer name cannot be empty")
            if not re.match(r"^[A-Za-z\s]+$", v.strip()):
                raise ValueError("Volunteer name must contain only characters (letters and spaces, no numbers or symbols)")
            return v.strip()
        return v
    mobile: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
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
    email: Optional[str] = None
    status: str
    createdAt: str
    updatedAt: str

# --------------------------------------------------
# SCAN SCHEMAS
# --------------------------------------------------
class ScanValidateRequest(BaseModel):
    riderId: str
    eventId: str
    checkpointId: str

class ScanValidateResponse(BaseModel):
    riderId: str
    riderName: str
    jerseyNumber: str
    eventId: str
    eventName: str
    checkpointId: str
    checkpointName: str
    scanTime: str

class ScanRecordRequest(BaseModel):
    clientScanId: str
    riderId: str
    eventId: str
    checkpointId: str
    scanTime: Optional[str] = None
    deviceLatitude: Optional[float] = None
    deviceLongitude: Optional[float] = None

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
    checkpointLatitude: Optional[float] = None
    checkpointLongitude: Optional[float] = None
    deviceLatitude: Optional[float] = None
    deviceLongitude: Optional[float] = None
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

