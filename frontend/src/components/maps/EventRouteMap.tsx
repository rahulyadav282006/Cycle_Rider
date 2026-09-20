import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  InputAdornment,
  Paper,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import EditLocationAltOutlinedIcon from '@mui/icons-material/EditLocationAltOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FlagIcon from '@mui/icons-material/Flag';
import TuneIcon from '@mui/icons-material/Tune';
import L from 'leaflet';
import { colors } from '../../theme/colors';
import {
  RoutePoint,
  CheckpointItem,
  routeService,
  GeocodeLocationResult,
} from '../../api/services';

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface EventRouteMapProps {
  startLocation?: LocationPoint | null;
  finishLocation?: LocationPoint | null;
  routePoints?: RoutePoint[]; // intermediate waypoints
  routeGeometry?: [number, number][]; // GeoJSON [lng, lat] along roads
  checkpoints?: Partial<CheckpointItem>[];
  editable?: boolean;
  onStartLocationChange?: (loc: LocationPoint | null) => void;
  onFinishLocationChange?: (loc: LocationPoint | null) => void;
  onRoutePointsChange?: (points: RoutePoint[]) => void;
  onRouteGeometryChange?: (
    geometry: [number, number][],
    distanceKm: number,
    durationMinutes: number
  ) => void;
  onCheckpointsChange?: (checkpoints: Partial<CheckpointItem>[]) => void;
  height?: number | string;
  title?: string;
  subtitle?: string;
}

