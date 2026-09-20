import httpx
import logging
from typing import List, Optional, Tuple
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel
from backend.app.models.schemas import APIResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/routes", tags=["Routes"])

class RouteWaypoint(BaseModel):
    lat: float
    lng: float
    name: Optional[str] = None

class DirectionsResponseData(BaseModel):
    coordinates: List[List[float]]  # GeoJSON format: [[lng, lat], ...]
    distanceKm: float
    estimatedDurationMinutes: float
    waypoints: List[RouteWaypoint]
    profile: str
    provider: str

class GeocodeResult(BaseModel):
    displayName: str
    lat: float
    lng: float
    type: Optional[str] = None

# OpenStreetMap OSRM endpoints (bike profile with driving fallback)
ROUTING_ENDPOINTS = [
    ("https://routing.openstreetmap.de/routed-bike/route/v1/driving/{coords}?overview=full&geometries=geojson", "OpenStreetMap-Bike"),
    ("https://router.project-osrm.org/route/v1/driving/{coords}?overview=full&geometries=geojson", "OSRM-Global"),
]

NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"

@router.get("/directions", response_model=APIResponse)
async def get_directions(
    coordinates: str = Query(
        ...,
        description="Semicolon-separated list of lng,lat pairs. E.g. '73.8567,18.5204;73.7997,18.6298;73.4065,18.7542'",
    ),
    profile: str = Query("cycling", description="Route profile: cycling, road, driving"),
):
    """
    Calculate a real road-following route along cycling-appropriate roads using OpenStreetMap routing engines.
    Returns GeoJSON LineString coordinates (hundreds/thousands of road vertices), distance in km, and duration.
    """
    raw_coords = coordinates.strip()
    points = raw_coords.split(";")
    if len(points) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_COORDINATES", "message": "At least 2 coordinate pairs (START and FINISH) are required for route calculation."},
        )

    # Validate coordinate formats
    parsed_waypoints: List[RouteWaypoint] = []
    for p in points:
        parts = p.split(",")
        if len(parts) != 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "INVALID_COORDINATES", "message": f"Invalid coordinate format '{p}'. Expected 'lng,lat'."},
            )
        try:
            lng = float(parts[0].strip())
            lat = float(parts[1].strip())
            if not (-180 <= lng <= 180 and -90 <= lat <= 90):
                raise ValueError()
            parsed_waypoints.append(RouteWaypoint(lat=lat, lng=lng))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "INVALID_COORDINATES", "message": f"Coordinates '{p}' out of valid geographic range."},
            )

    # Query routing providers with fallback
    async with httpx.AsyncClient(timeout=15.0) as client:
        last_error = None
        for endpoint_template, provider_name in ROUTING_ENDPOINTS:
            url = endpoint_template.format(coords=raw_coords)
            try:
                res = await client.get(url, headers={"User-Agent": "RideTrack-Routing-Engine/1.0"})
                if res.status_code == 200:
                    data = res.json()
                    routes = data.get("routes", [])
                    if routes and len(routes) > 0:
                        primary_route = routes[0]
                        geometry = primary_route.get("geometry", {})
                        coords = geometry.get("coordinates", [])
                        distance_meters = primary_route.get("distance", 0.0)
                        duration_seconds = primary_route.get("duration", 0.0)

                        distance_km = round(distance_meters / 1000.0, 2)
                        duration_mins = round(duration_seconds / 60.0, 1)

                        return APIResponse(
                            success=True,
                            data=DirectionsResponseData(
                                coordinates=coords,
                                distanceKm=distance_km,
                                estimatedDurationMinutes=duration_mins,
                                waypoints=parsed_waypoints,
                                profile=profile,
                                provider=provider_name,
                            ).model_dump(),
                        )
                    else:
                        last_error = "No road-following route found connecting the selected waypoints."
                else:
                    last_error = f"Routing provider returned HTTP {res.status_code}: {res.text[:120]}"
            except Exception as e:
                logger.warning(f"Routing provider {provider_name} failed: {e}")
                last_error = str(e)

        # If external routing failed or is temporarily unreachable, return 502 with helpful details
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={
                "code": "ROUTING_SERVICE_ERROR",
                "message": f"Could not calculate road route: {last_error or 'Network route calculation unavailable.'}",
            },
        )

@router.get("/geocode", response_model=APIResponse)
async def geocode_location(
    q: str = Query(..., min_length=2, description="Search query for location, city, or landmark"),
    limit: int = Query(5, ge=1, le=10),
):
    """
    Geocode search for places, cities, and landmarks to pan/zoom the organizer route map.
    """
    query = q.strip()
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            res = await client.get(
                NOMINATIM_SEARCH_URL,
                params={"q": query, "format": "json", "limit": limit, "addressdetails": 1},
                headers={"User-Agent": "RideTrack-LocationSearch/1.0"},
            )
            if res.status_code == 200:
                results = []
                for item in res.json():
                    results.append(
                        GeocodeResult(
                            displayName=item.get("display_name", ""),
                            lat=float(item.get("lat")),
                            lng=float(item.get("lon")),
                            type=item.get("type"),
                        ).model_dump()
                    )
                return APIResponse(success=True, data=results)
            else:
                return APIResponse(success=True, data=[])
        except Exception as e:
            logger.warning(f"Geocoding error for '{query}': {e}")
            return APIResponse(success=True, data=[])
