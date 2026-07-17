// Post-build script - makes MCP server executable
import { chmod } from 'fs/promises';
import { join } from 'path';

const serverPath = join(process.cwd(), 'dist', 'mcp', 'server.js');

try {
  await chmod(serverPath, 0o755);
  console.log('✅ Made MCP server executable');
} catch (error) {
  console.error('❌ Failed to chmod server:', error);
  process.exit(1);
}
