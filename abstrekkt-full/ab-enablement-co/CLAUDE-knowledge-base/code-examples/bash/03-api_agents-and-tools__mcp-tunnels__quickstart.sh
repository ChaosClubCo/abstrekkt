// --- block 0 (lang: bash) ---
    mkdir -p mcp-tunnel/{config,data}
    cd mcp-tunnel
    export TUNNEL_DOMAIN=YOUR_TUNNEL_DOMAIN_HERE   # from step 1
    export TUNNEL_TOKEN='eyJ...'            # from step 1
    

// --- block 2 (lang: bash) ---
    openssl req -x509 -newkey rsa:2048 -nodes \
      -keyout data/ca.key -out data/ca.crt \
      -days 3650 -subj "/CN=mcp-tunnel-ca" \
      -addext "basicConstraints=critical,CA:TRUE" \
      -addext "keyUsage=critical,keyCertSign,cRLSign" \
      -addext "subjectKeyIdentifier=hash"

    cat > data/tls.ext <<EOF
    subjectAltName = DNS:${TUNNEL_DOMAIN},DNS:*.${TUNNEL_DOMAIN}
    authorityKeyIdentifier = keyid,issuer
    extendedKeyUsage = serverAuth
    EOF

    openssl req -newkey rsa:2048 -nodes \
      -keyout data/tls.key -out /tmp/server.csr \
      -subj "/CN=${TUNNEL_DOMAIN}"
    openssl x509 -req -in /tmp/server.csr \
      -CA data/ca.crt -CAkey data/ca.key -CAcreateserial \
      -out data/tls.crt -days 90 -extfile data/tls.ext

    chmod 644 data/tls.key
    

// --- block 4 (lang: bash) ---
    cat > hello_server.py <<'EOF'
    from mcp.server.fastmcp import FastMCP

    mcp = FastMCP("hello-server", host="0.0.0.0", port=9000)


    @mcp.tool()
    def hello(name: str = "world") -> str:
        """Say hello to someone."""
        return f"Hello, {name}!"


    if __name__ == "__main__":
        mcp.run(transport="streamable-http")
    EOF
    

// --- block 6 (lang: bash) ---
    cat > config/mcp-proxy.yaml <<EOF
    listen_addr: ":8080"
    tunnel_domain: ${TUNNEL_DOMAIN}
    tls:
      cert_file: /data/tls.crt
      key_file: /data/tls.key
    routes:
      echo: http://hello-mcp:9000
    EOF

    cat > docker-compose.yaml <<'EOF'
    services:
      mcp-proxy:
        image: us-docker.pkg.dev/anthropic-public-registry/images/mcp-proxy@sha256:6b9adedbf2763143ec72f106ecaf0ce7fd3294e89b208f54a1db97a33d14c5ba
        volumes:
          - ./config/mcp-proxy.yaml:/etc/mcp-gateway/config.yaml:ro
          - ./data:/data:ro
        restart: unless-stopped

      cloudflared:
        image: cloudflare/cloudflared@sha256:6b599ca3e974349ead3286d178da61d291961182ec3fe9c505e1dd02c8ac31b0
        command: tunnel --no-autoupdate run --url http://localhost:8080
        environment:
          - TUNNEL_TOKEN
        network_mode: "service:mcp-proxy"
        restart: unless-stopped

      hello-mcp:
        image: python:3.13-slim
        working_dir: /app
        volumes:
          - ./hello_server.py:/app/hello_server.py:ro
        command: sh -c "pip install --quiet mcp && python hello_server.py"
        restart: unless-stopped
    EOF
    

// --- block 8 (lang: bash) ---
    docker compose up -d
    docker compose logs mcp-proxy | grep "route configured"
    docker compose logs cloudflared | grep "Registered tunnel connection"
    