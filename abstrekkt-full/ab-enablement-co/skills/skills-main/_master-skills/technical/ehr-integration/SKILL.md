---
name: ehr-integration
description: Comprehensive guidance for Electronic Health Record (EHR) integration including interoperability standards (HL7, FHIR, CDA), system interfaces, health information exchange (HIE), API development, and data mapping. Use when building, debugging, or optimizing technical implementations.
---

# EHR Integration Skill

> Health system integration, interoperability, HL7/FHIR standards, and data exchange

## Description

This skill provides comprehensive guidance for Electronic Health Record (EHR) integration including interoperability standards (HL7, FHIR, CDA), system interfaces, health information exchange (HIE), API development, data mapping, and integration architecture. It covers technical implementation, testing, and ongoing management of healthcare data exchange.

## Activation Triggers

- User mentions "EHR integration", "EMR interface", "health data exchange"
- User asks about HL7, FHIR, or healthcare interoperability
- User needs help with health information exchange (HIE)
- User discusses ADT, ORU, or other HL7 message types
- User asks about SMART on FHIR or healthcare APIs
- User mentions CCD, CCDA, or clinical documents
- User needs interface engine or integration architecture help

## Instructions

### Core Workflow

1. **Requirements Analysis**
   - Identify integration use cases
   - Determine data exchange requirements
   - Map source and destination systems
   - Define message triggers and frequency
   - Document security and compliance needs

2. **Technical Design**
   - Select integration standards and protocols
   - Design message mappings
   - Define error handling procedures
   - Plan for testing and validation
   - Document integration architecture

3. **Implementation and Testing**
   - Configure interface engine
   - Develop message transformations
   - Test with sample data
   - Validate in staging environment
   - Deploy to production

### Integration Standards Framework

```yaml
hl7_v2:
  description: "Traditional healthcare messaging standard"
  structure:
    - Segments (MSH, PID, PV1, OBR, OBX, etc.)
    - Fields separated by |
    - Components separated by ^
    - Subcomponents separated by &

  common_message_types:
    ADT: "Admit/Discharge/Transfer"
    ORM: "Order Message"
    ORU: "Observation Result"
    SIU: "Scheduling Information"
    MDM: "Medical Document Management"
    DFT: "Detail Financial Transaction"
    RDE: "Pharmacy/Treatment Encoded Order"
    MFN: "Master File Notification"

  trigger_events:
    A01: "Admit/Visit Notification"
    A02: "Transfer"
    A03: "Discharge"
    A04: "Register Outpatient"
    A08: "Update Patient Information"
    A28: "Add Person Information"
    A31: "Update Person Information"
```

### HL7 FHIR Framework

```yaml
fhir:
  description: "Fast Healthcare Interoperability Resources"
  version: "R4 (current), R5 (emerging)"

  core_resources:
    administrative:
      - Patient
      - Practitioner
      - Organization
      - Location
      - Encounter
      - Schedule
      - Appointment

    clinical:
      - Condition
      - Observation
      - DiagnosticReport
      - Procedure
      - MedicationRequest
      - Immunization
      - AllergyIntolerance
      - CarePlan

    financial:
      - Claim
      - ExplanationOfBenefit
      - Coverage

  interaction_types:
    - read (GET /Patient/123)
    - vread (GET /Patient/123/_history/1)
    - update (PUT /Patient/123)
    - patch (PATCH /Patient/123)
    - delete (DELETE /Patient/123)
    - create (POST /Patient)
    - search (GET /Patient?name=Smith)
    - batch (POST /)
    - transaction (POST /)

  search_parameters:
    - _id
    - _lastUpdated
    - identifier
    - name
    - birthdate
    - gender
    - address
```

### SMART on FHIR Integration

```yaml
smart_on_fhir:
  description: "Authorization framework for FHIR apps"

  launch_types:
    ehr_launch:
      - User launches from EHR
      - EHR provides context (patient, encounter)
      - App receives launch token
    standalone_launch:
      - User launches app directly
      - App authenticates user
      - User selects patient context

  authorization_flow:
    - App discovers endpoints from .well-known/smart-configuration
    - App redirects to authorize endpoint
    - User authenticates and grants access
    - Authorization server returns code
    - App exchanges code for access token
    - App uses token to access FHIR resources

  scopes:
    patient: "patient/*.read, patient/Observation.read"
    user: "user/*.read, user/Patient.write"
    launch: "launch, launch/patient"
    openid: "openid, profile, fhirUser"
```

### Clinical Document Architecture

```yaml
cda_ccda:
  description: "Clinical Document Architecture and Consolidated CDA"

  document_types:
    - Continuity of Care Document (CCD)
    - Discharge Summary
    - Progress Notes
    - History and Physical
    - Operative Notes
    - Consultation Notes
    - Procedure Notes

  ccda_sections:
    - Allergies and Intolerances
    - Medications
    - Problem List
    - Procedures
    - Results
    - Vital Signs
    - Social History
    - Immunizations
    - Plan of Treatment
    - Encounters

  structure:
    header:
      - Document identification
      - Patient demographics
      - Author information
      - Custodian
      - Document relationships
    body:
      - Sections with human-readable narrative
      - Coded entries for machine processing
```

### Interface Engine Configuration

```yaml
interface_engine:
  components:
    - Channel management
    - Message routing
    - Data transformation
    - Error handling
    - Logging and monitoring

  common_engines:
    - Mirth Connect (NextGen)
    - Rhapsody
    - Cloverleaf
    - InterSystems HealthShare
    - Microsoft Azure Health Data Services

  channel_design:
    source:
      - Connection type (TCP, HTTP, File, Database)
      - Protocol (MLLP, REST, SFTP)
      - Authentication
      - Message format

    filters:
      - Route by message type
      - Route by sending facility
      - Content-based routing

    transformations:
      - Segment mapping
      - Code translation
      - Data enrichment
      - Format conversion

    destination:
      - Target system connection
      - Delivery method
      - Acknowledgment handling
      - Retry logic
```

