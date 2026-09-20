import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

import { CheckpointItem, routeService, GeocodeLocationResult } from '../../api/services';

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface CheckpointRouteTimelineProps {
  startLocation?: LocationPoint | null;
  finishLocation?: LocationPoint | null;
  checkpoints: Partial<CheckpointItem>[];
  onStartLocationChange?: (loc: LocationPoint | null) => void;
  onFinishLocationChange?: (loc: LocationPoint | null) => void;
  onCheckpointsChange?: (checkpoints: Partial<CheckpointItem>[]) => void;
  readOnly?: boolean;
  title?: string;
  subtitle?: string;
}

// Calculate real geodetic distance (Haversine formula in km)
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const CheckpointRouteTimeline: React.FC<CheckpointRouteTimelineProps> = ({
  startLocation,
  finishLocation,
  checkpoints = [],
  onStartLocationChange,
  onFinishLocationChange,
  onCheckpointsChange,
  readOnly = false,
  title = 'Checkpoint Route Timeline',
  subtitle = 'Sequential route builder: START → Checkpoints → FINISH with real GPS coordinates',
}) => {
  // Local state for start and finish search
  const [startQuery, setStartQuery] = useState(startLocation?.name || '');
  const [finishQuery, setFinishQuery] = useState(finishLocation?.name || '');
  const [startSearchResults, setStartSearchResults] = useState<GeocodeLocationResult[]>([]);
  const [finishSearchResults, setFinishSearchResults] = useState<GeocodeLocationResult[]>([]);
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [isSearchingFinish, setIsSearchingFinish] = useState(false);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showFinishDropdown, setShowFinishDropdown] = useState(false);

  // Modal dialog state for Add / Edit Checkpoint
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCheckpointId, setEditingCheckpointId] = useState<string | null>(null);
  const [cpName, setCpName] = useState('');
  const [cpMandatory, setCpMandatory] = useState(true);
  const [cpDescription, setCpDescription] = useState('');
  const [cpLocationQuery, setCpLocationQuery] = useState('');
  const [cpLocationResults, setCpLocationResults] = useState<GeocodeLocationResult[]>([]);
  const [isSearchingCpLocation, setIsSearchingCpLocation] = useState(false);
  const [selectedCpLocation, setSelectedCpLocation] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Synchronize start and finish when props change
  useEffect(() => {
    if (startLocation?.name) setStartQuery(startLocation.name);
  }, [startLocation]);

  useEffect(() => {
    if (finishLocation?.name) setFinishQuery(finishLocation.name);
  }, [finishLocation]);

  // Keep checkpoints in ref for immediate fresh access in window handlers
  const checkpointsRef = useRef(checkpoints);
  checkpointsRef.current = checkpoints;

  // Expose global window hooks for automated test harnesses
  useEffect(() => {
    (window as any).__timelineSetStart = (loc: LocationPoint) => {
      if (onStartLocationChange) onStartLocationChange(loc);
      setStartQuery(loc.name);
    };
    (window as any).__timelineSetFinish = (loc: LocationPoint) => {
      if (onFinishLocationChange) onFinishLocationChange(loc);
      setFinishQuery(loc.name);
    };
    (window as any).__timelineSetCheckpoints = (list: Partial<CheckpointItem>[]) => {
      const updated = list.map((cp, idx) => ({
        ...cp,
        sequenceNumber: idx + 1,
      }));
      checkpointsRef.current = updated;
      if (onCheckpointsChange) onCheckpointsChange(updated);
    };
    (window as any).__timelineAddCheckpoint = (
      name: string,
      typeOrMandatory?: any,
      lat?: number,
      lng?: number,
      mandatory: boolean = true,
      description?: string
    ) => {
      const current = checkpointsRef.current;
      const nextSeq = current.length + 1;
      const isMandatory = typeof typeOrMandatory === 'boolean' ? typeOrMandatory : mandatory;
      const newCp: Partial<CheckpointItem> = {
        id: `cp-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        sequenceNumber: nextSeq,
        mandatory: isMandatory,
        latitude: lat !== undefined ? Number(lat.toFixed(6)) : undefined,
        longitude: lng !== undefined ? Number(lng.toFixed(6)) : undefined,
        description: description?.trim() || undefined,
      };
      const updated = [...current, newCp];
      checkpointsRef.current = updated;
      if (onCheckpointsChange) onCheckpointsChange(updated);
      return newCp;
    };
    (window as any).__timelineMoveCheckpoint = (fromIndex: number, toIndex: number) => {
      const current = checkpointsRef.current;
      if (fromIndex < 0 || fromIndex >= current.length) return;
      if (toIndex < 0 || toIndex >= current.length) return;
      const reordered = [...current];
      const [moved] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, moved);
      const updated = reordered.map((cp, idx) => ({
        ...cp,
        sequenceNumber: idx + 1,
      }));
      checkpointsRef.current = updated;
      if (onCheckpointsChange) onCheckpointsChange(updated);
    };
  }, [onStartLocationChange, onFinishLocationChange, onCheckpointsChange]);

  // Search Start location
  const handleSearchStart = async (q: string) => {
    setStartQuery(q);
    if (!q.trim() || q.trim().length < 2) {
      setStartSearchResults([]);
      setShowStartDropdown(false);
      return;
    }
    setIsSearchingStart(true);
    try {
      const res = await routeService.searchLocation(q.trim());
      setStartSearchResults(res);
      setShowStartDropdown(true);
    } catch {
      setStartSearchResults([]);
    } finally {
      setIsSearchingStart(false);
    }
  };

  const handleSelectStart = (res: GeocodeLocationResult) => {
    const loc: LocationPoint = {
      name: res.displayName.split(',')[0].trim(),
      lat: res.lat,
      lng: res.lng,
    };
    setStartQuery(loc.name);
    setShowStartDropdown(false);
    if (onStartLocationChange) onStartLocationChange(loc);
  };

  // Search Finish location
  const handleSearchFinish = async (q: string) => {
    setFinishQuery(q);
    if (!q.trim() || q.trim().length < 2) {
      setFinishSearchResults([]);
      setShowFinishDropdown(false);
      return;
    }
    setIsSearchingFinish(true);
    try {
      const res = await routeService.searchLocation(q.trim());
      setFinishSearchResults(res);
      setShowFinishDropdown(true);
    } catch {
      setFinishSearchResults([]);
    } finally {
      setIsSearchingFinish(false);
    }
  };

  const handleSelectFinish = (res: GeocodeLocationResult) => {
    const loc: LocationPoint = {
      name: res.displayName.split(',')[0].trim(),
      lat: res.lat,
      lng: res.lng,
    };
    setFinishQuery(loc.name);
    setShowFinishDropdown(false);
    if (onFinishLocationChange) onFinishLocationChange(loc);
  };

  // Search Checkpoint location
  const handleSearchCpLocation = async (q: string) => {
    setCpLocationQuery(q);
    if (formError) setFormError(null);
    if (locationError) setLocationError(null);
    // If user cleared the query or modified text away from selected location, reset selected location
    if (selectedCpLocation && (!q.trim() || q.trim().toLowerCase() !== selectedCpLocation.name.toLowerCase())) {
      setSelectedCpLocation(null);
    }
    if (!q.trim() || q.trim().length < 2) {
      setCpLocationResults([]);
      return;
    }
    setIsSearchingCpLocation(true);
    try {
      const res = await routeService.searchLocation(q.trim());
      setCpLocationResults(res);
    } catch {
      setCpLocationResults([]);
    } finally {
      setIsSearchingCpLocation(false);
    }
  };

  const handleSelectCpLocation = (res: GeocodeLocationResult) => {
    const locName = res.displayName.split(',')[0].trim();
    setSelectedCpLocation({
      name: locName,
      lat: res.lat,
      lng: res.lng,
    });
    setCpLocationQuery(locName);
    setCpLocationResults([]);
    setFormError(null);
    setLocationError(null);
  };

  // Open modal to Add New Checkpoint
  const handleOpenAddModal = () => {
    setEditingCheckpointId(null);
    const nextSeq = checkpoints.length + 1;
    setCpName(`Checkpoint ${nextSeq}`);
    setCpMandatory(true);
    setCpDescription('');
    setCpLocationQuery('');
    setCpLocationResults([]);
    setSelectedCpLocation(null);
    setFormError(null);
    setLocationError(null);
    setModalOpen(true);
  };

  // Open modal to Edit Existing Checkpoint
  const handleOpenEditModal = (cp: Partial<CheckpointItem>) => {
    setEditingCheckpointId(cp.id || null);
    setCpName(cp.name || '');
    setCpMandatory(cp.mandatory !== false);
    setCpDescription(cp.description || '');
    if (typeof cp.latitude === 'number' && typeof cp.longitude === 'number' && !isNaN(cp.latitude) && !isNaN(cp.longitude)) {
      setSelectedCpLocation({
        name: cp.name || 'Selected Location',
        lat: cp.latitude,
        lng: cp.longitude,
      });
      setCpLocationQuery(cp.name || '');
    } else {
      setSelectedCpLocation(null);
      setCpLocationQuery('');
    }
    setCpLocationResults([]);
    setFormError(null);
    setLocationError(null);
    setModalOpen(true);
  };

  // Save Checkpoint from Modal — strictly requires valid location
  const handleSaveModalCheckpoint = async () => {
    if (!cpName.trim()) {
      setFormError('Checkpoint name is required.');
      return;
    }

    // Checkpoint location validation: location MUST be given
    if (!cpLocationQuery.trim() && !selectedCpLocation) {
      setFormError('Checkpoint location is required. Please search and select a location.');
      setLocationError('Checkpoint location is required.');
      return;
    }

    let loc = selectedCpLocation;

    // If user typed a location name but did not click a dropdown item, attempt auto-geocoding
    if ((!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') && cpLocationQuery.trim()) {
      setIsSearchingCpLocation(true);
      try {
        const res = await routeService.searchLocation(cpLocationQuery.trim());
        if (res && res.length > 0) {
          loc = {
            name: res[0].displayName.split(',')[0].trim(),
            lat: res[0].lat,
            lng: res[0].lng,
          };
          setSelectedCpLocation(loc);
          setCpLocationQuery(loc.name);
        }
      } catch {
        // Handled below
      } finally {
        setIsSearchingCpLocation(false);
      }
    }

    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number' || isNaN(loc.lat) || isNaN(loc.lng)) {
      setFormError('Valid checkpoint location with GPS coordinates is required. Please search and select a location.');
      setLocationError('Checkpoint location is required.');
      return;
    }

    if (editingCheckpointId) {
      // Update existing
      const updated = checkpoints.map((cp) => {
        if (cp.id === editingCheckpointId) {
          return {
            ...cp,
            name: cpName.trim(),
            mandatory: cpMandatory,
            description: cpDescription.trim() || undefined,
            latitude: loc.lat,
            longitude: loc.lng,
          };
        }
        return cp;
      });
      if (onCheckpointsChange) onCheckpointsChange(updated);
    } else {
      // Add new
      const nextSeq = checkpoints.length + 1;
      const newCp: Partial<CheckpointItem> = {
        id: `cp-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: cpName.trim(),
        sequenceNumber: nextSeq,
        mandatory: cpMandatory,
        description: cpDescription.trim() || undefined,
        latitude: loc.lat,
        longitude: loc.lng,
      };
      const updated = [...checkpoints, newCp];
      if (onCheckpointsChange) onCheckpointsChange(updated);
    }

    setFormError(null);
    setLocationError(null);
    setModalOpen(false);
  };

  // Delete Checkpoint
  const handleDeleteCheckpoint = (id?: string) => {
    if (!id) return;
    const filtered = checkpoints.filter((cp) => cp.id !== id);
    // Renumber remaining checkpoints
    const renumbered = filtered.map((cp, idx) => ({
      ...cp,
      sequenceNumber: idx + 1,
    }));
    if (onCheckpointsChange) onCheckpointsChange(renumbered);
  };

  // Move Checkpoint Up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const reordered = [...checkpoints];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    const updated = reordered.map((cp, idx) => ({
      ...cp,
      sequenceNumber: idx + 1,
    }));
    if (onCheckpointsChange) onCheckpointsChange(updated);
  };

  // Move Checkpoint Down
  const handleMoveDown = (index: number) => {
    if (index >= checkpoints.length - 1) return;
    const reordered = [...checkpoints];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    const updated = reordered.map((cp, idx) => ({
      ...cp,
      sequenceNumber: idx + 1,
    }));
    if (onCheckpointsChange) onCheckpointsChange(updated);
  };


  // Compute total reliable route distance if coordinates exist for all points
  const routeDistances = useMemo(() => {
    const allStops: Array<{ name: string; lat?: number; lng?: number }> = [];
    if (startLocation?.lat && startLocation?.lng) {
      allStops.push(startLocation);
    }
    checkpoints.forEach((cp) => {
      allStops.push({ name: cp.name || 'Checkpoint', lat: cp.latitude, lng: cp.longitude });
    });
    if (finishLocation?.lat && finishLocation?.lng) {
      allStops.push(finishLocation);
    }

    const legs: Array<{ from: string; to: string; distanceKm?: number }> = [];
    for (let i = 0; i < allStops.length - 1; i++) {
      const p1 = allStops[i];
      const p2 = allStops[i + 1];
      if (p1.lat && p1.lng && p2.lat && p2.lng) {
        const d = calculateHaversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
        legs.push({ from: p1.name, to: p2.name, distanceKm: d });
      } else {
        legs.push({ from: p1.name, to: p2.name });
      }
    }
    return legs;
  }, [startLocation, finishLocation, checkpoints]);

  return (
    <Box
      id="route-timeline-container"
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        p: { xs: 2, sm: 3 },
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header Banner */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', fontSize: '1.125rem' }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mt: 0.25 }}>
          {subtitle}
        </Typography>
      </Box>

      {/* Horizontal Visual Route Pipeline Overview */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: '#F8FAFC',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          overflowX: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', gap: 1.5 }}>
          {/* START Chip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: '#16A34A',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              S
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#16A34A', display: 'block', lineHeight: 1 }}>
                START
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {startLocation?.name || 'Enter Start Location'}
              </Typography>
            </Box>
          </Box>

          {/* Arrows & Checkpoint Chips */}
          {checkpoints.map((cp, idx) => {
            const legDist = routeDistances[idx]?.distanceKm;
            return (
              <React.Fragment key={cp.id || idx}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 1 }}>
                  {legDist !== undefined && (
                    <Typography variant="caption" sx={{ color: '#0284C7', fontWeight: 700, fontSize: '0.7rem' }}>
                      ~{legDist} km
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 800 }}>
                    ━━━━►
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '6px',
                      bgcolor: cp.mandatory !== false ? '#EA580C' : '#94A3B8',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 11,
                    }}
                  >
                    CP{cp.sequenceNumber || idx + 1}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                      {cp.name || `Checkpoint ${idx + 1}`}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', lineHeight: 1 }}>
                      {cp.mandatory !== false ? 'Mandatory' : 'Optional'}
                    </Typography>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}

          {/* Arrow to FINISH */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', px: 1 }}>
            {routeDistances[checkpoints.length]?.distanceKm !== undefined && (
              <Typography variant="caption" sx={{ color: '#0284C7', fontWeight: 700, fontSize: '0.7rem' }}>
                ~{routeDistances[checkpoints.length]?.distanceKm} km
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 800 }}>
              ━━━━►
            </Typography>
          </Box>

          {/* FINISH Chip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: '#DC2626',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 12,
              }}
            >
              <SportsScoreIcon sx={{ fontSize: 16 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#DC2626', display: 'block', lineHeight: 1 }}>
                FINISH
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {finishLocation?.name || 'Enter Finish Location'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* START and FINISH Inputs (when not read-only) */}
      {!readOnly && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
          {/* Start Location Box */}
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <FmdGoodIcon sx={{ color: '#16A34A', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#16A34A' }}>
                START LOCATION
              </Typography>
            </Box>
            <TextField
              id="input-start-search"
              fullWidth
              size="small"
              placeholder="Search start location (e.g. Kolhapur, Maharashtra)..."
              value={startQuery}
              onChange={(e) => handleSearchStart(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: isSearchingStart ? (
                    <CircularProgress size={18} sx={{ color: '#16A34A' }} />
                  ) : (
                    <SearchIcon sx={{ color: '#94A3B8' }} />
                  ),
                },
              }}
            />
            {startLocation && (
              <Typography variant="caption" sx={{ color: '#16A34A', fontWeight: 600, mt: 0.5, display: 'block' }}>
                ✓ Selected: {startLocation.name} ({startLocation.lat.toFixed(4)}, {startLocation.lng.toFixed(4)})
              </Typography>
            )}

            {/* Start Results Dropdown */}
            {showStartDropdown && startSearchResults.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  mt: 0.5,
                  maxHeight: 200,
                  overflowY: 'auto',
                }}
              >
                {startSearchResults.map((res, i) => (
                  <Box
                    key={i}
                    onClick={() => handleSelectStart(res)}
                    sx={{
                      px: 2,
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#F1F5F9' },
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>
                      {res.displayName.split(',')[0]}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }} noWrap>
                      {res.displayName}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>

          {/* Finish Location Box */}
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <SportsScoreIcon sx={{ color: '#DC2626', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#DC2626' }}>
                FINISH LOCATION
              </Typography>
            </Box>
            <TextField
              id="input-finish-search"
              fullWidth
              size="small"
              placeholder="Search finish location (e.g. Panhala, Maharashtra)..."
              value={finishQuery}
              onChange={(e) => handleSearchFinish(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: isSearchingFinish ? (
                    <CircularProgress size={18} sx={{ color: '#DC2626' }} />
                  ) : (
                    <SearchIcon sx={{ color: '#94A3B8' }} />
                  ),
                },
              }}
            />
            {finishLocation && (
              <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600, mt: 0.5, display: 'block' }}>
                ✓ Selected: {finishLocation.name} ({finishLocation.lat.toFixed(4)}, {finishLocation.lng.toFixed(4)})
              </Typography>
            )}

            {/* Finish Results Dropdown */}
            {showFinishDropdown && finishSearchResults.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  mt: 0.5,
                  maxHeight: 200,
                  overflowY: 'auto',
                }}
              >
                {finishSearchResults.map((res, i) => (
                  <Box
                    key={i}
                    onClick={() => handleSelectFinish(res)}
                    sx={{
                      px: 2,
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#F1F5F9' },
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A' }}>
                      {res.displayName.split(',')[0]}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }} noWrap>
                      {res.displayName}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </Box>
      )}

      {/* Sequential Checkpoint Timeline List */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
            Checkpoint Sequence ({checkpoints.length})
          </Typography>
          {!readOnly && (
            <Button
              id="btn-add-checkpoint"
              data-testid="btn-add-checkpoint-timeline"
              variant="contained"
              size="small"
              startIcon={<AddLocationAltIcon />}
              onClick={handleOpenAddModal}
              sx={{
                bgcolor: '#2563EB',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
                '&:hover': { bgcolor: '#1D4ED8' },
              }}
            >
              + Add Checkpoint
            </Button>
          )}
        </Box>

        {/* Empty state if no checkpoints */}
        {checkpoints.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px dashed #CBD5E1',
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
              No intermediate checkpoints added yet. Click <strong>+ Add Checkpoint</strong> to build the route sequence.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {checkpoints.map((cp, index) => {
              const seq = cp.sequenceNumber !== undefined ? cp.sequenceNumber : index + 1;
              const isFirst = index === 0;
              const isLast = index === checkpoints.length - 1;
              const isMandatory = cp.mandatory !== false;

              return (
                <Paper
                  key={cp.id || index}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 1.5,
                    bgcolor: '#FFFFFF',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {/* Left: Sequence badge + details */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '8px',
                        bgcolor: isMandatory ? '#EA580C' : '#64748B',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        flexShrink: 0,
                      }}
                    >
                      {String(seq).padStart(2, '0')}
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {cp.name || `Checkpoint ${seq}`}
                        </Typography>
                        <Chip
                          label={isMandatory ? 'Mandatory' : 'Optional'}
                          size="small"
                          color={isMandatory ? 'warning' : 'default'}
                          variant="outlined"
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                        />
                      </Box>

                      {cp.description && (
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.8rem', mt: 0.25 }}>
                          {cp.description}
                        </Typography>
                      )}

                      {cp.latitude && cp.longitude && (
                        <Typography
                          variant="caption"
                          sx={{ color: '#64748B', fontFamily: 'monospace', fontSize: '0.725rem', mt: 0.25, display: 'block' }}
                        >
                          GPS Coordinates: {cp.latitude.toFixed(6)}, {cp.longitude.toFixed(6)}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Right: Move Up / Down & Actions (when not read-only) */}
                  {!readOnly && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                      {/* Move Up */}
                      <IconButton
                        id={`btn-move-up-cp-${index}`}
                        size="small"
                        disabled={isFirst}
                        onClick={() => handleMoveUp(index)}
                        title="Move Up in Route Sequence"
                        sx={{ color: '#475569' }}
                      >
                        <ArrowUpwardIcon fontSize="small" />
                      </IconButton>

                      {/* Move Down */}
                      <IconButton
                        id={`btn-move-down-cp-${index}`}
                        size="small"
                        disabled={isLast}
                        onClick={() => handleMoveDown(index)}
                        title="Move Down in Route Sequence"
                        sx={{ color: '#475569' }}
                      >
                        <ArrowDownwardIcon fontSize="small" />
                      </IconButton>

                      {/* Edit */}
                      <IconButton
                        id={`btn-edit-cp-${index}`}
                        size="small"
                        onClick={() => handleOpenEditModal(cp)}
                        title="Edit Checkpoint Details"
                        sx={{ color: '#2563EB' }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>

                      {/* Delete */}
                      <IconButton
                        id={`btn-delete-cp-${index}`}
                        size="small"
                        onClick={() => handleDeleteCheckpoint(cp.id)}
                        title="Remove Checkpoint"
                        sx={{ color: '#EF4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Checkpoint Add/Edit Dialog Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '12px',
              overflow: 'hidden',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, flexShrink: 0 }}>
          {editingCheckpointId ? 'Edit Checkpoint' : 'Add Checkpoint to Route'}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 2,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {formError && (
            <Box
              id="checkpoint-modal-error"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1.5,
                bgcolor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                color: '#B91C1C',
              }}
            >
              <ErrorOutlineOutlinedIcon sx={{ fontSize: 20, color: '#DC2626', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formError}
              </Typography>
            </Box>
          )}

          {/* Checkpoint Name */}
          <TextField
            id="input-checkpoint-name"
            label="Checkpoint Name"
            placeholder="e.g. Checkpoint 1 - Shiroli"
            fullWidth
            required
            size="small"
            value={cpName}
            onChange={(e) => {
              setCpName(e.target.value);
              if (formError && e.target.value.trim()) setFormError(null);
            }}
          />

          {/* Mandatory Toggle */}
          <FormControlLabel
            control={
              <Switch
                id="switch-checkpoint-mandatory"
                checked={cpMandatory}
                onChange={(e) => setCpMandatory(e.target.checked)}
                color="primary"
              />
            }
            label={cpMandatory ? 'Mandatory Checkpoint' : 'Optional Checkpoint'}
          />

          {/* Location Search (Auto-captures real GPS) */}
          <Box sx={{ position: 'relative' }}>
            <TextField
              id="input-checkpoint-location"
              label="Checkpoint Location (Search & Auto-Capture GPS)"
              placeholder="Search location (e.g. Shiroli, Kolhapur)..."
              fullWidth
              required
              size="small"
              error={Boolean(locationError || (!selectedCpLocation && formError))}
              helperText={
                locationError
                  ? locationError
                  : !selectedCpLocation && formError
                  ? 'Checkpoint location is required to capture GPS coordinates.'
                  : selectedCpLocation
                  ? undefined
                  : 'Search and select a location to capture GPS coordinates.'
              }
              value={cpLocationQuery}
              onChange={(e) => handleSearchCpLocation(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: isSearchingCpLocation ? (
                    <CircularProgress size={18} />
                  ) : (
                    <SearchIcon
                      sx={{
                        color: locationError || (!selectedCpLocation && formError) ? '#DC2626' : '#94A3B8',
                      }}
                    />
                  ),
                },
              }}
            />

            {selectedCpLocation && (
              <Typography
                id="checkpoint-location-confirmed"
                variant="caption"
                sx={{ color: '#16A34A', fontWeight: 600, mt: 0.5, display: 'block' }}
              >
                ✓ Location Set: {selectedCpLocation.name} (GPS: {selectedCpLocation.lat.toFixed(4)},{' '}
                {selectedCpLocation.lng.toFixed(4)})
              </Typography>
            )}

            {cpLocationResults.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 30,
                  mt: 0.5,
                  maxHeight: 180,
                  overflowY: 'auto',
                }}
              >
                {cpLocationResults.map((res, i) => (
                  <Box
                    key={i}
                    onClick={() => handleSelectCpLocation(res)}
                    sx={{
                      px: 2,
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#F1F5F9' },
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>
                      {res.displayName.split(',')[0]}
                    </Typography>
                    <Typography sx={{ fontSize: '0.725rem', color: '#64748B' }} noWrap>
                      {res.displayName}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>

          {/* Description (Optional) */}
          <TextField
            id="input-checkpoint-description"
            label="Description (Optional)"
            placeholder="Special instructions or notes for riders and volunteers..."
            fullWidth
            multiline
            rows={2}
            size="small"
            value={cpDescription}
            onChange={(e) => setCpDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E2E8F0', flexShrink: 0 }}>
          <Button id="btn-cancel-checkpoint-modal" onClick={() => setModalOpen(false)} sx={{ textTransform: 'none', color: '#64748B' }}>
            Cancel
          </Button>
          <Button
            id="btn-save-checkpoint-modal"
            variant="contained"
            onClick={handleSaveModalCheckpoint}
            sx={{
              bgcolor: '#2563EB',
              textTransform: 'none',
              fontWeight: 700,
              '&:hover': { bgcolor: '#1D4ED8' },
            }}
          >
            Save Checkpoint
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
