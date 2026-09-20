---
name: cdn-configuration
description: Helps configure and build cdn configuration processes. name: cdn-configuration description: CloudFlare, Fastly, edge caching, and content delivery optimization. Use when configuring, building, or troubleshooting AI agent workflows.
---

# CDN Configuration

---
name: cdn-configuration
description: CloudFlare, Fastly, edge caching, and content delivery optimization
version: 1.0.0
category: infrastructure
tags: [cdn, cloudflare, fastly, caching, performance, edge]
related_skills: [network-configuration, ssl-certificates, monitoring-alerting]
---

## Overview

CDN Configuration encompasses the setup and optimization of content delivery networks for improved performance, reliability, and security. This skill covers implementing CDN solutions using CloudFlare, Fastly, and cloud-native CDN services, including edge caching strategies, security configurations, and performance tuning.

Modern CDNs provide much more than caching - they offer DDoS protection, WAF capabilities, edge computing, and global load balancing. Effective CDN configuration significantly improves user experience while reducing origin server load.

### Key Principles

1. **Cache Everything Possible**: Maximize cache hit ratio
2. **Edge Security**: Implement security at the edge
3. **Origin Protection**: Shield origins from direct traffic
4. **Observability**: Monitor cache performance and errors
5. **Graceful Degradation**: Serve stale content when origin fails

## When to Use This Skill

### Appropriate Scenarios

- Improving website performance globally
- Implementing DDoS protection
- Serving static assets efficiently
- API caching and acceleration
- Edge computing workloads
- Multi-region content delivery
- Traffic management and load balancing
- Bot protection and WAF

### When to Consider Alternatives

- **Single-region internal apps**: Direct serving may suffice
- **Real-time data only**: CDN adds latency for uncacheable content
- **Very low traffic**: Overhead may not be justified
- **Sensitive data**: Some compliance may restrict CDN usage

## Core Processes

### 1. CloudFlare Configuration

```terraform
# CloudFlare zone and settings
resource "cloudflare_zone" "main" {
  account_id = var.cloudflare_account_id
  zone       = "example.com"
  plan       = "business"
}

resource "cloudflare_zone_settings_override" "main" {
  zone_id = cloudflare_zone.main.id

  settings {
    # SSL/TLS
    ssl                      = "strict"
    always_use_https         = "on"
    min_tls_version          = "1.2"
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"

    # Performance
    brotli         = "on"
    minify {
      css  = "on"
      html = "on"
      js   = "on"
    }
    rocket_loader  = "on"
    early_hints    = "on"

    # Caching
    browser_cache_ttl = 14400
    cache_level       = "aggressive"

    # Security
    security_level     = "medium"
    challenge_ttl      = 1800
    browser_check      = "on"
    email_obfuscation  = "on"
    hotlink_protection = "on"

    # Other
    http3              = "on"
    zero_rtt           = "on"
    websockets         = "on"
    opportunistic_onion = "on"
  }
}

# Page rules for caching
resource "cloudflare_page_rule" "static_assets" {
  zone_id  = cloudflare_zone.main.id
  target   = "example.com/static/*"
  priority = 1

  actions {
    cache_level       = "cache_everything"
    edge_cache_ttl    = 2592000  # 30 days
    browser_cache_ttl = 86400    # 1 day
  }
}

resource "cloudflare_page_rule" "api_no_cache" {
  zone_id  = cloudflare_zone.main.id
  target   = "api.example.com/*"
  priority = 2

  actions {
    cache_level          = "bypass"
    disable_performance  = true
    disable_security     = false
  }
}

resource "cloudflare_page_rule" "html_caching" {
  zone_id  = cloudflare_zone.main.id
  target   = "example.com/*.html"
  priority = 3

  actions {
    cache_level       = "cache_everything"
    edge_cache_ttl    = 3600    # 1 hour
    browser_cache_ttl = 300     # 5 minutes
    cache_on_cookie   = "session_token"
  }
}

# WAF rules
resource "cloudflare_ruleset" "waf" {
  zone_id     = cloudflare_zone.main.id
  name        = "Custom WAF Rules"
  description = "Custom security rules"
  kind        = "zone"
  phase       = "http_request_firewall_custom"

  rules {
    action      = "block"
    expression  = "(http.request.uri.path contains \"/wp-admin\" and not ip.src in {10.0.0.0/8})"
    description = "Block external WordPress admin access"
    enabled     = true
  }

  rules {
    action      = "challenge"
    expression  = "(cf.threat_score > 30)"
    description = "Challenge high threat score visitors"
    enabled     = true
  }

  rules {
    action      = "block"
    expression  = "(http.user_agent contains \"sqlmap\")"
    description = "Block known attack tools"
    enabled     = true
  }
}

# Rate limiting
resource "cloudflare_rate_limit" "api" {
  zone_id   = cloudflare_zone.main.id
  threshold = 100
  period    = 60
  match {
    request {
      url_pattern = "api.example.com/*"
      schemes     = ["HTTPS"]
      methods     = ["GET", "POST", "PUT", "DELETE"]
    }
    response {
      statuses = [200, 201, 202, 301, 429]
    }
  }
  action {
    mode    = "simulate"
    timeout = 60
    response {
      content_type = "application/json"
      body         = "{\"error\": \"Rate limit exceeded\"}"
    }
  }
  disabled    = false
  description = "API rate limiting"
}
```

