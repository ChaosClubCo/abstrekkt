---
name: server-administration
description: name: server-administration description: Linux and Windows server management including provisioning, configuration, performance tuning, and maintenance operations. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Server Administration

---
name: server-administration
description: Linux and Windows server management including provisioning, configuration, performance tuning, and maintenance operations
version: 1.0.0
category: infrastructure
tags: [servers, linux, windows, sysadmin, infrastructure, operations]
related_skills: [container-orchestration, monitoring-alerting, network-configuration]
---

## Overview

Server Administration encompasses the complete lifecycle management of Linux and Windows servers in enterprise environments. This skill covers provisioning, configuration management, performance optimization, security hardening, and ongoing maintenance operations that keep infrastructure running reliably.

Modern server administration extends beyond traditional bare-metal management to include virtual machines, cloud instances, and hybrid environments. Effective server administration requires deep understanding of operating system internals, automation tools, and infrastructure-as-code practices.

### Key Principles

1. **Infrastructure as Code**: All server configurations should be version-controlled and reproducible
2. **Immutable Infrastructure**: Prefer replacing servers over modifying them in place
3. **Automation First**: Manual operations should be exceptions, not the rule
4. **Defense in Depth**: Layer security controls at every level
5. **Observability**: Every server should emit metrics, logs, and traces

## When to Use This Skill

### Appropriate Scenarios

- Provisioning new servers for applications or services
- Configuring operating system settings and packages
- Performance tuning for specific workloads
- Security hardening and compliance implementation
- Troubleshooting server issues and outages
- Capacity planning and scaling decisions
- Patch management and system updates
- User and access management

### When to Consider Alternatives

- **Container workloads**: Use container-orchestration skill instead
- **Managed services**: Consider cloud-native alternatives (RDS, Lambda)
- **Simple static hosting**: CDN or object storage may suffice
- **Development environments**: Local containers often more appropriate

## Core Processes

### 1. Server Provisioning

```bash
# Example: Automated server provisioning with cloud-init
#cloud-config
package_update: true
package_upgrade: true

packages:
  - nginx
  - fail2ban
  - unattended-upgrades
  - htop
  - tmux

users:
  - name: deploy
    groups: sudo
    shell: /bin/bash
    sudo: ['ALL=(ALL) NOPASSWD:ALL']
    ssh_authorized_keys:
      - ssh-rsa AAAAB3... deploy@company.com

write_files:
  - path: /etc/ssh/sshd_config.d/hardening.conf
    content: |
      PermitRootLogin no
      PasswordAuthentication no
      X11Forwarding no
      MaxAuthTries 3

runcmd:
  - systemctl enable fail2ban
  - systemctl start fail2ban
  - ufw allow 22/tcp
  - ufw allow 80/tcp
  - ufw allow 443/tcp
  - ufw --force enable
```

### 2. Configuration Management

```yaml
# Ansible playbook for server configuration
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    nginx_worker_processes: auto
    nginx_worker_connections: 4096

  tasks:
    - name: Install required packages
      apt:
        name:
          - nginx
          - certbot
          - python3-certbot-nginx
        state: present
        update_cache: yes

    - name: Configure nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        validate: nginx -t -c %s
      notify: Reload nginx

    - name: Set system limits
      pam_limits:
        domain: '*'
        limit_type: '-'
        limit_item: nofile
        value: '65536'

    - name: Configure sysctl parameters
      sysctl:
        name: "{{ item.key }}"
        value: "{{ item.value }}"
        sysctl_set: yes
        reload: yes
      loop:
        - { key: 'net.core.somaxconn', value: '65535' }
        - { key: 'net.ipv4.tcp_max_syn_backlog', value: '65535' }
        - { key: 'vm.swappiness', value: '10' }

  handlers:
    - name: Reload nginx
      systemd:
        name: nginx
        state: reloaded
```

### 3. Performance Tuning

