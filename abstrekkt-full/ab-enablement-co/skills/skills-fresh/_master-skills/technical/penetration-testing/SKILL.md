---
name: penetration-testing
description: Comprehensive penetration testing methodology and execution guidance. Use when planning security assessments, conducting vulnerability exploitation, performing red team exercises, evaluating security controls, or reporting penetration test findings.
---

# Penetration Testing

## Overview

Penetration testing is the authorized simulation of cyber attacks against systems, networks, and applications to identify security vulnerabilities before malicious actors can exploit them. It goes beyond automated vulnerability scanning by attempting actual exploitation to demonstrate real-world risk.

Professional penetration testing follows structured methodologies that ensure comprehensive coverage while maintaining safety boundaries. It encompasses reconnaissance, vulnerability identification, exploitation, post-exploitation analysis, and detailed reporting with remediation guidance.

Modern penetration testing addresses diverse attack surfaces including external networks, internal infrastructure, web applications, mobile apps, APIs, cloud environments, and social engineering vectors. The practice requires both technical expertise and ethical responsibility to protect client systems while identifying genuine security gaps.

### Why This Matters

- **Real Risk Validation**: Prove vulnerabilities are exploitable, not theoretical
- **Compliance Requirements**: Meet PCI-DSS, HIPAA, SOC2 testing mandates
- **Security Investment Justification**: Demonstrate ROI for security controls
- **Incident Preparedness**: Test detection and response capabilities
- **Third-Party Assurance**: Validate vendor and partner security
- **Continuous Improvement**: Drive security program maturation

## When to Use

### Primary Triggers

- Pre-deployment security validation
- Annual compliance assessments
- Post-major-change security verification
- Merger/acquisition due diligence
- Incident response improvement
- New application security testing

### Specific Use Cases

1. **External Network Testing**: Internet-facing infrastructure assessment
2. **Internal Network Testing**: Insider threat and lateral movement simulation
3. **Web Application Testing**: OWASP Top 10 and business logic flaws
4. **API Security Testing**: REST/GraphQL/SOAP vulnerability assessment
5. **Cloud Security Testing**: AWS/Azure/GCP configuration and access testing
6. **Social Engineering**: Phishing, vishing, physical security testing

## Core Processes

### Process 1: Pre-Engagement Planning

Establish scope, rules of engagement, and authorization.

```yaml
# pentest-engagement-checklist.yaml
pre_engagement:
  authorization:
    - item: "Signed statement of work"
      status: required
      owner: legal_team

    - item: "Rules of engagement document"
      status: required
      owner: security_team

    - item: "Written authorization from system owners"
      status: required
      owner: client_contact

    - item: "Emergency contact list"
      status: required
      owner: both_parties

    - item: "Get-out-of-jail letter"
      status: required
      owner: client_executive
      description: "Authorization letter for physical/social engineering tests"

  scope_definition:
    in_scope:
      networks:
        - "192.168.1.0/24 - Corporate LAN"
        - "10.0.0.0/16 - Cloud VPC"
      domains:
        - "*.example.com"
        - "api.example.com"
      applications:
        - "Customer portal"
        - "Employee self-service"
        - "Mobile applications"
      testing_types:
        - "External network"
        - "Web application"
        - "API"
        - "Authenticated testing"

    out_of_scope:
      - "Production database direct access"
      - "Denial of service attacks"
      - "Third-party hosted services"
      - "Physical security (unless specified)"
      - "Social engineering (unless specified)"

  rules_of_engagement:
    testing_window:
      start: "2024-02-01 00:00 UTC"
      end: "2024-02-14 23:59 UTC"
      business_hours_only: false

    restrictions:
      - "No destructive testing"
      - "No data exfiltration of real customer data"
      - "Stop testing if system instability detected"
      - "Notify client of critical findings within 24 hours"

    communication:
      primary_contact: "security@client.com"
      emergency_contact: "+1-555-0123"
      status_updates: "Daily email summary"
      critical_finding_threshold: "CVSS >= 9.0"
```

### Process 2: Reconnaissance Methodology

Systematic information gathering about target environment.

