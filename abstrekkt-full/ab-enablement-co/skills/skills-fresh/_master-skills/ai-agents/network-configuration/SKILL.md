---
name: network-configuration
description: name: network-configuration description: VPNs, firewalls, DNS management, and network architecture for secure and reliable connectivity. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Network Configuration

---
name: network-configuration
description: VPNs, firewalls, DNS management, and network architecture for secure and reliable connectivity
version: 1.0.0
category: infrastructure
tags: [networking, vpn, firewall, dns, security, infrastructure]
related_skills: [server-administration, ssl-certificates, cdn-configuration]
---

## Overview

Network Configuration encompasses the design, implementation, and management of network infrastructure including VPNs, firewalls, DNS, load balancers, and routing. This skill is fundamental to ensuring secure, reliable, and performant connectivity between applications, services, and users.

Modern network configuration extends beyond traditional on-premises networking to include cloud virtual networks, software-defined networking, and zero-trust architectures. Effective network configuration requires understanding both the technical protocols and the security implications of connectivity decisions.

### Key Principles

1. **Defense in Depth**: Layer multiple security controls throughout the network
2. **Least Privilege**: Allow only necessary network access
3. **Segmentation**: Isolate network zones based on security requirements
4. **Automation**: Infrastructure as code for network configurations
5. **Observability**: Monitor all network traffic and connections

## When to Use This Skill

### Appropriate Scenarios

- Setting up cloud virtual networks (VPC, VNet)
- Configuring firewalls and security groups
- Implementing VPN connections for remote access
- Managing DNS zones and records
- Designing load balancing strategies
- Implementing network segmentation
- Troubleshooting connectivity issues
- Planning hybrid cloud networking

### When to Consider Alternatives

- **Application-level security**: May need API gateways instead
- **Simple single-server**: Cloud provider defaults may suffice
- **Managed services**: May handle networking internally
- **CDN requirements**: Use cdn-configuration skill

## Core Processes

### 1. Cloud VPC Architecture

```terraform
# AWS VPC with public and private subnets
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "production-vpc"
    Environment = "production"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "production-igw" }
}

# Public Subnets (across availability zones)
resource "aws_subnet" "public" {
  count                   = 3
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-${count.index + 1}"
    Tier = "public"
  }
}

# Private Subnets
resource "aws_subnet" "private" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "private-subnet-${count.index + 1}"
    Tier = "private"
  }
}

# NAT Gateways for private subnet internet access
resource "aws_eip" "nat" {
  count  = 3
  domain = "vpc"
  tags   = { Name = "nat-eip-${count.index + 1}" }
}

resource "aws_nat_gateway" "main" {
  count         = 3
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = { Name = "nat-gateway-${count.index + 1}" }
}

# Route Tables
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "public-route-table" }
}

resource "aws_route_table" "private" {
  count  = 3
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main[count.index].id
  }

  tags = { Name = "private-route-table-${count.index + 1}" }
}

# VPC Flow Logs
resource "aws_flow_log" "main" {
  vpc_id                   = aws_vpc.main.id
  traffic_type             = "ALL"
  log_destination_type     = "cloud-watch-logs"
  log_destination          = aws_cloudwatch_log_group.flow_logs.arn
  iam_role_arn             = aws_iam_role.flow_logs.arn
  max_aggregation_interval = 60

  tags = { Name = "vpc-flow-logs" }
}
```

### 2. Security Group Configuration

```terraform
# Web tier security group
resource "aws_security_group" "web" {
  name        = "web-tier-sg"
  description = "Security group for web servers"
  vpc_id      = aws_vpc.main.id

  # HTTPS from anywhere
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS from internet"
  }

  # HTTP redirect only
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP redirect"
  }

  # All outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound"
  }

  tags = { Name = "web-tier-sg" }
}

# Application tier security group
resource "aws_security_group" "app" {
  name        = "app-tier-sg"
  description = "Security group for application servers"
  vpc_id      = aws_vpc.main.id

  # Allow from web tier only
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id]
    description     = "Application port from web tier"
  }

  # SSH from bastion only
  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
    description     = "SSH from bastion"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "app-tier-sg" }
}

# Database tier security group
resource "aws_security_group" "db" {
  name        = "db-tier-sg"
  description = "Security group for databases"
  vpc_id      = aws_vpc.main.id

  # PostgreSQL from app tier only
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
    description     = "PostgreSQL from app tier"
  }

  # No internet egress for databases
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS for AWS API calls only"
  }

  tags = { Name = "db-tier-sg" }
}
```