```bash
#!/bin/bash
# Linux performance tuning script

# CPU Governor - set to performance for consistent behavior
for cpu in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do
    echo "performance" > "$cpu" 2>/dev/null
done

# Disable transparent huge pages for database workloads
echo never > /sys/kernel/mm/transparent_hugepage/enabled
echo never > /sys/kernel/mm/transparent_hugepage/defrag

# Network tuning
cat >> /etc/sysctl.d/99-performance.conf << 'EOF'
# Increase network buffers
net.core.rmem_max = 134217728
net.core.wmem_max = 134217728
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864

# Enable TCP BBR congestion control
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

# Reduce TIME_WAIT connections
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_tw_reuse = 1

# File descriptor limits
fs.file-max = 2097152
fs.nr_open = 2097152
EOF

sysctl -p /etc/sysctl.d/99-performance.conf
```

### 4. Security Hardening

```bash
#!/bin/bash
# Server security hardening checklist

# 1. SSH Hardening
cat > /etc/ssh/sshd_config.d/hardening.conf << 'EOF'
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
MaxAuthTries 3
MaxSessions 10
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 60
EOF

# 2. Install and configure fail2ban
apt install -y fail2ban
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

# 3. Configure automatic security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# 4. Set up audit logging
apt install -y auditd
systemctl enable auditd
cat >> /etc/audit/rules.d/audit.rules << 'EOF'
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /var/log/auth.log -p wa -k auth_log
EOF

# 5. Remove unnecessary packages
apt purge -y telnet rsh-client rsh-redone-client

echo "Security hardening complete"
```

### 5. Patch Management

```yaml
# Ansible playbook for coordinated patching
---
- name: Rolling server patches
  hosts: all
  serial: "25%"  # Patch 25% of servers at a time
  max_fail_percentage: 10

  pre_tasks:
    - name: Notify monitoring of maintenance
      uri:
        url: "{{ monitoring_api }}/maintenance"
        method: POST
        body_format: json
        body:
          host: "{{ inventory_hostname }}"
          duration: 1800

    - name: Remove from load balancer
      uri:
        url: "{{ lb_api }}/pools/{{ pool_id }}/members/{{ inventory_hostname }}"
        method: DELETE
      when: lb_managed | default(true)

  tasks:
    - name: Update package cache
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Apply security updates
      apt:
        upgrade: safe
        autoremove: yes
        autoclean: yes
      register: updates

    - name: Check if reboot required
      stat:
        path: /var/run/reboot-required
      register: reboot_required

    - name: Reboot if required
      reboot:
        reboot_timeout: 600
        msg: "Rebooting for kernel updates"
      when: reboot_required.stat.exists

  post_tasks:
    - name: Verify services running
      service_facts:
      register: services

    - name: Add back to load balancer
      uri:
        url: "{{ lb_api }}/pools/{{ pool_id }}/members"
        method: POST
        body_format: json
        body:
          host: "{{ inventory_hostname }}"
      when: lb_managed | default(true)

    - name: End maintenance window
      uri:
        url: "{{ monitoring_api }}/maintenance/{{ inventory_hostname }}"
        method: DELETE
```

## Tools and Technologies

### Linux Administration
| Tool | Purpose | Use Case |
|------|---------|----------|
| systemd | Service management | Managing application services |
| journalctl | Log viewing | Troubleshooting and debugging |
| htop/top | Process monitoring | Resource utilization analysis |
| iotop | I/O monitoring | Disk performance analysis |
| strace | System call tracing | Deep debugging |
| lsof | Open file listing | Resource tracking |

### Windows Administration
| Tool | Purpose | Use Case |
|------|---------|----------|
| PowerShell | Automation | Scripting and configuration |
| Server Manager | GUI management | Quick administrative tasks |
| Event Viewer | Log analysis | Windows event investigation |
| Performance Monitor | Metrics | Resource monitoring |
| Group Policy | Configuration | Centralized policy management |