export const EventRouteMap: React.FC<EventRouteMapProps> = ({
  startLocation: initialStart = null,
  finishLocation: initialFinish = null,
  routePoints = [],
  routeGeometry = [],
  checkpoints = [],
  editable = false,
  onStartLocationChange,
  onFinishLocationChange,
  onRoutePointsChange,
  onRouteGeometryChange,
  onCheckpointsChange,
  height = 480,
  title = 'Real Cycling Route & Checkpoints',
  subtitle = 'Search Start and Finish locations to calculate a real road-following cycling route, then add checkpoints on the map.',
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const roadPolylineRef = useRef<L.Polyline | null>(null);
  const directPolylineRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Core Routing States
  const [startLoc, setStartLoc] = useState<LocationPoint | null>(initialStart);
  const [finishLoc, setFinishLoc] = useState<LocationPoint | null>(initialFinish);
  const [waypoints, setWaypoints] = useState<RoutePoint[]>(routePoints);
  const [currentGeometry, setCurrentGeometry] = useState<[number, number][]>(routeGeometry);
  const [currentCheckpoints, setCurrentCheckpoints] = useState<Partial<CheckpointItem>[]>(checkpoints);

  // Interaction Modes: 'default' | 'adjust' (adding waypoints) | 'checkpoint' (adding checkpoint)
  const [activeMode, setActiveMode] = useState<'default' | 'adjust' | 'checkpoint'>('default');

  // Routing status states
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [routeStats, setRouteStats] = useState<{ distanceKm: number; durationMinutes: number } | null>(null);
  const [routingError, setRoutingError] = useState<string | null>(null);

  // Location Search states (Start)
  const [startSearchQuery, setStartSearchQuery] = useState<string>('');
  const [isSearchingStart, setIsSearchingStart] = useState<boolean>(false);
  const [startSearchResults, setStartSearchResults] = useState<GeocodeLocationResult[]>([]);
  const [showStartResults, setShowStartResults] = useState<boolean>(false);

  // Location Search states (Finish)
  const [finishSearchQuery, setFinishSearchQuery] = useState<string>('');
  const [isSearchingFinish, setIsSearchingFinish] = useState<boolean>(false);
  const [finishSearchResults, setFinishSearchResults] = useState<GeocodeLocationResult[]>([]);
  const [showFinishResults, setShowFinishResults] = useState<boolean>(false);

  // Checkpoint Modal State for on-map checkpoint creation / editing
  const [cpModalOpen, setCpModalOpen] = useState<boolean>(false);
  const [editingCpId, setEditingCpId] = useState<string | null>(null);
  const [pendingCpCoords, setPendingCpCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [newCpName, setNewCpName] = useState<string>('');
  const [newCpType, setNewCpType] = useState<string>('Timing');
  const [newCpSequence, setNewCpSequence] = useState<number>(checkpoints.length + 1);
  const [newCpMandatory, setNewCpMandatory] = useState<boolean>(true);

  // Sync props when they change externally
  useEffect(() => {
    if (initialStart) setStartLoc(initialStart);
  }, [initialStart]);

  useEffect(() => {
    if (initialFinish) setFinishLoc(initialFinish);
  }, [initialFinish]);

  useEffect(() => {
    setWaypoints(routePoints);
  }, [routePoints]);

  useEffect(() => {
    setCurrentGeometry(routeGeometry);
  }, [routeGeometry]);

  useEffect(() => {
    setCurrentCheckpoints(checkpoints);
  }, [checkpoints]);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = startLoc
        ? [startLoc.lat, startLoc.lng]
        : finishLoc
        ? [finishLoc.lat, finishLoc.lng]
        : currentCheckpoints.length > 0 && currentCheckpoints[0].latitude && currentCheckpoints[0].longitude
        ? [currentCheckpoints[0].latitude, currentCheckpoints[0].longitude]
        : [18.5204, 73.8567]; // Default to Pune region

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 11,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      // Road-following polyline (blue with high contrast)
      const roadPolyline = L.polyline([], {
        color: '#2563EB',
        weight: 6,
        opacity: 0.9,
        smoothFactor: 1,
      }).addTo(map);
      roadPolylineRef.current = roadPolyline;

      // Fallback direct connector
      const directPolyline = L.polyline([], {
        color: '#94A3B8',
        weight: 3,
        opacity: 0.6,
        dashArray: '6, 8',
      }).addTo(map);
      directPolylineRef.current = directPolyline;

      mapInstanceRef.current = map;
      (window as any).__eventRouteMap = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      (window as any).__eventRouteMap = null;
    };
  }, []);

  // 2. Perform Real Road Route Calculation
  const handleCalculateRoute = useCallback(
    async (
      customStart?: LocationPoint | null,
      customFinish?: LocationPoint | null,
      customWaypoints?: RoutePoint[]
    ) => {
      const s = customStart !== undefined ? customStart : startLoc;
      const f = customFinish !== undefined ? customFinish : finishLoc;
      const wps = customWaypoints !== undefined ? customWaypoints : waypoints;

      if (!s || !f) {
        setRoutingError('Please select both a Start location and a Finish location.');
        return;
      }

      setIsCalculatingRoute(true);
      setRoutingError(null);

      try {
        // Construct coordinate pairs: [[startLng, startLat], ...[wpLng, wpLat], [finishLng, finishLat]]
        const allCoords: [number, number][] = [
          [s.lng, s.lat],
          ...wps.map((p) => [p.lng, p.lat] as [number, number]),
          [f.lng, f.lat],
        ];

        const result = await routeService.calculateRoute(allCoords, 'cycling');

        if (result.coordinates && result.coordinates.length > 0) {
          setCurrentGeometry(result.coordinates);
          setRouteStats({
            distanceKm: result.distanceKm,
            durationMinutes: result.estimatedDurationMinutes,
          });

          // Fit map view to calculated road route
          if (mapInstanceRef.current) {
            const latLngs = result.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
            const bounds = L.latLngBounds(latLngs);
            mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
          }

          if (onRouteGeometryChange) {
            onRouteGeometryChange(
              result.coordinates,
              result.distanceKm,
              result.estimatedDurationMinutes
            );
          }
        }
      } catch (err: any) {
        const msg = err?.message || 'Could not calculate road route. Please verify locations and connectivity.';
        setRoutingError(msg);
      } finally {
        setIsCalculatingRoute(false);
      }
    },
    [startLoc, finishLoc, waypoints, onRouteGeometryChange]
  );

  // 3. Search Start Location Handler
  const handleSearchStart = async (query: string) => {
    if (!query.trim() || query.trim().length < 2) return;
    setIsSearchingStart(true);
    try {
      const results = await routeService.searchLocation(query.trim());
      setStartSearchResults(results);
      setShowStartResults(true);
    } catch {
      setStartSearchResults([]);
    } finally {
      setIsSearchingStart(false);
    }
  };

  const handleSelectStartLocation = (res: GeocodeLocationResult) => {
    const loc: LocationPoint = {
      name: res.displayName.split(',')[0].trim(),
      lat: res.lat,
      lng: res.lng,
    };
    setStartLoc(loc);
    setStartSearchQuery(loc.name);
    setShowStartResults(false);
    setStartSearchResults([]);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([loc.lat, loc.lng], 13);
    }

    if (onStartLocationChange) onStartLocationChange(loc);

    // If finish already selected, update combined route points
    const newRoutePoints: RoutePoint[] = [
      { lat: loc.lat, lng: loc.lng, name: `Start: ${loc.name}` },
      ...waypoints,
      ...(finishLoc ? [{ lat: finishLoc.lat, lng: finishLoc.lng, name: `Finish: ${finishLoc.name}` }] : []),
    ];
    if (onRoutePointsChange) onRoutePointsChange(newRoutePoints);
  };

  // 4. Search Finish Location Handler
  const handleSearchFinish = async (query: string) => {
    if (!query.trim() || query.trim().length < 2) return;
    setIsSearchingFinish(true);
    try {
      const results = await routeService.searchLocation(query.trim());
      setFinishSearchResults(results);
      setShowFinishResults(true);
    } catch {
      setFinishSearchResults([]);
    } finally {
      setIsSearchingFinish(false);
    }
  };

  const handleSelectFinishLocation = (res: GeocodeLocationResult) => {
    const loc: LocationPoint = {
      name: res.displayName.split(',')[0].trim(),
      lat: res.lat,
      lng: res.lng,
    };
    setFinishLoc(loc);
    setFinishSearchQuery(loc.name);
    setShowFinishResults(false);
    setFinishSearchResults([]);

    if (mapInstanceRef.current) {
      if (startLoc) {
        const bounds = L.latLngBounds([[startLoc.lat, startLoc.lng], [loc.lat, loc.lng]]);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      } else {
        mapInstanceRef.current.setView([loc.lat, loc.lng], 13);
      }
    }

    if (onFinishLocationChange) onFinishLocationChange(loc);

    // Update combined route points
    const newRoutePoints: RoutePoint[] = [
      ...(startLoc ? [{ lat: startLoc.lat, lng: startLoc.lng, name: `Start: ${startLoc.name}` }] : []),
      ...waypoints,
      { lat: loc.lat, lng: loc.lng, name: `Finish: ${loc.name}` },
    ];
    if (onRoutePointsChange) onRoutePointsChange(newRoutePoints);
  };

  useEffect(() => {
    (window as any).__setStartLocation = (loc: LocationPoint) => handleSelectStartLocation({ displayName: loc.name, lat: loc.lat, lng: loc.lng });
    (window as any).__setFinishLocation = (loc: LocationPoint) => handleSelectFinishLocation({ displayName: loc.name, lat: loc.lat, lng: loc.lng });
    (window as any).__calculateRoadRoute = (s?: LocationPoint, f?: LocationPoint) => handleCalculateRoute(s, f);
    (window as any).__openCheckpointModal = (lat: number, lng: number) => {
      setPendingCpCoords({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
      setEditingCpId(null);
      const nextSeq = currentCheckpoints.length + 1;
      setNewCpName(`CP ${String(nextSeq).padStart(2, '0')} - Station`);
      setNewCpSequence(nextSeq);
      setNewCpType('Timing');
      setNewCpMandatory(true);
      setCpModalOpen(true);
    };
    (window as any).__addCheckpointDirectly = (name: string, lat: number, lng: number, type: string = 'Timing', seq?: number) => {
      const nextSeq = seq !== undefined ? seq : currentCheckpoints.length + 1;
      const newCp: Partial<CheckpointItem> = {
        id: `cp-map-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: name,
        type: type,
        sequenceNumber: nextSeq,
        mandatory: true,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
      };
      const updated = [...currentCheckpoints, newCp];
      setCurrentCheckpoints(updated);
      if (onCheckpointsChange) onCheckpointsChange(updated);
      return newCp;
    };
    (window as any).__moveCheckpoint = (cpId: string, newLat: number, newLng: number) => {
      handleCheckpointDragEnd(cpId, newLat, newLng);
    };
  });

  // 5. Handle Map Click according to active mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!editable) return;

      const clickedLat = Number(e.latlng.lat.toFixed(6));
      const clickedLng = Number(e.latlng.lng.toFixed(6));

      if (activeMode === 'checkpoint') {
        // Automatically capture Lat/Lng for new checkpoint!
        setPendingCpCoords({ lat: clickedLat, lng: clickedLng });
        setEditingCpId(null);
        const nextSeq = currentCheckpoints.length + 1;
        setNewCpName(`CP ${String(nextSeq).padStart(2, '0')} - Station`);
        setNewCpSequence(nextSeq);
        setNewCpType('Timing');
        setNewCpMandatory(true);
        setCpModalOpen(true);
      } else if (activeMode === 'adjust') {
        // Add road waypoint to adjust the route
        const newWp: RoutePoint = {
          lat: clickedLat,
          lng: clickedLng,
          name: `Waypoint ${waypoints.length + 1}`,
        };
        const updatedWps = [...waypoints, newWp];
        setWaypoints(updatedWps);

        const newRoutePoints: RoutePoint[] = [
          ...(startLoc ? [{ lat: startLoc.lat, lng: startLoc.lng, name: `Start: ${startLoc.name}` }] : []),
          ...updatedWps,
          ...(finishLoc ? [{ lat: finishLoc.lat, lng: finishLoc.lng, name: `Finish: ${finishLoc.name}` }] : []),
        ];
        if (onRoutePointsChange) onRoutePointsChange(newRoutePoints);

        // Recalculate route with new waypoint if start and finish exist
        if (startLoc && finishLoc) {
          handleCalculateRoute(startLoc, finishLoc, updatedWps);
        }
      } else {
        // If neither start nor finish is set, map click sets them directly!
        if (!startLoc) {
          const loc: LocationPoint = {
            name: `Start (${clickedLat}, ${clickedLng})`,
            lat: clickedLat,
            lng: clickedLng,
          };
          setStartLoc(loc);
          setStartSearchQuery(loc.name);
          if (onStartLocationChange) onStartLocationChange(loc);
        } else if (!finishLoc) {
          const loc: LocationPoint = {
            name: `Finish (${clickedLat}, ${clickedLng})`,
            lat: clickedLat,
            lng: clickedLng,
          };
          setFinishLoc(loc);
          setFinishSearchQuery(loc.name);
          if (onFinishLocationChange) onFinishLocationChange(loc);
        }
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [
    editable,
    activeMode,
    startLoc,
    finishLoc,
    waypoints,
    currentCheckpoints,
    onStartLocationChange,
    onFinishLocationChange,
    onRoutePointsChange,
    handleCalculateRoute,
  ]);

  // 6. Save or Update Checkpoint from Modal
  const handleSaveCheckpoint = () => {
    if (!pendingCpCoords) return;

    if (editingCpId) {
      // Update existing checkpoint details
      const updated = currentCheckpoints.map((cp) => {
        if (cp.id === editingCpId) {
          return {
            ...cp,
            name: newCpName.trim(),
            type: newCpType,
            sequenceNumber: newCpSequence,
            mandatory: newCpMandatory,
            latitude: pendingCpCoords.lat,
            longitude: pendingCpCoords.lng,
          };
        }
        return cp;
      });
      setCurrentCheckpoints(updated);
      if (onCheckpointsChange) onCheckpointsChange(updated);
    } else {
      // Create new checkpoint with auto-captured coordinates
      const newCp: Partial<CheckpointItem> = {
        id: `cp-map-${Date.now()}`,
        name: newCpName.trim() || `Checkpoint ${currentCheckpoints.length + 1}`,
        type: newCpType,
        sequenceNumber: newCpSequence,
        mandatory: newCpMandatory,
        latitude: pendingCpCoords.lat,
        longitude: pendingCpCoords.lng,
      };

      const updated = [...currentCheckpoints, newCp];
      setCurrentCheckpoints(updated);
      if (onCheckpointsChange) onCheckpointsChange(updated);
    }

    setCpModalOpen(false);
    setEditingCpId(null);
    setPendingCpCoords(null);
  };

  // 7. Handle Checkpoint Drag End (Real-time auto-coordinate capture on map)
  const handleCheckpointDragEnd = useCallback(
    (cpId: string | undefined, newLat: number, newLng: number) => {
      if (!cpId) return;
      setCurrentCheckpoints((prev) => {
        const updated = prev.map((cp) => {
          if (cp.id === cpId) {
            return {
              ...cp,
              latitude: Number(newLat.toFixed(6)),
              longitude: Number(newLng.toFixed(6)),
            };
          }
          return cp;
        });
        if (onCheckpointsChange) {
          onCheckpointsChange(updated);
        }
        return updated;
      });
    },
    [onCheckpointsChange]
  );

  // 8. Render Polylines and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const roadPolyline = roadPolylineRef.current;
    const directPolyline = directPolylineRef.current;
    if (!map || !markersGroup || !roadPolyline || !directPolyline) return;

    markersGroup.clearLayers();

    // A. Road Polyline
    if (currentGeometry && currentGeometry.length > 0) {
      const roadLatLngs: [number, number][] = currentGeometry.map(([lng, lat]) => [lat, lng]);
      roadPolyline.setLatLngs(roadLatLngs);
      directPolyline.setLatLngs([]);
    } else {
      roadPolyline.setLatLngs([]);
      // Straight line fallback if both start and finish exist
      if (startLoc && finishLoc) {
        directPolyline.setLatLngs([
          [startLoc.lat, startLoc.lng],
          ...waypoints.map((w) => [w.lat, w.lng] as [number, number]),
          [finishLoc.lat, finishLoc.lng],
        ]);
      } else {
        directPolyline.setLatLngs([]);
      }
    }

    // B. START Marker (Green Flag)
    if (startLoc) {
      const startIcon = L.divIcon({
        className: 'rt-start-marker',
        html: `<div style="
          background: #16A34A;
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          border-radius: 9999px;
          padding: 5px 10px;
          border: 2px solid #ffffff;
          box-shadow: 0 3px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          cursor: pointer;
        ">
          🚩 START
        </div>`,
        iconSize: [76, 26],
        iconAnchor: [38, 26],
      });

      const startMarker = L.marker([startLoc.lat, startLoc.lng], { icon: startIcon });
      startMarker.bindPopup(`<b>🚩 START LOCATION</b><br/>${startLoc.name}<br/>Lat: ${startLoc.lat}, Lng: ${startLoc.lng}`);
      startMarker.addTo(markersGroup);
    }

    // C. FINISH Marker (Red Flag)
    if (finishLoc) {
      const finishIcon = L.divIcon({
        className: 'rt-finish-marker',
        html: `<div style="
          background: #DC2626;
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          border-radius: 9999px;
          padding: 5px 10px;
          border: 2px solid #ffffff;
          box-shadow: 0 3px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          cursor: pointer;
        ">
          🏁 FINISH
        </div>`,
        iconSize: [80, 26],
        iconAnchor: [40, 26],
      });

      const finishMarker = L.marker([finishLoc.lat, finishLoc.lng], { icon: finishIcon });
      finishMarker.bindPopup(`<b>🏁 FINISH LOCATION</b><br/>${finishLoc.name}<br/>Lat: ${finishLoc.lat}, Lng: ${finishLoc.lng}`);
      finishMarker.addTo(markersGroup);
    }

    // D. Waypoint Markers (if adjust route mode was used)
    waypoints.forEach((wp, idx) => {
      const wpIcon = L.divIcon({
        className: 'rt-waypoint-marker',
        html: `<div style="
          background: #0284C7;
          color: #ffffff;
          font-weight: 700;
          font-size: 11px;
          border-radius: 9999px;
          padding: 3px 8px;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          white-space: nowrap;
          cursor: pointer;
        ">
          WP ${idx + 1}
        </div>`,
        iconSize: [48, 22],
        iconAnchor: [24, 22],
      });

      const wpMarker = L.marker([wp.lat, wp.lng], { icon: wpIcon });
      wpMarker.bindPopup(`<b>Waypoint ${idx + 1}</b><br/>Lat: ${wp.lat}, Lng: ${wp.lng}`);
      wpMarker.addTo(markersGroup);
    });

    // E. Checkpoint Markers (Purple Badges with Drag & Popup)
    currentCheckpoints.forEach((cp, idx) => {
      if (cp.latitude && cp.longitude) {
        const cpNumber = cp.sequenceNumber !== undefined ? cp.sequenceNumber : idx + 1;
        const isMandatory = cp.mandatory !== false;

        const cpIcon = L.divIcon({
          className: 'rt-checkpoint-marker',
          html: `<div style="
            background: ${isMandatory ? '#7C3AED' : '#64748B'};
            color: #ffffff;
            font-weight: 800;
            font-size: 11px;
            border-radius: 6px;
            padding: 4px 8px;
            border: 2px solid #ffffff;
            box-shadow: 0 3px 12px rgba(124, 58, 237, 0.45);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            cursor: pointer;
          ">
            <span>CP ${String(cpNumber).padStart(2, '0')}</span>
          </div>`,
          iconSize: [56, 24],
          iconAnchor: [28, 24],
        });

        const cpMarker = L.marker([cp.latitude, cp.longitude], {
          icon: cpIcon,
          draggable: editable,
        });

        const popupContent = document.createElement('div');
        popupContent.style.minWidth = '170px';
        popupContent.innerHTML = `
          <div style="font-weight: 700; color: #7C3AED; margin-bottom: 2px;">CP ${String(cpNumber).padStart(2, '0')}: ${cp.name || 'Checkpoint'}</div>
          <div style="font-size: 12px; color: #475569;">Type: ${cp.type || 'Timing'} (${isMandatory ? 'Mandatory' : 'Optional'})</div>
          <div style="font-size: 11px; color: #64748B; font-family: monospace; margin-top: 4px;">Lat: ${cp.latitude}<br/>Lng: ${cp.longitude}</div>
          ${editable ? '<div style="font-size: 11px; color: #0284C7; margin-top: 4px; font-style: italic;">Drag to move on road</div>' : ''}
        `;

        if (editable) {
          const editBtn = document.createElement('button');
          editBtn.innerText = 'Edit Checkpoint';
          editBtn.style.marginTop = '6px';
          editBtn.style.padding = '3px 8px';
          editBtn.style.fontSize = '11px';
          editBtn.style.fontWeight = '600';
          editBtn.style.background = '#7C3AED';
          editBtn.style.color = '#fff';
          editBtn.style.border = 'none';
          editBtn.style.borderRadius = '4px';
          editBtn.style.cursor = 'pointer';
          editBtn.onclick = () => {
            setEditingCpId(cp.id || null);
            setPendingCpCoords({ lat: cp.latitude!, lng: cp.longitude! });
            setNewCpName(cp.name || `CP ${String(cpNumber).padStart(2, '0')}`);
            setNewCpType(cp.type || 'Timing');
            setNewCpSequence(cpNumber);
            setNewCpMandatory(isMandatory);
            setCpModalOpen(true);
          };
          popupContent.appendChild(editBtn);
        }

        cpMarker.bindPopup(popupContent);

        if (editable) {
          cpMarker.on('dragend', (e: any) => {
            const newPos = e.target.getLatLng();
            handleCheckpointDragEnd(cp.id, newPos.lat, newPos.lng);
          });
        }

        cpMarker.addTo(markersGroup);
      }
    });
  }, [
    startLoc,
    finishLoc,
    waypoints,
    currentGeometry,
    currentCheckpoints,
    editable,
    handleCheckpointDragEnd,
  ]);

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${colors.surface.border}`,
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
        bgcolor: colors.surface.card,
      }}
    >
      {/* 1. Header & Location Search Panel */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          bgcolor: '#FFFFFF',
          borderBottom: `1px solid ${colors.surface.border}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: colors.text.primary }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 2 }}>
          {subtitle}
        </Typography>

        {/* Start and Finish Location Search Inputs */}
        {editable && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              mb: 2,
            }}
          >
            {/* START LOCATION SEARCH */}
            <Box sx={{ position: 'relative' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <FlagIcon sx={{ fontSize: 14 }} /> START LOCATION
              </Typography>
              <TextField
                id="input-start-search"
                size="small"
                fullWidth
                placeholder="Search starting city/town (e.g. Pune)..."
                value={startSearchQuery}
                onChange={(e) => {
                  setStartSearchQuery(e.target.value);
                  handleSearchStart(e.target.value);
                }}
                onFocus={() => {
                  if (startSearchResults.length > 0) setShowStartResults(true);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {isSearchingStart ? <CircularProgress size={16} /> : <SearchIcon sx={{ color: '#16A34A', fontSize: 18 }} />}
                      </InputAdornment>
                    ),
                    endAdornment: startLoc ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setStartLoc(null);
                            setStartSearchQuery('');
                            if (onStartLocationChange) onStartLocationChange(null);
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    bgcolor: '#F8FAFC',
                    fontSize: '0.85rem',
                  },
                }}
              />

              {/* Start Location Suggestions Dropdown */}
              {showStartResults && startSearchResults.length > 0 && (
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    top: 64,
                    left: 0,
                    right: 0,
                    zIndex: 1100,
                    maxHeight: 220,
                    overflowY: 'auto',
                    borderRadius: 1.5,
                  }}
                >
                  <List dense disablePadding>
                    {startSearchResults.map((res, idx) => (
                      <ListItemButton
                        key={idx}
                        id={`start-suggestion-${idx}`}
                        className="start-suggestion-item"
                        onClick={() => handleSelectStartLocation(res)}
                        sx={{ py: 0.75, borderBottom: `1px solid ${colors.surface.border}` }}
                      >
                        <ListItemText
                          primary={res.displayName.split(',')[0]}
                          secondary={res.displayName}
                          slotProps={{
                            primary: { sx: { fontWeight: 600, fontSize: '0.82rem' } },
                            secondary: { sx: { fontSize: '0.72rem' }, noWrap: true },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}

              {startLoc && (
                <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 600, mt: 0.5, display: 'block' }}>
                  ✓ Selected: {startLoc.name} ({startLoc.lat}, {startLoc.lng})
                </Typography>
              )}
            </Box>

            {/* FINISH LOCATION SEARCH */}
            <Box sx={{ position: 'relative' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <FlagIcon sx={{ fontSize: 14 }} /> FINISH LOCATION
              </Typography>
              <TextField
                id="input-finish-search"
                size="small"
                fullWidth
                placeholder="Search finishing city/town (e.g. Lonavala)..."
                value={finishSearchQuery}
                onChange={(e) => {
                  setFinishSearchQuery(e.target.value);
                  handleSearchFinish(e.target.value);
                }}
                onFocus={() => {
                  if (finishSearchResults.length > 0) setShowFinishResults(true);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        {isSearchingFinish ? <CircularProgress size={16} /> : <SearchIcon sx={{ color: '#DC2626', fontSize: 18 }} />}
                      </InputAdornment>
                    ),
                    endAdornment: finishLoc ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setFinishLoc(null);
                            setFinishSearchQuery('');
                            if (onFinishLocationChange) onFinishLocationChange(null);
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    bgcolor: '#F8FAFC',
                    fontSize: '0.85rem',
                  },
                }}
              />

              {/* Finish Location Suggestions Dropdown */}
              {showFinishResults && finishSearchResults.length > 0 && (
                <Paper
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    top: 64,
                    left: 0,
                    right: 0,
                    zIndex: 1100,
                    maxHeight: 220,
                    overflowY: 'auto',
                    borderRadius: 1.5,
                  }}
                >
                  <List dense disablePadding>
                    {finishSearchResults.map((res, idx) => (
                      <ListItemButton
                        key={idx}
                        id={`finish-suggestion-${idx}`}
                        className="finish-suggestion-item"
                        onClick={() => handleSelectFinishLocation(res)}
                        sx={{ py: 0.75, borderBottom: `1px solid ${colors.surface.border}` }}
                      >
                        <ListItemText
                          primary={res.displayName.split(',')[0]}
                          secondary={res.displayName}
                          slotProps={{
                            primary: { sx: { fontWeight: 600, fontSize: '0.82rem' } },
                            secondary: { sx: { fontSize: '0.72rem' }, noWrap: true },
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}

              {finishLoc && (
                <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600, mt: 0.5, display: 'block' }}>
                  ✓ Selected: {finishLoc.name} ({finishLoc.lat}, {finishLoc.lng})
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Primary Action Buttons */}
        {editable && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, pt: 0.5 }}>
            {/* 1. Calculate Route Button */}
            <Button
              id="btn-calculate-route"
              variant="contained"
              size="small"
              onClick={() => handleCalculateRoute()}
              disabled={!startLoc || !finishLoc || isCalculatingRoute}
              startIcon={isCalculatingRoute ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <DirectionsBikeIcon />}
              sx={{
                bgcolor: '#2563EB',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                '&:hover': { bgcolor: '#1D4ED8' },
              }}
            >
              {isCalculatingRoute ? 'Calculating Cycling Route...' : 'Calculate Route'}
            </Button>

            {/* 2. Add Checkpoint Button */}
            <Button
              id="btn-add-checkpoint"
              variant={activeMode === 'checkpoint' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setActiveMode((m) => (m === 'checkpoint' ? 'default' : 'checkpoint'))}
              startIcon={<AddLocationAltOutlinedIcon />}
              sx={{
                bgcolor: activeMode === 'checkpoint' ? '#7C3AED' : 'transparent',
                color: activeMode === 'checkpoint' ? '#fff' : '#7C3AED',
                borderColor: '#7C3AED',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 1.5,
                px: 2,
                py: 0.75,
                '&:hover': {
                  bgcolor: activeMode === 'checkpoint' ? '#6D28D9' : 'rgba(124, 58, 237, 0.08)',
                },
              }}
            >
              {activeMode === 'checkpoint' ? '✓ Click Map to Drop Pin' : '+ Add Checkpoint'} ({currentCheckpoints.length})
            </Button>

            {/* 3. Optional Adjust Route Button */}
            <Button
              id="btn-adjust-route"
              variant={activeMode === 'adjust' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setActiveMode((m) => (m === 'adjust' ? 'default' : 'adjust'))}
              startIcon={<TuneIcon />}
              sx={{
                bgcolor: activeMode === 'adjust' ? '#0284C7' : 'transparent',
                color: activeMode === 'adjust' ? '#fff' : colors.text.secondary,
                borderColor: colors.surface.borderStrong,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 1.5,
                px: 1.75,
                py: 0.75,
              }}
            >
              {activeMode === 'adjust' ? 'Adjust Mode Active' : 'Adjust Route'}
            </Button>

            {/* Clear Waypoints if any */}
            {waypoints.length > 0 && (
              <Button
                size="small"
                variant="text"
                color="secondary"
                onClick={() => {
                  setWaypoints([]);
                  const newRoutePoints: RoutePoint[] = [
                    ...(startLoc ? [{ lat: startLoc.lat, lng: startLoc.lng, name: `Start: ${startLoc.name}` }] : []),
                    ...(finishLoc ? [{ lat: finishLoc.lat, lng: finishLoc.lng, name: `Finish: ${finishLoc.name}` }] : []),
                  ];
                  if (onRoutePointsChange) onRoutePointsChange(newRoutePoints);
                  if (startLoc && finishLoc) handleCalculateRoute(startLoc, finishLoc, []);
                }}
                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
              >
                Reset Adjustments ({waypoints.length})
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* 2. Route Metrics & Active Guidance Banner */}
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: '#0F172A',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isCalculatingRoute ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={14} sx={{ color: '#38BDF8' }} />
              <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 600 }}>
                Calculating road-following cycling route along road network...
              </Typography>
            </Box>
          ) : routeStats ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DirectionsBikeIcon sx={{ color: '#10B981', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                  Road Distance: {routeStats.distanceKm} km
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                • Est. Ride Time: {Math.floor(routeStats.durationMinutes / 60)}h{' '}
                {Math.round(routeStats.durationMinutes % 60)}m
              </Typography>
              <Chip
                label="Road Network Following"
                size="small"
                sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#16A34A', color: '#fff', fontWeight: 800 }}
              />
            </Box>
          ) : activeMode === 'checkpoint' ? (
            <Typography variant="caption" sx={{ color: '#C084FC', fontWeight: 700 }}>
              📍 CHECKPOINT MODE ACTIVE: Click anywhere along the route on the map to place a checkpoint.
            </Typography>
          ) : activeMode === 'adjust' ? (
            <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 700 }}>
              🛠️ ADJUST MODE ACTIVE: Click on the map to insert road waypoints between Start and Finish.
            </Typography>
          ) : (
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Select Start and Finish locations above, then click "Calculate Route".
            </Typography>
          )}
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontSize: '0.7rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#16A34A' }} />
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Start</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 14, height: 4, bgcolor: '#2563EB', borderRadius: 0.5 }} />
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Road Route</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: 0.5, bgcolor: '#7C3AED' }} />
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Checkpoint</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#DC2626' }} />
            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Finish</Typography>
          </Box>
        </Box>
      </Box>

      {/* Error alert if routing fails */}
      {routingError && (
        <Alert severity="warning" sx={{ py: 0.5, px: 2, fontSize: '0.8rem' }} onClose={() => setRoutingError(null)}>
          {routingError}
        </Alert>
      )}

      {/* 3. Interactive Leaflet Map Canvas */}
      <Box sx={{ position: 'relative', width: '100%', height }}>
        <div id="event-route-map" ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* Map In-Corner Zoom Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 16,
            zIndex: 900,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            bgcolor: '#FFFFFF',
            borderRadius: 1.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            p: 0.5,
          }}
        >
          <IconButton
            size="small"
            id="btn-map-zoom-in"
            onClick={() => mapInstanceRef.current?.zoomIn()}
          >
            <ZoomInOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="small"
            id="btn-map-zoom-out"
            onClick={() => mapInstanceRef.current?.zoomOut()}
          >
            <ZoomOutOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* 4. Checkpoint Creation & Editing Dialog (Auto-Captured Coordinates) */}
      <Dialog
        open={cpModalOpen}
        onClose={() => setCpModalOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2, p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
          <EditLocationAltOutlinedIcon sx={{ color: '#7C3AED' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {editingCpId ? 'Edit Checkpoint' : 'Add Checkpoint on Map'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
            Checkpoint location selected directly on map. Latitude and Longitude are automatically captured.
          </Typography>

          {/* Auto-Captured Coordinates Box */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: '#F3E8FF',
              borderRadius: 1.5,
              border: '1px solid #D8B4FE',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#6B21A8', display: 'block', mb: 0.5 }}>
              AUTOMATICALLY CAPTURED GPS COORDINATES:
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#7C3AED' }}>
              Latitude: {pendingCpCoords?.lat} | Longitude: {pendingCpCoords?.lng}
            </Typography>
          </Box>

          <TextField
            id="input-checkpoint-name"
            label="Checkpoint Name"
            size="small"
            fullWidth
            required
            value={newCpName}
            onChange={(e) => setNewCpName(e.target.value)}
            placeholder="e.g. CP 01 - Talegaon Station"
          />

          <FormControl size="small" fullWidth>
            <InputLabel id="select-checkpoint-type-label">Checkpoint Type</InputLabel>
            <Select
              id="select-checkpoint-type"
              labelId="select-checkpoint-type-label"
              value={newCpType}
              label="Checkpoint Type"
              onChange={(e) => setNewCpType(e.target.value)}
            >
              <MenuItem value="Timing">Timing & Time-Station</MenuItem>
              <MenuItem value="Refreshment">Refreshment & Hydration</MenuItem>
              <MenuItem value="Water Station">Water Station</MenuItem>
              <MenuItem value="First Aid">First Aid & Medical</MenuItem>
              <MenuItem value="Mechanical">Mechanical Support</MenuItem>
              <MenuItem value="Secret">Secret Checkpoint</MenuItem>
            </Select>
          </FormControl>

          <TextField
            id="input-checkpoint-seq"
            label="Sequence Number"
            type="number"
            size="small"
            fullWidth
            value={newCpSequence}
            onChange={(e) => setNewCpSequence(parseInt(e.target.value) || 1)}
          />

          <FormControlLabel
            control={
              <Switch
                id="switch-checkpoint-mandatory"
                checked={newCpMandatory}
                onChange={(e) => setNewCpMandatory(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {newCpMandatory ? 'Mandatory Checkpoint (Required)' : 'Optional Checkpoint'}
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={() => setCpModalOpen(false)} sx={{ textTransform: 'none', color: colors.text.secondary }}>
            Cancel
          </Button>
          <Button
            id="btn-save-checkpoint-modal"
            variant="contained"
            onClick={handleSaveCheckpoint}
            disabled={!newCpName.trim()}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#7C3AED',
              '&:hover': { bgcolor: '#6D28D9' },
            }}
          >
            Save Checkpoint
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
