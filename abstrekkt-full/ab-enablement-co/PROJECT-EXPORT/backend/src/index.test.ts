import { describe, expect, it } from 'vitest';
import { buildServer } from './index.js';
describe('api',()=>{it('health',async()=>{const app=buildServer(); const r=await app.inject({method:'GET',url:'/health'}); expect(r.statusCode).toBe(200); await app.close();})});
