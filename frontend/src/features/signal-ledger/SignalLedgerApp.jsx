/**
 * SignalLedgerApp — mount this anywhere in your React tree.
 *
 * Prerequisites:
 *   1. Tailwind CSS configured in your project.
 *   2. IBM Plex fonts loaded — add to your <head> or CSS:
 *        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@700&display=swap');
 *   3. To swap the storage adapter:
 *        import { MyRestAdapter } from './myRestAdapter';
 *        <SignalLedgerApp adapter={MyRestAdapter} />
 */
import React, { useState, useCallback } from 'react';
import { useLedger } from './hooks/useLedger.js';
import { LocalStorageAdapter } from './lib/storageAdapter.js';
import HeaderBar from './components/HeaderBar.jsx';
import TabNav from './components/TabNav.jsx';
import CapturePhase from './components/CapturePhase.jsx';
import InterrogatePhase from './components/InterrogatePhase.jsx';
import RankPhase from './components/RankPhase.jsx';
import FocusPhase from './components/FocusPhase.jsx';
import ClosedSummary from './components/ClosedSummary.jsx';
import LedgerView from './components/LedgerView.jsx';
import PillarsConfig from './components/PillarsConfig.jsx';

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        'px-4 py-2 text-xs font-bold text-white shadow-lg',
        toast.type === 'error' ? 'bg-[#9A2C2C]' : 'bg-[#0B7A4B]',
      ].join(' ')}
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {toast.msg}
    </div>
  );
}

// Closing streak for HeaderBar: consecutive closed days ending today or yesterday.
function computeStreak(historyDays) {
  const today = new Date().toLocaleDateString('en-CA');
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');
  const closedSet = new Set(historyDays.filter(d => d.closedAt).map(d => d.date));
  if (!closedSet.has(today) && !closedSet.has(yesterday)) return 0;
  let count = 0;
  let cur = new Date();
  while (true) {
    const key = cur.toLocaleDateString('en-CA');
    if (!closedSet.has(key)) break;
    count++;
    cur = new Date(cur.getTime() - 86400000);
  }
  return count;
}

export default function SignalLedgerApp({ adapter = LocalStorageAdapter }) {
  const [activeTab, setActiveTab] = useState('today');
  const { config, day, loading, toast, phase, historyDays, loadHistory, actions } =
    useLedger(adapter);

  // When "+ Add more tasks" is clicked from rank phase, force capture phase by
  // returning to today tab — phase will recompute as 'interrogate' after capture,
  // but capture textarea is shown if user explicitly navigates back.
  const [forceCapture, setForceCapture] = useState(false);
  const effectivePhase = forceCapture ? 'capture' : phase;

  const handleCapture = useCallback(
    async (text) => {
      await actions.submitCapture(text);
      setForceCapture(false);
    },
    [actions],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
        <p
          className="text-xs text-[#8a8f9c] tracking-widest"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Loading…
        </p>
      </div>
    );
  }

  const streak = computeStreak(historyDays);

  return (
    <div className="min-h-screen bg-[#0b0d12]" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <HeaderBar streak={streak} />
      <TabNav active={activeTab} onChange={setActiveTab} />

      <main>
        {activeTab === 'today' && (
          <>
            {effectivePhase === 'capture' && (
              <CapturePhase onSubmit={handleCapture} />
            )}
            {effectivePhase === 'interrogate' && (
              <InterrogatePhase
                day={day}
                config={config}
                onAnswer={actions.answerQuestion}
                onFinalize={actions.finalizeVerdict}
              />
            )}
            {effectivePhase === 'rank' && (
              <RankPhase
                day={day}
                config={config}
                onLock={actions.lockTop3}
                onAddMore={() => setForceCapture(true)}
              />
            )}
            {effectivePhase === 'focus' && (
              <FocusPhase
                day={day}
                onStatusChange={actions.setCloseStatus}
                onNoteChange={actions.setCloseStatus}
                onClose={actions.closeDay}
              />
            )}
            {effectivePhase === 'closed' && (
              <ClosedSummary day={day} />
            )}
          </>
        )}

        {activeTab === 'ledger' && (
          <LedgerView historyDays={historyDays} onLoad={loadHistory} />
        )}

        {activeTab === 'pillars' && (
          <PillarsConfig
            config={config}
            onUpdate={actions.updateConfig}
            onResetAll={actions.resetAll}
          />
        )}
      </main>

      <Toast toast={toast} />
    </div>
  );
}
