# NestJS Starter

## API Contract Workflow

This repository uses an AI-first API documentation flow.

1. The canonical API contract lives in [openapi/openapi.yaml](openapi/openapi.yaml).
2. Human-friendly API docs are served with Scalar at `/docs`.
3. The raw OpenAPI file is served at `/openapi/openapi.yaml`.
4. Bruno is optional and should import or sync from the OpenAPI file instead of becoming a second source of truth.

## Commands

1. `npm run start:dev` starts the app and serves Scalar at `/docs`.
2. `npm run openapi:lint` validates [openapi/openapi.yaml](openapi/openapi.yaml) with Spectral.

## AI Guidance

1. AI agents should treat [openapi/openapi.yaml](openapi/openapi.yaml) as the primary API contract artifact.
2. AI agents should not generate Bruno collections or separate documentation artifacts by default.
3. If Bruno is used, it should consume the OpenAPI file instead of replacing it.