```yaml
# reconnaissance-methodology.yaml
reconnaissance:
  passive_recon:
    description: "Information gathering without direct target interaction"

    osint_sources:
      dns_enumeration:
        tools:
          - "dig"
          - "nslookup"
          - "dnsenum"
        commands:
          zone_transfer: "dig axfr @ns1.target.com target.com"
          subdomain_enum: "subfinder -d target.com -o subdomains.txt"

      certificate_transparency:
        tools:
          - "crt.sh"
          - "certspotter"
        purpose: "Discover subdomains from SSL certificates"

      search_engines:
        google_dorks:
          - 'site:target.com filetype:pdf'
          - 'site:target.com inurl:admin'
          - 'site:target.com "index of"'
          - '"target.com" password'
        shodan_queries:
          - 'org:"Target Company"'
          - 'ssl.cert.subject.cn:"target.com"'

      social_media:
        linkedin: "Employee enumeration, technology stack"
        github: "Code repositories, leaked credentials"
        pastebin: "Data leaks, credentials"

      whois_data:
        information:
          - "Registrant contact"
          - "DNS servers"
          - "Registration dates"
          - "Associated domains"

  active_recon:
    description: "Direct interaction with target systems"

    network_scanning:
      host_discovery:
        command: "nmap -sn 192.168.1.0/24"
        purpose: "Identify live hosts"

      port_scanning:
        tcp_scan: "nmap -sS -p- -T4 target.com"
        udp_scan: "nmap -sU --top-ports 1000 target.com"
        version_detection: "nmap -sV -sC -p 22,80,443 target.com"

      service_enumeration:
        http: "nikto -h http://target.com"
        smb: "enum4linux -a target.com"
        ldap: "ldapsearch -x -h target.com -b 'dc=target,dc=com'"

    web_reconnaissance:
      technology_fingerprinting:
        tools: ["wappalyzer", "whatweb", "builtwith"]
        command: "whatweb -v target.com"

      directory_bruteforce:
        tools: ["gobuster", "dirb", "ffuf"]
        command: "gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt"

      parameter_discovery:
        tools: ["arjun", "paramspider"]
        command: "arjun -u http://target.com/api/endpoint"
```

### Process 3: Exploitation Framework

```yaml
# exploitation-methodology.yaml
exploitation:
  vulnerability_categories:
    network_vulnerabilities:
      - type: "Unpatched services"
        example: "EternalBlue (MS17-010)"
        tool: "metasploit"
        command: "use exploit/windows/smb/ms17_010_eternalblue"

      - type: "Default credentials"
        example: "SSH with admin:admin"
        tool: "hydra"
        command: "hydra -l admin -P passwords.txt ssh://target.com"

      - type: "Misconfigured services"
        example: "Anonymous FTP access"
        verification: "ftp target.com -> anonymous login"

    web_application_vulnerabilities:
      sql_injection:
        detection: "' OR '1'='1' -- "
        tool: "sqlmap"
        command: "sqlmap -u 'http://target.com/page?id=1' --dbs"

      xss:
        detection: "<script>alert('XSS')</script>"
        tool: "xsstrike"
        command: "python xsstrike.py -u 'http://target.com/search?q=test'"

      authentication_bypass:
        techniques:
          - "Parameter manipulation"
          - "JWT token tampering"
          - "Session fixation"
          - "Password reset flaws"

      insecure_deserialization:
        tools: ["ysoserial", "Java Deserialization Scanner"]
        indicators:
          - "Base64 encoded cookies"
          - "Serialized object parameters"

    api_vulnerabilities:
      broken_authentication:
        tests:
          - "Token reuse across users"
          - "Weak token entropy"
          - "Missing rate limiting"

      broken_authorization:
        tests:
          - "IDOR via ID manipulation"
          - "Horizontal privilege escalation"
          - "Vertical privilege escalation"

      injection:
        tests:
          - "NoSQL injection"
          - "GraphQL injection"
          - "Command injection"

  post_exploitation:
    privilege_escalation:
      windows:
        tools: ["WinPEAS", "PowerUp", "Sherlock"]
        command: ".\winPEASany.exe"
        techniques:
          - "Unquoted service paths"
          - "DLL hijacking"
          - "Token impersonation"
          - "Kernel exploits"

      linux:
        tools: ["LinPEAS", "LinEnum", "linux-exploit-suggester"]
        command: "./linpeas.sh"
        techniques:
          - "SUID binaries"
          - "Sudo misconfigurations"
          - "Cron job exploitation"
          - "Kernel exploits"

    lateral_movement:
      techniques:
        - name: "Pass the Hash"
          tool: "mimikatz"
          command: "sekurlsa::pth /user:admin /ntlm:hash /domain:corp"

        - name: "Pass the Ticket"
          tool: "Rubeus"
          command: "Rubeus.exe ptt /ticket:base64ticket"

        - name: "SSH Key Reuse"
          method: "Use discovered SSH keys for other hosts"

        - name: "Token Impersonation"
          tool: "Incognito"
          command: "incognito.exe list_tokens -u"

    persistence:
      techniques:
        - "Scheduled tasks"
        - "Registry run keys"
        - "WMI event subscriptions"
        - "SSH authorized_keys"
        - "Web shells"
      note: "Document but do not implement without explicit authorization"
```

### Process 4: Reporting Framework

