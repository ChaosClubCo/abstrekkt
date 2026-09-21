
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { CityState, CityContextType, HubId, DistrictStatus } from '../types';

const INITIAL_DISTRICTS: HubId[] = ['DEV', 'DATA', 'AI', 'OPS', 'GROWTH', 'COMMERCE', 'COLLAB'];

const CityContext = createContext<CityContextType | undefined>(undefined);

/**
 * CityProvider
 * Manages the global architectural state and simulation overrides.
 * Orchestrates real-time telemetry updates across all 7 enclaves.
 */
export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CityState>(() => ({
    districts: INITIAL_DISTRICTS.reduce((acc, id) => ({
      ...acc,
      [id]: { 
        id, 
        isActive: true, 
        load: 15 + Math.random() * 20, 
        health: 100,
        ...(id === 'AI' ? {
          gpuAcceleration: { isBoosted: false, tflops: 120, vramUsed: 32 }
        } : {})
      }
    }), {} as Record<HubId, DistrictStatus>),
    transitHub: 'n8n',
    simulationActive: false
  }));

  /**
   * Global Telemetry Loop
   * Simulates dynamic load and compute metrics for a production-ready NOC feel.
   * Optimized for high-frequency updates with minimal main-thread impact.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const newDistricts = { ...prev.districts };
        
        Object.keys(newDistricts).forEach(key => {
          const id = key as HubId;
          const dist = newDistricts[id];
          
          if (dist.isActive) {
            // Precise load jitter simulating variable request throughput
            const loadDelta = (Math.random() - 0.5) * 5;
            dist.load = Math.max(5, Math.min(98, dist.load + loadDelta));
            
            // Specialized Federated GPU cluster metrics
            if (id === 'AI' && dist.gpuAcceleration) {
              const isBoosted = dist.gpuAcceleration.isBoosted;
              const targetTflops = isBoosted ? 920 : 120;
              const targetVram = isBoosted ? 74 : 32;
              
              // Smoothly converge toward targets with jitter
              dist.gpuAcceleration = {
                ...dist.gpuAcceleration,
                tflops: targetTflops + (Math.random() - 0.5) * (isBoosted ? 150 : 20),
                vramUsed: Math.min(80, targetVram + (Math.random() - 0.5) * 8)
              };
            }
          }
        });

        return { ...prev, districts: newDistricts };
      });
    }, 2000); // 2s Sync frequency
    return () => clearInterval(interval);
  }, []);

  const toggleDistrict = useCallback((id: HubId) => {
    setState(prev => {
      const current = prev.districts[id];
      const newStatus = !current.isActive;
      return {
        ...prev,
        districts: {
          ...prev.districts,
          [id]: { 
            ...current, 
            isActive: newStatus,
            health: newStatus ? 100 : 0,
            load: newStatus ? 20 : 0
          }
        },
        simulationActive: true
      };
    });
  }, []);

  const toggleGPUBooost = useCallback(() => {
    setState(prev => {
      const aiDist = prev.districts.AI;
      if (!aiDist.gpuAcceleration) return prev;

      return {
        ...prev,
        districts: {
          ...prev.districts,
          AI: {
            ...aiDist,
            gpuAcceleration: {
              ...aiDist.gpuAcceleration,
              isBoosted: !aiDist.gpuAcceleration.isBoosted
            }
          }
        }
      };
    });
  }, []);

  const setTransitHub = useCallback((hub: 'n8n' | 'Zapier' | 'Manual') => {
    setState(prev => ({ ...prev, transitHub: hub, simulationActive: true }));
  }, []);

  const resetSimulation = useCallback(() => {
    setState({
      districts: INITIAL_DISTRICTS.reduce((acc, id) => ({
        ...acc,
        [id]: { 
          id, 
          isActive: true, 
          load: 15 + Math.random() * 20, 
          health: 100,
          ...(id === 'AI' ? {
            gpuAcceleration: { isBoosted: false, tflops: 120, vramUsed: 32 }
          } : {})
        }
      }), {} as Record<HubId, DistrictStatus>),
      transitHub: 'n8n',
      simulationActive: false
    });
  }, []);

  const value = useMemo(() => ({
    state,
    toggleDistrict,
    setTransitHub,
    resetSimulation,
    toggleGPUBooost
  }), [state, toggleDistrict, setTransitHub, resetSimulation, toggleGPUBooost]);

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider.');
  return context;
};