### 3. DNS Configuration

```terraform
# Route53 DNS Zone
resource "aws_route53_zone" "main" {
  name = "example.com"

  tags = {
    Environment = "production"
  }
}

# A Record with health check
resource "aws_route53_health_check" "primary" {
  fqdn              = "primary.example.com"
  port              = 443
  type              = "HTTPS"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30

  tags = { Name = "primary-health-check" }
}

# Primary record with failover
resource "aws_route53_record" "www_primary" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.example.com"
  type    = "A"

  alias {
    name                   = aws_lb.primary.dns_name
    zone_id                = aws_lb.primary.zone_id
    evaluate_target_health = true
  }

  failover_routing_policy {
    type = "PRIMARY"
  }

  set_identifier  = "primary"
  health_check_id = aws_route53_health_check.primary.id
}

resource "aws_route53_record" "www_secondary" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.example.com"
  type    = "A"

  alias {
    name                   = aws_lb.secondary.dns_name
    zone_id                = aws_lb.secondary.zone_id
    evaluate_target_health = true
  }

  failover_routing_policy {
    type = "SECONDARY"
  }

  set_identifier = "secondary"
}

# Weighted routing for gradual traffic shifting
resource "aws_route53_record" "api_v1" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.example.com"
  type    = "A"
  ttl     = 60

  weighted_routing_policy {
    weight = 90
  }

  set_identifier = "api-v1"
  records        = [aws_eip.api_v1.public_ip]
}

resource "aws_route53_record" "api_v2" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.example.com"
  type    = "A"
  ttl     = 60

  weighted_routing_policy {
    weight = 10
  }

  set_identifier = "api-v2"
  records        = [aws_eip.api_v2.public_ip]
}
```

### 4. VPN Configuration

```terraform
# AWS Site-to-Site VPN
resource "aws_vpn_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "production-vpn-gateway" }
}

resource "aws_customer_gateway" "office" {
  bgp_asn    = 65000
  ip_address = "203.0.113.1"  # Office public IP
  type       = "ipsec.1"

  tags = { Name = "office-gateway" }
}

resource "aws_vpn_connection" "office" {
  vpn_gateway_id      = aws_vpn_gateway.main.id
  customer_gateway_id = aws_customer_gateway.office.id
  type                = "ipsec.1"
  static_routes_only  = false

  tunnel1_inside_cidr   = "169.254.100.0/30"
  tunnel1_preshared_key = var.vpn_psk_tunnel1

  tunnel2_inside_cidr   = "169.254.100.4/30"
  tunnel2_preshared_key = var.vpn_psk_tunnel2

  tags = { Name = "office-vpn-connection" }
}

# Route propagation
resource "aws_vpn_gateway_route_propagation" "private" {
  count          = length(aws_route_table.private)
  vpn_gateway_id = aws_vpn_gateway.main.id
  route_table_id = aws_route_table.private[count.index].id
}
```

### 5. Firewall Rules (iptables)

```bash
#!/bin/bash
# Linux firewall configuration script

# Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# Default policies - deny all incoming, allow outgoing
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# SSH from specific networks only
iptables -A INPUT -p tcp --dport 22 -s 10.0.0.0/8 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT

# Web traffic
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Application ports from internal only
iptables -A INPUT -p tcp --dport 8080 -s 10.0.0.0/8 -j ACCEPT

# ICMP for diagnostics (rate limited)
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT

# Log dropped packets
iptables -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables-dropped: " --log-level 4

# Rate limiting for protection
iptables -A INPUT -p tcp --dport 443 -m state --state NEW -m limit --limit 100/minute --limit-burst 200 -j ACCEPT

# Save rules
iptables-save > /etc/iptables/rules.v4

echo "Firewall rules applied"
```

## Tools and Technologies

### Network Management
| Tool | Purpose | Use Case |
|------|---------|----------|
| AWS VPC | Cloud networking | AWS infrastructure |
| Azure VNet | Cloud networking | Azure infrastructure |
| Terraform | Infrastructure as code | Network provisioning |
| Ansible | Configuration management | Device configuration |

### DNS Services
| Service | Strengths | Best For |
|---------|-----------|----------|
| Route53 | AWS integration | AWS workloads |
| Cloudflare DNS | Performance, DDoS | Global presence |
| Azure DNS | Azure integration | Azure workloads |
| Google Cloud DNS | GCP integration | GCP workloads |

