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

### 3. AWS CloudFront Configuration

```terraform
# CloudFront distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Production CDN"
  default_root_object = "index.html"
  price_class         = "PriceClass_All"
  aliases             = ["www.example.com", "example.com"]

  # Origin for static assets (S3)
  origin {
    domain_name = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id   = "S3-static"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  # Origin for API
  origin {
    domain_name = "api-origin.example.com"
    origin_id   = "API"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "X-Origin-Verify"
      value = var.origin_secret
    }
  }

  # Default cache behavior (static)
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-static"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id          = aws_cloudfront_cache_policy.static.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.static.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  # API cache behavior
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "API"
    viewer_protocol_policy = "https-only"
    compress               = true

    cache_policy_id          = aws_cloudfront_cache_policy.api.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.api.id
  }

  # Error responses
  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/errors/404.html"
    error_caching_min_ttl = 300
  }

  custom_error_response {
    error_code            = 503
    response_code         = 503
    response_page_path    = "/errors/503.html"
    error_caching_min_ttl = 60
  }

  # SSL certificate
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.main.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Geographic restrictions
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # WAF association
  web_acl_id = aws_wafv2_web_acl.main.arn

  tags = {
    Environment = "production"
  }
}

# Cache policies
resource "aws_cloudfront_cache_policy" "static" {
  name        = "static-assets"
  comment     = "Cache policy for static assets"
  default_ttl = 86400
  max_ttl     = 2592000
  min_ttl     = 3600

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

resource "aws_cloudfront_cache_policy" "api" {
  name        = "api-caching"
  comment     = "Cache policy for API responses"
  default_ttl = 60
  max_ttl     = 300
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "whitelist"
      headers {
        items = ["Authorization", "Accept"]
      }
    }
    query_strings_config {
      query_string_behavior = "all"
    }
  }
}

# CloudFront Function for URL rewriting
resource "aws_cloudfront_function" "url_rewrite" {
  name    = "url-rewrite"
  runtime = "cloudfront-js-1.0"
  comment = "Rewrite URLs for SPA"
  publish = true

  code = <<-EOT
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Check if URI has a file extension
      if (!uri.includes('.')) {
        // Rewrite to index.html for SPA routing
        request.uri = '/index.html';
      }

      return request;
    }
  EOT
}
```

### 4. Cache Invalidation

```python
# cdn_cache.py - CDN cache management
import boto3
import requests
import time
from typing import List, Dict, Optional

class CDNCacheManager:
    """Manage CDN cache invalidation."""

    def __init__(
        self,
        cloudflare_token: Optional[str] = None,
        cloudflare_zone_id: Optional[str] = None,
        cloudfront_distribution_id: Optional[str] = None
    ):
        self.cloudflare_token = cloudflare_token
        self.cloudflare_zone_id = cloudflare_zone_id
        self.cloudfront = boto3.client('cloudfront') if cloudfront_distribution_id else None
        self.cloudfront_distribution_id = cloudfront_distribution_id

    def invalidate_cloudflare(self, urls: List[str] = None, purge_everything: bool = False) -> Dict:
        """Invalidate CloudFlare cache."""
        headers = {
            'Authorization': f'Bearer {self.cloudflare_token}',
            'Content-Type': 'application/json'
        }

        if purge_everything:
            data = {'purge_everything': True}
        else:
            data = {'files': urls}

        response = requests.post(
            f'https://api.cloudflare.com/client/v4/zones/{self.cloudflare_zone_id}/purge_cache',
            headers=headers,
            json=data
        )

        return response.json()

    def invalidate_cloudflare_by_prefix(self, prefixes: List[str]) -> Dict:
        """Invalidate CloudFlare cache by URL prefix."""
        headers = {
            'Authorization': f'Bearer {self.cloudflare_token}',
            'Content-Type': 'application/json'
        }

        data = {'prefixes': prefixes}

        response = requests.post(
            f'https://api.cloudflare.com/client/v4/zones/{self.cloudflare_zone_id}/purge_cache',
            headers=headers,
            json=data
        )

        return response.json()

    def invalidate_cloudfront(self, paths: List[str]) -> Dict:
        """Invalidate CloudFront cache."""
        caller_reference = f'invalidation-{int(time.time())}'

        response = self.cloudfront.create_invalidation(
            DistributionId=self.cloudfront_distribution_id,
            InvalidationBatch={
                'Paths': {
                    'Quantity': len(paths),
                    'Items': paths
                },
                'CallerReference': caller_reference
            }
        )

        return {
            'invalidation_id': response['Invalidation']['Id'],
            'status': response['Invalidation']['Status'],
            'paths': paths
        }

    def wait_for_cloudfront_invalidation(self, invalidation_id: str, timeout: int = 300) -> bool:
        """Wait for CloudFront invalidation to complete."""
        start_time = time.time()

        while time.time() - start_time < timeout:
            response = self.cloudfront.get_invalidation(
                DistributionId=self.cloudfront_distribution_id,
                Id=invalidation_id
            )

            if response['Invalidation']['Status'] == 'Completed':
                return True

            time.sleep(10)

        return False


# Deployment hook for cache invalidation
def post_deployment_invalidation(
    cdn_manager: CDNCacheManager,
    changed_files: List[str],
    base_url: str
) -> Dict:
    """Invalidate cache for changed files after deployment."""
    # Convert file paths to URLs
    urls = [f"{base_url}/{f}" for f in changed_files]

    # Categorize files
    static_files = [u for u in urls if any(u.endswith(ext) for ext in ['.css', '.js', '.jpg', '.png'])]
    html_files = [u for u in urls if u.endswith('.html')]

    results = {}

    # Invalidate static files
    if static_files:
        results['static'] = cdn_manager.invalidate_cloudflare(static_files)

    # Invalidate HTML files
    if html_files:
        results['html'] = cdn_manager.invalidate_cloudflare(html_files)

    return results
```

