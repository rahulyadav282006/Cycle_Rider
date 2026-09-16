// RideTrack Offline Scanning Queue (IndexedDB)
// Handles storing scans when offline and flushing them automatically on reconnect with clientScanId idempotency.

export interface PendingScan {
  clientScanId: string;
  riderId: string;
  eventId: string;
  checkpointId: string;
  scanTime: string;
  riderName?: string;
  jerseyNumber?: string;
}

const DB_NAME = 'RideTrackOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'pending_scans';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported by this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'clientScanId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineScan(scan: PendingScan): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(scan);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingScans(): Promise<PendingScan[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function removePendingScan(clientScanId: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(clientScanId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function clearAllPendingScans(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function flushPendingScans(
  submitScanFn: (scan: PendingScan) => Promise<any>
): Promise<{ synced: number; failed: number }> {
  const pending = await getPendingScans();
  let synced = 0;
  let failed = 0;

  for (const scan of pending) {
    try {
      await submitScanFn(scan);
      await removePendingScan(scan.clientScanId);
      synced++;
    } catch (err: any) {
      const errCode = err?.code || err?.error?.code || '';
      const errMsg = String(err?.message || err?.error?.message || '');
      const status = err?.status || err?.response?.status;

      // 1. Idempotency: DUPLICATE_SCAN means backend already has this scan record!
      if (errCode === 'DUPLICATE_SCAN' || status === 409 || errMsg.toLowerCase().includes('already')) {
        await removePendingScan(scan.clientScanId);
        synced++;
      } else if (
        errCode === 'RIDER_NOT_FOUND' ||
        errCode === 'WRONG_EVENT' ||
        errCode === 'FORBIDDEN' ||
        errCode === 'EVENT_NOT_FOUND' ||
        errCode === 'CHECKPOINT_NOT_FOUND'
      ) {
        // Permanent rejection: record was invalid at source, do not retry forever
        console.warn(`[OfflineSync] Removing permanently rejected scan ${scan.clientScanId}:`, errCode || errMsg);
        await removePendingScan(scan.clientScanId);
        failed++;
      } else {
        // Transient network or server error: keep in IndexedDB to retry next time
        console.warn(`[OfflineSync] Transient error syncing scan ${scan.clientScanId}:`, errMsg);
        failed++;
      }
    }
  }

  return { synced, failed };
}

