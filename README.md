# n8n-nodes-wavelength

This is an n8n community node for [Wavelength](https://wavelengthflow.com). Wavelength turns call notes, meeting transcripts, and plain descriptions into editable process flow diagrams.

The node calls the [Wavelength REST API](https://wavelengthflow.com/developers.html).

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Compatibility](#compatibility) · [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The package name is `n8n-nodes-wavelength`.

## Operations

### Flow

| Operation          | What it does                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------- |
| Generate From Text | Turns a transcript, call notes, or a description into a new flow with AI                  |
| Create             | Creates a flow from your own nodes and edges (JSON)                                       |
| Get                | Gets one flow with its nodes and edges                                                    |
| Get Many           | Lists your flows. Use Return All, or set a Limit. Filter by team or by update time        |
| Search             | Finds flows by text in titles, steps, and transcripts                                     |
| Update             | Changes the title, transcript, nodes, or edges                                            |
| Edit With AI       | Changes a flow from a plain instruction, such as "add a manager approval step"            |
| Add Notes          | Adds new notes or transcript text to a flow with AI                                       |
| Duplicate          | Copies a flow                                                                             |
| Export             | Exports a flow as Mermaid, SVG, draw.io, or JSON                                          |
| Review             | Finds dead ends, missing branches, missing owners, and guessed links                      |
| Summarize          | Writes an overview, recaps (customer, handoff, leadership), or a list of systems in scope |
| Publish            | Turns on the public read-only link                                                        |
| Unpublish          | Turns off the public link                                                                 |
| Delete             | Deletes a flow                                                                            |

### Audit Event

| Operation | What it does                                                                              |
| --------- | ----------------------------------------------------------------------------------------- |
| Get Many  | Gets organization audit events. Needs an organization API key with the `audit:read` scope |

### Account

| Operation | What it does                                                   |
| --------- | -------------------------------------------------------------- |
| Get       | Gets the account or organization and the scopes of the API key |

The node can also be used as a tool by the n8n AI Agent.

### Example workflow

1. A meeting tool (for example Zoom, Fireflies, or Gong) sends a transcript to n8n.
2. **Wavelength: Generate From Text** turns the transcript into a flow.
3. **Wavelength: Summarize** writes a customer recap.
4. A Gmail or Slack node sends the recap with the flow link (`open_url`).

## Credentials

The node uses a Wavelength API key.

1. Sign in to [Wavelength](https://wavelengthflow.com/app). API keys need a paid plan or an organization seat.
2. Open **Settings**, then **API keys**. Pick the scopes (`flows:read`, `flows:write`) and select **Create key**. Copy the key. Wavelength shows it only one time.
3. In n8n, create a new **Wavelength API** credential and paste the key.

A personal key acts as you, on every flow you can open. An organization key (made by an owner or admin in **Organization settings**, **Security**) acts on the organization's flows only and can also read the audit log.

## Compatibility

Requires n8n 1.0 or later. The node has no run-time dependencies.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Wavelength REST API documentation](https://wavelengthflow.com/developers.html)
- [Wavelength](https://wavelengthflow.com)
- [Wavelength privacy policy](https://wavelengthflow.com/privacy.html)
- Support: support@wavelengthflow.com
