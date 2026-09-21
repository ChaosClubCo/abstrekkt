
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, FunctionDeclaration, Type, GenerateContentParameters } from "@google/genai";
import { HUBS_DATA } from '../data/content';
import { InferenceMetrics } from '../types';

/**
 * L2 Contextual Cache Strategy
 * Optimizes platform responsiveness by bypassing expensive GPU inference for repetitive architectural queries.
 */
interface CachedResponse {
  result: InferenceResult;
  expiry: number;
}

const INFERENCE_CACHE = new Map<string, CachedResponse>();
const CACHE_TTL = 1000 * 60 * 15; // 15-minute standard persistence for node state

/**
 * Orchestrator System Instruction Factory
 * Dynamically re-configures model persona based on current cluster TFLOPS and acceleration tier.
 */
const GET_FEDERATED_PROMPT = (isBoosted: boolean, tflops: number) => `
You are FlashFusion Architectural Intelligence (FFAI).
Mode: ${isBoosted ? 'H100 ACCELERATED CLUSTER' : 'BASELINE EDGE RELAY'}.
Hardware Capacity: ${tflops.toFixed(1)} TFLOPS.

OBJECTIVE:
- Act as the central brain for the 7-domain federated stack.
- Manage data propagation between enclaves: ${HUBS_DATA.map(h => h.id).join(', ')}.
- Provide architectural analysis of the system topology.

FEDERATED PROTOCOLS:
1. If the user requests complex reasoning, confirm that H100 Tensor cores are hot-swapped for the task.
2. Use 'navigateToSection' to update the viewport based on operational focus.
3. Use 'triggerSimulationEvent' to stress-test the fabric resilience.
4. Keep technical responses concise, accurate, and high-fidelity.
`;

/**
 * Functional Tool Declarations for the Federated AI
 */
const TOOL_MANIFEST: FunctionDeclaration[] = [
  {
    name: 'navigateToSection',
    parameters: {
      type: Type.OBJECT,
      description: 'Navigates the user interface to a specific architectural district.',
      properties: {
        sectionId: {
          type: Type.STRING,
          description: 'The ID of the target enclave (hero, introduction, infrastructure, etc.)',
        },
      },
      required: ['sectionId'],
    },
  },
  {
    name: 'triggerSimulationEvent',
    parameters: {
      type: Type.OBJECT,
      description: 'Executes a failure simulation or connectivity test in the sandbox.',
      properties: {
        eventType: {
          type: Type.STRING,
          enum: ['FAIL_DISTRICT', 'SWITCH_TRANSIT', 'RESET'],
          description: 'Type of event to simulate.',
        },
        targetId: {
          type: Type.STRING,
          description: 'ID of the target district to isolate or test.',
        }
      },
      required: ['eventType'],
    },
  },
  {
    name: 'toggleGPU',
    parameters: {
      type: Type.OBJECT,
      description: 'Activates or scales back the H100 GPU acceleration cluster.',
      properties: {
        active: { type: Type.BOOLEAN, description: 'True to engage full Tensor power.' }
      },
      required: ['active'],
    }
  }
];

export interface InferenceResult {
  text: string;
  metrics: InferenceMetrics;
  functionCalls?: any[];
  cost: number;
  modelUsed: string;
}

/**
 * InferenceGateway: Federated AI Controller
 * Manages GPU routing and caching logic for the FlashFusion ecosystem.
 */
export const InferenceGateway = {
  /**
   * Orchestrates a chat completion with tier-aware routing and L2 caching.
   */
  async chat(message: string, isBoosted: boolean = false, tflops: number = 120): Promise<InferenceResult> {
    const startTime = Date.now();
    const cacheKey = `${isBoosted ? 'H100' : 'STD'}:${message.trim().toLowerCase()}`;

    // 1. Caching Strategy: L2 Hit Check
    const cachedEntry = INFERENCE_CACHE.get(cacheKey);
    if (cachedEntry && cachedEntry.expiry > Date.now()) {
      return {
        ...cachedEntry.result,
        metrics: {
          ...cachedEntry.result.metrics,
          cached: true,
          totalLatency: Date.now() - startTime,
          ttft: 10 // Immediate response simulation
        }
      };
    }

    // 2. Optimized Tier Routing
    // 'gemini-3-pro-preview' for heavy H100 simulation (High Thinking Budget)
    // 'gemini-3-flash-preview' for standard edge relay (Latency Focused)
    const activeModel = isBoosted ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: activeModel,
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: GET_FEDERATED_PROMPT(isBoosted, tflops),
          tools: [{ functionDeclarations: TOOL_MANIFEST }],
          temperature: isBoosted ? 0.8 : 0.2,
          // Precision reasoning only when GPU clusters are boosted
          thinkingConfig: isBoosted ? { thinkingBudget: 24576 } : { thinkingBudget: 0 },
        },
      });

      const totalLatency = Date.now() - startTime;
      const responseText = response.text || "Synchrony Error: Gateway timed out.";
      
      // Federated Economics: Synthetic cost modeling
      const tokenEst = (message.length + responseText.length) / 4;
      const rate = isBoosted ? 0.012 : 0.0001; // Tiered pricing simulation
      const estimatedCost = (tokenEst / 1000) * rate;

      const result: InferenceResult = {
        text: responseText,
        functionCalls: response.functionCalls,
        metrics: {
          ttft: totalLatency * 0.12, 
          totalLatency,
          cached: false,
          accelerated: isBoosted,
          provider: 'FlashFusion TensorMesh',
          cluster: isBoosted ? 'H100-PRO-CLUSTER-01' : 'EDGE-RELAY-07',
          throughput: tflops
        },
        cost: estimatedCost,
        modelUsed: activeModel
      };

      // 3. Cache Persistence
      INFERENCE_CACHE.set(cacheKey, { 
        result, 
        expiry: Date.now() + CACHE_TTL 
      });

      return result;
    } catch (error) {
      console.error("[FFAI] Bridge Fault:", error);
      throw error;
    }
  }
};
