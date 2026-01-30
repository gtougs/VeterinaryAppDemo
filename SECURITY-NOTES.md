# VetCare OS Secure Backend Approach (draft)

- **PII/PHI handling**: Keep owner/pet identifiers pseudonymized on the client. Use opaque patient IDs; avoid names in telemetry. Encrypt at rest and enforce TLS everywhere.
- **Image uploads (fecal/stool photos)**:
  - Client requests a short-lived signed PUT URL (S3/GCS) with content-type and size restrictions.
  - Client uploads directly to storage; no image bytes transit your app servers.
  - Store only the returned object key + checksum; redact after triage if not needed.
- **AI calls**:
  - Route through a backend proxy that strips identifiers and replaces them with tokens (e.g., PATIENT_123).
  - Attach safety prompts and max-tokens; log prompts/responses with hashed IDs for audit.
  - For on-device privacy, consider small vision model locally for coarse triage; escalate to cloud only with consent.
- **Audit & consent**:
  - Record who viewed/generated AI guidance, with timestamps.
  - Explicit consent toggle before sending media to external AI.
- **Least privilege**:
  - Use separate IAM roles for signed URL generation vs. data-plane read.
  - Rotate keys; set object lifecycle (e.g., auto-delete in 30–90 days).
- **Monitoring**:
  - Antivirus/malware scan on object create.
  - Anomaly alerts for excessive uploads per patient.
