import { describe, expect, it } from 'vitest';
import { createProject } from './api-client';
describe('api client',()=>{it('rejects invalid payload',async()=>{await expect(createProject('http://x',{name:''})).rejects.toThrow()})});
