// --- block 0 (lang: bash) ---
        helm uninstall mcp-tunnel -n mcp-tunnel
        

// --- block 1 (lang: bash) ---
        docker compose down --timeout 0
        

// --- block 2 (lang: bash) ---
        helm uninstall mcp-tunnel -n mcp-tunnel
        

// --- block 3 (lang: bash) ---
        docker compose down
        

// --- block 4 (lang: bash) ---
        kubectl -n mcp-tunnel delete secret \
          mcp-tunnel mcp-tunnel-token mcp-tunnel-cert \
          --ignore-not-found
        