# n8n-nodes-wavelength

This is an n8n community node for [Wavelength](https://wavelengthflow.com). Wavelength turns call notes, meeting transcripts, and plain descriptions into editable process flow diagrams.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Compatibility](#compatibility) · [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package name is `n8n-nodes-wavelength`.

## Operations

Resource: **Flow**

| Operation | What it does |
| --- | --- |
| Create From Text | Turns a transcript, call notes, or a description into a new flow |
| Add to Flow | Adds new steps to a flow from text |
| Edit | Changes a flow from a plain instruction, such as "add a manager approval step" |
| Review | Finds missing branches, owners, and handoffs |
| Summarize | Writes a recap email, an SOW outline, or a list of systems in scope |
| Export | Exports a flow as Mermaid, SVG, draw.io, or JSON |
| Get | Gets one flow with its nodes and links |
| Get Many | Lists your flows |
| Search | Finds flows by text |
| Rename | Renames a flow |
| Duplicate | Copies a flow |
| Share | Turns on the public read-only link |
| Delete | Deletes a flow |

The node can also be used as a tool by the n8n AI Agent.

### Example workflow

1. A meeting tool (for example Zoom, Fireflies, or Gong) sends a transcript to n8n.
2. **Wavelength: Create From Text** turns the transcript into a flow.
3. **Wavelength: Summarize** writes a recap email.
4. A Gmail or Slack node sends the recap with the flow link.

## Credentials

1. Create a Wavelength account at [wavelengthflow.com/register](https://wavelengthflow.com/register). A free account works.
2. In n8n, create a new **Wavelength OAuth2 API** credential.
3. Click **Connect my account**. Sign in to Wavelength and approve access.

You do not need a client ID or a client secret. The credential uses OAuth 2.0 with PKCE. Each request acts only as the signed-in Wavelength user. To block all changes, turn on Read-only mode in Wavelength Settings, then AI connector.

## Compatibility

Requires n8n 1.0 or later. The node has no run-time dependencies.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Wavelength](https://wavelengthflow.com)
- [Wavelength privacy policy](https://wavelengthflow.com/privacy.html)
- Support: support@wavelengthflow.com
