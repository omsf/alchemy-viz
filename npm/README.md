# alchemy-viz

Browser visualizations for [OpenFE](https://docs.openfree.energy/en/latest/index.html)
and [gufe](https://github.com/OpenFreeEnergy/gufe) objects: ligands, proteins,
atom mappings, ligand networks and alchemical campaigns.

This is the browser half. The Python half, which turns a live gufe object into
the JSON payload these elements draw, is on PyPI as
[`alchemy-viz`](https://pypi.org/project/alchemy-viz/) and is what most people
want. Install this one when the page is yours: a dashboard, a JupyterLab
extension, a docs site.

## Install

```bash
npm install alchemy-viz
```

Or from a CDN, with no build step:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/alchemy-viz/dist/alchemy-viz.js"></script>
```

Pin the version for a page that has to keep drawing the same picture:
`alchemy-viz@0.1.0/dist/alchemy-viz.js`.

## Use

Importing registers every element. Setting `.payload` is the whole API - no
constructor, no options object, no teardown.

```ts
import "alchemy-viz";
import type { AlchemyVizPayload } from "alchemy-viz";

const payload: AlchemyVizPayload = await (await fetch("/network.json")).json();

const view = document.createElement("alchemy-view");
view.style.cssText = "width:100%;height:600px";
document.body.append(view);
view.payload = payload;
```

`<alchemy-view>` validates the payload against the schema, then mounts the
`<gufe-*>` element that draws its `type`. Nothing throws at the caller - an
invalid payload, an unknown type and a missing field each become a panel saying
so, because the usual host is a notebook cell with nowhere to surface an
exception.

The payload types are generated from the schema, so
`import type { LigandNetworkViz } from "alchemy-viz"` describes exactly what
Python writes. The schema ships too, for validating outside TypeScript:

```ts
import schema from "alchemy-viz/schema.json" with { type: "json" };
```

## What it draws

`SmallMoleculeComponentViz`, `ProteinComponentViz`, `SolvatedPDBComponentViz`,
`ProteinMembraneComponentViz`, `SolventComponentViz`, `ProtocolViz`,
`LigandAtomMappingViz`, `LigandNetworkViz`, `ChemicalSystemViz`,
`TransformationViz`, `AlchemicalNetworkViz`.

Any other `type` renders a panel naming it rather than failing.

## Where the payloads come from

From Python. There is no payload builder here:

```python
from alchemy_viz import payload_for
payload = payload_for(network)   # a LigandNetwork, ChemicalSystem, Transformation...
```

Write that to JSON, serve it, hand it to the element.

## Rendering engines

3Dmol.js, RDKit's WebAssembly build and d3 do the drawing, each pinned to an
exact version and fetched from a CDN the first time a view needs it. That keeps
the package one file and a page built today drawing the same picture in a year,
but the bundle does reach the network at runtime.

For an offline deployment or a strict CSP, load them yourself and seed them
before the first view connects:

```js
globalThis.__gufeEngines = { threeDmol: $3Dmol, rdkit, d3 };
```

Each is optional; a view needing one that was not seeded fetches it as usual.

## Versions

npm and PyPI are released from the same git tag at the same version, and
`dist/alchemy-viz.js` here is byte-for-byte the bundle inside the wheel. The
payload schema moves with the minor version while this is 0.x.

## Links

- [Source and documentation](https://github.com/omsf/alchemy-viz)
- [The payload schema](https://github.com/omsf/alchemy-viz/blob/main/schema/README.md)

MIT licensed.