### Configuration Management
| Tool | Strengths | Best For |
|------|-----------|----------|
| Ansible | Agentless, simple | Mixed environments |
| Puppet | Enterprise features | Large-scale deployments |
| Chef | Ruby-based, flexible | Complex configurations |
| Salt | Fast, scalable | Real-time operations |

## Metrics and Monitoring

### Key Performance Indicators

```yaml
# Prometheus recording rules for server metrics
groups:
  - name: server_health
    rules:
      - record: server:cpu_usage:percent
        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

      - record: server:memory_usage:percent
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

      - record: server:disk_usage:percent
        expr: 100 - ((node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100)

      - record: server:load_average:ratio
        expr: node_load5 / count without (cpu) (node_cpu_seconds_total{mode="idle"})

  - name: server_alerts
    rules:
      - alert: HighCPUUsage
        expr: server:cpu_usage:percent > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: server:disk_usage:percent > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Disk space low on {{ $labels.instance }}"
```

### Health Check Script

```bash
#!/bin/bash
# Server health check script

check_cpu() {
    local usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo "CPU Usage: ${usage}%"
    [ $(echo "$usage > 80" | bc) -eq 1 ] && return 1
    return 0
}

check_memory() {
    local usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    echo "Memory Usage: ${usage}%"
    [ $(echo "$usage > 85" | bc) -eq 1 ] && return 1
    return 0
}

check_disk() {
    local usage=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
    echo "Disk Usage: ${usage}%"
    [ "$usage" -gt 80 ] && return 1
    return 0
}

check_services() {
    local failed=$(systemctl --failed --no-legend | wc -l)
    echo "Failed Services: $failed"
    [ "$failed" -gt 0 ] && return 1
    return 0
}

# Run all checks
exit_code=0
check_cpu || exit_code=1
check_memory || exit_code=1
check_disk || exit_code=1
check_services || exit_code=1

exit $exit_code
```

## Common Pitfalls

### 1. Configuration Drift
**Problem**: Servers diverge from intended configuration over time
**Solution**: Use configuration management tools and regular audits

### 2. Inadequate Backup Verification
**Problem**: Backups exist but are not tested for restorability
**Solution**: Regular restore testing and automated verification

### 3. Ignoring Security Updates
**Problem**: Delaying patches creates vulnerability windows
**Solution**: Automated patching with staged rollouts

### 4. Hardcoded Configurations
**Problem**: Environment-specific values embedded in scripts
**Solution**: Use environment variables and configuration management

### 5. Insufficient Monitoring
**Problem**: Issues discovered only when users report problems
**Solution**: Comprehensive monitoring with proactive alerting

## Integration Points

### Upstream Dependencies
- **Cloud Providers**: AWS EC2, Azure VMs, GCP Compute Engine
- **Virtualization**: VMware, Proxmox, KVM
- **Network Infrastructure**: DNS, load balancers, firewalls
- **Identity Providers**: LDAP, Active Directory, SSO systems

### Downstream Consumers
- **Applications**: Web servers, databases, microservices
- **Container Platforms**: Docker hosts, Kubernetes nodes
- **Monitoring Systems**: Prometheus, Datadog, CloudWatch
- **CI/CD Pipelines**: Build agents, deployment targets

### Communication Patterns
```
[Terraform/Pulumi] --> [Cloud API] --> [Server Provisioning]
                                              |
                                              v
[Ansible/Puppet] --> [Configuration Management] --> [Running Server]
                                                          |
                                                          v
                           [Prometheus/Datadog] <-- [Metrics/Logs]
```

## Best Practices Checklist

- [ ] All servers provisioned via infrastructure as code
- [ ] Configuration management applied automatically
- [ ] Security hardening baseline implemented
- [ ] Automated patching with staged rollouts
- [ ] Comprehensive monitoring and alerting
- [ ] Regular backup verification
- [ ] SSH key-based authentication only
- [ ] Audit logging enabled
- [ ] Firewall rules documented and minimal
- [ ] Documentation current and accessible