```yaml
# pentest-report-structure.yaml
report_structure:
  executive_summary:
    sections:
      - "Engagement overview"
      - "Key findings summary"
      - "Risk rating distribution"
      - "Top recommendations"
    audience: "C-level, non-technical stakeholders"
    length: "1-2 pages"

  technical_summary:
    sections:
      - "Scope and methodology"
      - "Testing timeline"
      - "Tools used"
      - "Findings by category"
      - "Attack narrative"
    audience: "Security team, IT management"
    length: "3-5 pages"

  detailed_findings:
    finding_template:
      title: "Descriptive vulnerability name"
      severity: "Critical/High/Medium/Low/Informational"
      cvss_score: "X.X"
      cvss_vector: "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"

      description: |
        Detailed explanation of the vulnerability,
        including technical context.

      affected_assets:
        - "192.168.1.10 - Web Server"
        - "https://app.target.com/api/users"

      proof_of_concept:
        steps:
          - "Navigate to target URL"
          - "Inject payload: ' OR '1'='1' --"
          - "Observe database content in response"
        evidence:
          - type: "screenshot"
            filename: "sqli-poc-001.png"
          - type: "request"
            content: "HTTP request/response"

      impact: |
        Attacker can extract sensitive data from database,
        potentially including user credentials and PII.

      remediation:
        short_term: "Implement input validation"
        long_term: "Use parameterized queries"
        references:
          - "OWASP SQL Injection Prevention Cheat Sheet"
          - "CWE-89: SQL Injection"

  appendices:
    - "Complete tool output logs"
    - "Full list of discovered hosts/services"
    - "Detailed CVSS calculations"
    - "Methodology references"
    - "Remediation priority matrix"
```

## Tools & Templates

### Testing Checklist by Category

```markdown
# Penetration Testing Checklist

## Network Testing
- [ ] Host discovery completed
- [ ] Port scanning (TCP full, UDP top 1000)
- [ ] Service version detection
- [ ] Vulnerability scanning
- [ ] Default credential testing
- [ ] Network segmentation validation
- [ ] Wireless network testing (if in scope)

## Web Application Testing
- [ ] Technology fingerprinting
- [ ] Directory/file enumeration
- [ ] Authentication testing
- [ ] Session management testing
- [ ] Input validation testing
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] File upload testing
- [ ] Business logic testing

## API Testing
- [ ] API endpoint enumeration
- [ ] Authentication mechanism testing
- [ ] Authorization testing (IDOR, privilege escalation)
- [ ] Input validation testing
- [ ] Rate limiting testing
- [ ] API versioning security

## Cloud Testing
- [ ] IAM policy review
- [ ] Storage bucket permissions
- [ ] Network security groups
- [ ] Secrets management
- [ ] Logging configuration
- [ ] Instance metadata access

## Post-Exploitation (if authorized)
- [ ] Privilege escalation
- [ ] Credential harvesting
- [ ] Lateral movement
- [ ] Data access validation
- [ ] Persistence mechanism identification
```

### CVSS Scoring Reference

```yaml
# cvss-scoring-guide.yaml
cvss_v3_1:
  base_metrics:
    attack_vector:
      network: 0.85  # Remotely exploitable
      adjacent: 0.62  # Adjacent network
      local: 0.55    # Local access required
      physical: 0.20 # Physical access required

    attack_complexity:
      low: 0.77      # No special conditions
      high: 0.44     # Requires special conditions

    privileges_required:
      none: 0.85     # No authentication
      low: 0.62      # Low-level user
      high: 0.27     # Admin-level user

    user_interaction:
      none: 0.85     # No user action
      required: 0.62 # User must click/act

    scope:
      unchanged: "Impact limited to vulnerable component"
      changed: "Impact extends beyond vulnerable component"

    impact:
      confidentiality: [none, low, high]
      integrity: [none, low, high]
      availability: [none, low, high]

  severity_ratings:
    critical: "9.0 - 10.0"
    high: "7.0 - 8.9"
    medium: "4.0 - 6.9"
    low: "0.1 - 3.9"
    none: "0.0"
```

## Metrics & KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Critical Findings per Test | Trending down | Count per engagement |
| Mean Time to Remediate | <30 days critical | Time from report to fix |
| Scope Coverage | 100% | Assets tested vs in-scope |
| False Positive Rate | <5% | Invalid findings reported |
| Retest Pass Rate | >90% | Findings fixed on retest |
| Report Delivery Time | <5 business days | Test end to report delivery |
| Finding Recurrence | <10% | Same finding in subsequent tests |

## Common Pitfalls

1. **Scope Creep**: Testing systems without authorization
   - *Solution*: Written scope definition with explicit boundaries

2. **Production Impact**: Causing outages during testing
   - *Solution*: Careful testing, client communication, backup procedures

3. **Incomplete Coverage**: Missing attack vectors
   - *Solution*: Structured methodology and checklists

4. **Over-Reliance on Tools**: Missing manual testing findings
   - *Solution*: Balance automated and manual testing

5. **Poor Documentation**: Inability to reproduce findings
   - *Solution*: Detailed notes, screenshots, and request/response captures

6. **Remediation Gaps**: Findings not actionable
   - *Solution*: Specific, prioritized remediation guidance

## Integration Points

- **Vulnerability Management**: Finding import and tracking
- **SIEM Systems**: Attack detection validation
- **Ticketing Systems**: Remediation tracking
- **GRC Platforms**: Compliance evidence
- **CI/CD Pipelines**: Automated security testing
- **Bug Bounty Programs**: Coordinated disclosure
- **Security Training**: Real-world examples for awareness