### 2. Fastly VCL Configuration

```vcl
# Fastly VCL configuration

sub vcl_recv {
  # Normalize request
  set req.url = regsub(req.url, "\?$", "");

  # Set backend based on path
  if (req.url ~ "^/api/") {
    set req.backend = F_api_origin;
  } else if (req.url ~ "^/static/") {
    set req.backend = F_static_origin;
  } else {
    set req.backend = F_web_origin;
  }

  # Force HTTPS
  if (!req.http.Fastly-SSL) {
    error 801 "Force HTTPS";
  }

  # Remove tracking parameters for better caching
  set req.url = querystring.filter_except(req.url, "page" + querystring.filtersep() + "sort");

  # Normalize Accept-Encoding
  if (req.http.Accept-Encoding) {
    if (req.http.Accept-Encoding ~ "br") {
      set req.http.Accept-Encoding = "br";
    } elsif (req.http.Accept-Encoding ~ "gzip") {
      set req.http.Accept-Encoding = "gzip";
    } else {
      unset req.http.Accept-Encoding;
    }
  }

  # Pass authenticated requests
  if (req.http.Authorization || req.http.Cookie ~ "session_token") {
    return(pass);
  }

  # Cache static assets aggressively
  if (req.url ~ "\.(css|js|jpg|jpeg|png|gif|ico|woff2?|ttf|svg)$") {
    unset req.http.Cookie;
    return(lookup);
  }

  return(lookup);
}

sub vcl_fetch {
  # Stale-while-revalidate
  set beresp.stale_while_revalidate = 86400s;
  set beresp.stale_if_error = 86400s;

  # Cache static assets
  if (req.url ~ "\.(css|js|jpg|jpeg|png|gif|ico|woff2?|ttf|svg)$") {
    set beresp.ttl = 30d;
    set beresp.http.Cache-Control = "public, max-age=2592000, immutable";
    unset beresp.http.Set-Cookie;
  }

  # Cache HTML with short TTL
  if (beresp.http.Content-Type ~ "text/html") {
    set beresp.ttl = 5m;
    set beresp.grace = 1h;
  }

  # Don't cache error responses
  if (beresp.status >= 500) {
    set beresp.ttl = 0s;
    set beresp.grace = 0s;
    return(pass);
  }

  # Enable ESI
  if (beresp.http.Surrogate-Control ~ "ESI/1.0") {
    esi;
  }

  return(deliver);
}

sub vcl_deliver {
  # Add cache status header
  if (obj.hits > 0) {
    set resp.http.X-Cache = "HIT";
    set resp.http.X-Cache-Hits = obj.hits;
  } else {
    set resp.http.X-Cache = "MISS";
  }

  # Security headers
  set resp.http.X-Content-Type-Options = "nosniff";
  set resp.http.X-Frame-Options = "SAMEORIGIN";
  set resp.http.X-XSS-Protection = "1; mode=block";
  set resp.http.Referrer-Policy = "strict-origin-when-cross-origin";

  # Remove internal headers
  unset resp.http.X-Powered-By;
  unset resp.http.Server;

  return(deliver);
}

sub vcl_error {
  # Custom error pages
  if (obj.status == 801) {
    set obj.status = 301;
    set obj.http.Location = "https://" + req.http.host + req.url;
    return(deliver);
  }

  if (obj.status == 503) {
    synthetic {"
      <!DOCTYPE html>
      <html>
      <head><title>Service Temporarily Unavailable</title></head>
      <body>
        <h1>We'll be right back</h1>
        <p>Our service is temporarily unavailable. Please try again in a few moments.</p>
      </body>
      </html>
    "};
    return(deliver);
  }
}
```


## References
- `references/3-aws-cloudfront-configuration.md` — 3. AWS CloudFront Configuration
- `references/references.md` — References
- `references/tools-and-technologies.md` — Tools and Technologies
