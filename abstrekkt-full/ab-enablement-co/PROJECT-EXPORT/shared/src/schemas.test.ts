import { describe, expect, it } from 'vitest';
import { CreateProjectRequestSchema } from './schemas.js';
describe('schemas',()=>{it('validates project',()=>{expect(CreateProjectRequestSchema.parse({name:'Memoir'}).name).toBe('Memoir')})});
