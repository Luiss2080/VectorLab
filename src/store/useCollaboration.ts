import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { useCanvasStore } from './useCanvasStore';

const ydoc = new Y.Doc();
const yShapes = ydoc.getArray('shapes');

// Prevents infinite loops when syncing from Yjs -> Zustand -> Yjs
let isUpdatingFromNetwork = false;

export const useCollaboration = (roomName = 'figuras-vectoriales-room') => {
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [peers, setPeers] = useState<number>(0);

  useEffect(() => {
    // Initialize WebRTC Provider
    const webrtcProvider = new WebrtcProvider(roomName, ydoc, {
      signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com']
    });
    setProvider(webrtcProvider);

    // Track online peers
    webrtcProvider.awareness.on('change', () => {
      setPeers(webrtcProvider.awareness.getStates().size);
    });

    // Observe changes from the network (Yjs -> Zustand)
    yShapes.observe(() => {
      isUpdatingFromNetwork = true;
      const networkShapes = yShapes.toArray();
      // Ensure we don't accidentally wipe out local state with empty network state if we are the first to join
      if (networkShapes.length > 0 || webrtcProvider.awareness.getStates().size > 1) {
        useCanvasStore.setState({ shapes: networkShapes as any });
      }
      isUpdatingFromNetwork = false;
    });

    // Observe local changes (Zustand -> Yjs)
    const unsubscribe = useCanvasStore.subscribe((state, prevState) => {
      if (isUpdatingFromNetwork) return;
      if (state.shapes !== prevState.shapes) {
        ydoc.transact(() => {
          yShapes.delete(0, yShapes.length);
          yShapes.insert(0, state.shapes);
        });
      }
    });

    return () => {
      unsubscribe();
      webrtcProvider.destroy();
      ydoc.destroy();
    };
  }, [roomName]);

  return { peers, provider };
};