### VPN Solutions
| Solution | Type | Use Case |
|----------|------|----------|
| WireGuard | Modern VPN | Point-to-point |
| OpenVPN | SSL VPN | Remote access |
| AWS Site-to-Site | IPsec | Cloud connectivity |
| Tailscale | Mesh VPN | Zero-trust access |

## Metrics and Monitoring

### Network Performance KPIs

```yaml
# Prometheus alerting rules for network monitoring
groups:
  - name: network_alerts
    rules:
      - alert: HighPacketLoss
        expr: |
          rate(node_network_receive_drop_total[5m])
          / rate(node_network_receive_packets_total[5m]) > 0.01
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High packet loss on {{ $labels.device }}"

      - alert: NetworkInterfaceDown
        expr: node_network_up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Network interface {{ $labels.device }} is down"

      - alert: HighBandwidthUtilization
        expr: |
          rate(node_network_transmit_bytes_total[5m]) * 8
          / node_network_speed_bytes * 100 > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High bandwidth on {{ $labels.device }}"

      - alert: DNSResolutionSlow
        expr: probe_dns_lookup_time_seconds > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow DNS resolution for {{ $labels.target }}"
```

### Network Diagnostics Script

```bash
#!/bin/bash
# Network diagnostics script

echo "=== Network Diagnostics ==="
echo ""

echo "1. Interface Status:"
ip -br addr show
echo ""

echo "2. Routing Table:"
ip route show
echo ""

echo "3. DNS Configuration:"
cat /etc/resolv.conf
echo ""

echo "4. Active Connections:"
ss -tuln | head -20
echo ""

echo "5. Firewall Rules:"
iptables -L -n --line-numbers | head -30
echo ""

echo "6. Connectivity Tests:"
for host in 8.8.8.8 google.com internal-api.local; do
    if ping -c 1 -W 2 "$host" > /dev/null 2>&1; then
        echo "  $host: OK"
    else
        echo "  $host: FAILED"
    fi
done
echo ""

echo "7. DNS Resolution Tests:"
for domain in example.com api.internal; do
    result=$(dig +short "$domain" 2>/dev/null | head -1)
    echo "  $domain: ${result:-FAILED}"
done
```

## Common Pitfalls

### 1. Overly Permissive Security Groups
**Problem**: 0.0.0.0/0 access to sensitive ports
**Solution**: Use specific CIDR ranges and security group references

### 2. Missing Egress Controls
**Problem**: Compromised instances can exfiltrate data freely
**Solution**: Implement egress filtering and monitoring

### 3. DNS TTL Misconfiguration
**Problem**: Long TTLs delay failover; short TTLs increase load
**Solution**: Balance TTLs based on criticality (60-300s for critical)

### 4. Single NAT Gateway
**Problem**: Single point of failure for outbound traffic
**Solution**: NAT gateway per availability zone

### 5. No Network Logging
**Problem**: Cannot investigate security incidents
**Solution**: Enable VPC flow logs and firewall logging

## Integration Points

### Upstream Dependencies
- **Cloud Providers**: AWS, Azure, GCP APIs
- **DNS Registrars**: Domain registration
- **ISPs**: Internet connectivity
- **Hardware Vendors**: Physical network equipment

### Downstream Consumers
- **Applications**: Service connectivity
- **Load Balancers**: Traffic distribution
- **Monitoring Systems**: Network metrics
- **Security Tools**: Intrusion detection

### Network Architecture Flow
```
[Internet] --> [CDN/WAF] --> [Load Balancer]
                                    |
                              [Public Subnet]
                                    |
                        [NAT Gateway] <-- [Private Subnet]
                                              |
                              +---------------+---------------+
                              |               |               |
                         [App Tier]      [Data Tier]    [Management]
                              |               |               |
                              +-------[VPN]---+-------[VPN]---+
                                        |
                                  [Corporate Network]
```

## Best Practices Checklist

- [ ] Network segmentation implemented (public/private/data tiers)
- [ ] Security groups follow least privilege principle
- [ ] VPC flow logs enabled and retained
- [ ] DNS failover configured for critical services
- [ ] NAT gateways distributed across availability zones
- [ ] VPN connections have redundant tunnels
- [ ] Network ACLs provide additional security layer
- [ ] Egress traffic monitored and filtered
- [ ] Private DNS zones for internal services
- [ ] Network changes tracked in version control
