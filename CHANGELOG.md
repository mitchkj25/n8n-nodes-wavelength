# Changelog

## 0.2.0

- The node now calls the Wavelength REST API (`/v1`) directly. It no longer uses the MCP endpoint.
- New credential: **Wavelength API** (API key). It replaces the Wavelength OAuth2 API credential. Make a key in Wavelength Settings, then API keys.
- Resources and operations follow Wavelength objects: Flow, Audit Event, and Account.
- Flow: Get Many has Return All and Limit and pages through all results.
- New Flow operations: Create (from nodes and edges), Update, Unpublish. Rename is now part of Update.
- New Audit Event: Get Many (organization keys).

## 0.1.1

- Published from GitHub Actions with npm provenance.

## 0.1.0

- First release: Flow resource with 13 operations and a Wavelength OAuth2 (PKCE) credential.
