import axios from 'axios';
import type {
  FeatureFlag,
  CreateFlagInput,
  UpdateFlagInput,
  EvaluationContext,
  FlagEvaluation,
} from '../types';

const API_BASE = '/api/feature-flags';

export async function getFlags(): Promise<FeatureFlag[]> {
  const response = await axios.get<FeatureFlag[]>(API_BASE);
  return response.data;
}

export async function getFlag(key: string): Promise<FeatureFlag> {
  const response = await axios.get<FeatureFlag>(`${API_BASE}/${key}`);
  return response.data;
}

export async function createFlag(input: CreateFlagInput): Promise<FeatureFlag> {
  const response = await axios.post<FeatureFlag>(API_BASE, input);
  return response.data;
}

export async function updateFlag(key: string, input: UpdateFlagInput): Promise<FeatureFlag> {
  const response = await axios.patch<FeatureFlag>(`${API_BASE}/${key}`, input);
  return response.data;
}

export async function deleteFlag(key: string): Promise<void> {
  await axios.delete(`${API_BASE}/${key}`);
}

export async function evaluateFlag(
  key: string,
  context: EvaluationContext
): Promise<FlagEvaluation> {
  const response = await axios.post<FlagEvaluation>(`${API_BASE}/${key}/evaluate`, context);
  return response.data;
}

export async function evaluateAllFlags(
  context: EvaluationContext
): Promise<Record<string, FlagEvaluation>> {
  const response = await axios.post<Record<string, FlagEvaluation>>(
    `${API_BASE}/evaluate`,
    context
  );
  return response.data;
}

export async function toggleFlag(key: string, enabled: boolean): Promise<FeatureFlag> {
  const response = await axios.patch<FeatureFlag>(`${API_BASE}/${key}`, { enabled });
  return response.data;
}