## Tools and Technologies

### CDN Providers
| Provider | Strengths | Best For |
|----------|-----------|----------|
| CloudFlare | Security, free tier | General purpose |
| Fastly | VCL flexibility | Custom logic |
| AWS CloudFront | AWS integration | AWS workloads |
| Akamai | Enterprise scale | Large enterprises |

### Edge Computing
| Platform | Runtime | Use Case |
|----------|---------|----------|
| CloudFlare Workers | V8 | Edge logic |
| Fastly Compute | Wasm | Complex edge |
| Lambda@Edge | Node.js | AWS integration |
| CloudFront Functions | JavaScript | URL rewrites |

## Metrics and Monitoring

### CDN Performance Metrics

```yaml
# Prometheus alerting for CDN health
groups:
  - name: cdn_alerts
    rules:
      - alert: LowCacheHitRatio
        expr: |
          sum(rate(cdn_cache_hits_total[5m]))
          / sum(rate(cdn_requests_total[5m])) < 0.8
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Cache hit ratio below 80%"

      - alert: HighOriginLatency
        expr: cdn_origin_latency_seconds_p99 > 1
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Origin latency exceeds 1 second"

      - alert: High4xxErrorRate
        expr: |
          sum(rate(cdn_responses_total{status=~"4.."}[5m]))
          / sum(rate(cdn_responses_total[5m])) > 0.05
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "4xx error rate exceeds 5%"

      - alert: OriginUnreachable
        expr: cdn_origin_health == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "CDN cannot reach origin"
```

## Common Pitfalls

### 1. Over-Aggressive Caching
**Problem**: Dynamic content cached too long
**Solution**: Proper cache-control headers and vary headers

### 2. Ignoring Cache Keys
**Problem**: Low hit ratio due to query strings
**Solution**: Normalize URLs and configure proper cache keys

### 3. No Origin Shield
**Problem**: Multiple edge requests to origin
**Solution**: Enable origin shield or regional caching

### 4. Missing Stale-While-Revalidate
**Problem**: Users wait during cache refresh
**Solution**: Configure stale content serving

### 5. Poor Cache Invalidation
**Problem**: Stale content after deployments
**Solution**: Version assets or automate invalidation

## Integration Points

### Upstream Dependencies
- **Origin Servers**: Application backends
- **Object Storage**: S3, GCS for static assets
- **DNS Providers**: CNAME configuration
- **Certificate Authorities**: SSL certificates

### Downstream Consumers
- **End Users**: Website visitors
- **Mobile Apps**: API consumers
- **Third-party Integrations**: Webhooks
- **Monitoring Systems**: Analytics

### CDN Architecture
```
[Users] --> [CDN Edge PoPs] --> [Origin Shield] --> [Origin Servers]
                  |
            [Edge Logic]
                  |
            [Cache Layer]
                  |
          [Security (WAF/DDoS)]
```

## Best Practices Checklist

- [ ] Cache-Control headers properly configured
- [ ] Static assets versioned or cache-busted
- [ ] Origin shield enabled
- [ ] Stale-while-revalidate configured
- [ ] WAF rules active and tuned
- [ ] DDoS protection enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] HTTP/2 and HTTP/3 enabled
- [ ] Cache hit ratio monitored
- [ ] Automated invalidation on deploy