### Data Mapping Standards

```yaml
data_mapping:
  terminology_standards:
    snomed_ct: "Clinical terminology"
    loinc: "Lab observations"
    rxnorm: "Medications"
    icd_10: "Diagnoses"
    cpt_hcpcs: "Procedures"
    cvx: "Vaccines"

  mapping_process:
    - Identify source data elements
    - Map to destination fields
    - Apply code translations
    - Handle missing/null values
    - Validate transformations

  common_mappings:
    patient:
      source: "PID segment"
      fields:
        - PID.3 -> Patient.identifier
        - PID.5 -> Patient.name
        - PID.7 -> Patient.birthDate
        - PID.8 -> Patient.gender
        - PID.11 -> Patient.address
        - PID.13 -> Patient.telecom
```

### Health Information Exchange

```yaml
hie_integration:
  exchange_models:
    query_based:
      - On-demand data retrieval
      - Patient record lookup
      - IHE profiles (PDQ, PIX, XDS)

    push_based:
      - Event-driven notifications
      - ADT alerts
      - Care transitions

    consumer_mediated:
      - Patient-directed exchange
      - Personal health records
      - Blue Button

  ihe_profiles:
    PDQ: "Patient Demographics Query"
    PIX: "Patient Identifier Cross-referencing"
    XDS: "Cross-Enterprise Document Sharing"
    XCA: "Cross-Community Access"
    MHD: "Mobile access to Health Documents"
    QEDm: "Query for Existing Data mobile"

  commonwell:
    - National health data network
    - Patient matching
    - Record locator service
    - Document query and retrieve

  carequality:
    - Framework for interoperability
    - Common trust agreement
    - Query-based exchange
    - Push notifications
```

### API Security and Authentication

```yaml
api_security:
  oauth2:
    grant_types:
      - Authorization Code
      - Client Credentials
      - Refresh Token
    token_types:
      - Access Token (short-lived)
      - Refresh Token (long-lived)
      - ID Token (OIDC)

  mutual_tls:
    - Client certificate authentication
    - Server certificate validation
    - Certificate management

  api_keys:
    - Application identification
    - Rate limiting
    - Usage tracking

  security_headers:
    - Authorization: Bearer <token>
    - X-API-Key: <key>
    - Content-Type: application/fhir+json
```

### Testing and Validation

```yaml
testing:
  unit_testing:
    - Individual message parsing
    - Field-level transformations
    - Code translation tables

  integration_testing:
    - End-to-end message flow
    - Error handling scenarios
    - Edge cases and exceptions

  validation_tools:
    - HL7 message validators
    - FHIR validators (Inferno, Touchstone)
    - CCDA validators (MDHT, Validator.app)

  test_data:
    - Synthetic patient data
    - Edge case scenarios
    - Negative test cases
    - Volume testing
```

### Monitoring and Operations

```yaml
monitoring:
  metrics:
    - Message volume
    - Processing time
    - Error rates
    - Queue depth
    - System availability

  alerting:
    - Interface down
    - High error rate
    - Queue backup
    - Processing delays

  logging:
    - Message audit trail
    - Error logs
    - Performance metrics
    - Security events
```

## Output Format

### Integration Specification Document
```markdown
# Integration Specification: [Interface Name]

## Overview
- Source System: [System Name]
- Destination System: [System Name]
- Message Type: [HL7/FHIR/Other]
- Direction: [Inbound/Outbound/Bidirectional]

## Use Cases
| ID | Description | Trigger | Frequency |
|----|-------------|---------|-----------|
| UC-01 | [Description] | [Event] | [Freq] |

## Technical Specifications

### Connection Details
- Protocol: [MLLP/REST/SFTP]
- Host: [hostname]
- Port: [port]
- Authentication: [method]

### Message Mapping
| Source Field | Target Field | Transformation |
|--------------|--------------|----------------|
| PID.3 | patient_id | [Rule] |

### Error Handling
| Error Code | Description | Action |
|------------|-------------|--------|
| [Code] | [Description] | [Action] |

## Testing Plan
[Test scenarios and acceptance criteria]
```

## Integration Points

- Epic, Cerner, Meditech, Allscripts, athenahealth
- Interface engines (Mirth, Rhapsody, Cloverleaf)
- Health information exchanges
- Clearinghouses
- Lab information systems
- Radiology systems
- Pharmacy systems
- Practice management systems

## Best Practices

1. **Standards First**: Use established standards (HL7, FHIR)
2. **Loose Coupling**: Design for flexibility and change
3. **Error Handling**: Plan for failures and retries
4. **Monitoring**: Implement comprehensive monitoring
5. **Documentation**: Maintain interface specifications
6. **Testing**: Thorough testing before go-live
7. **Security**: Encrypt data in transit and at rest
8. **Version Control**: Track interface changes

## Common Pitfalls

- Ignoring edge cases in data mapping
- Insufficient error handling
- Poor monitoring and alerting
- Hardcoded values instead of configuration
- Inadequate testing environments
- Not planning for data quality issues
- Underestimating ongoing maintenance
- Ignoring HL7 version differences

## Version History

- 1.0.0: Initial EHR integration skill
- 1.0.1: Added SMART on FHIR section
- 1.0.2: Enhanced HIE integration guidance
