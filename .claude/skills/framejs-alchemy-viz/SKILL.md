---
name: framejs-alchemy-viz
description: How to build a framejs app (frame) in the alchemy-viz repo. Load this whenever creating, editing or sharing a framejs frame from here - anything using create_frame/update_frame, a framejs.app or framejs.io /j/<slug> URL, or a request to "make a frame", "put this in framejs", "share this payload as a link". The default is to load the built alchemy-viz bundle from jsDelivr and mount <alchemy-view>, not to redraw the payload by hand.
---

# framejs frames for alchemy-viz

## The default

Unless the user asks for something else, a frame created from this repo loads
the built alchemy-viz bundle from a CDN and hands the payload to the package's
own dispatcher element. It does not redraw molecules, networks or mappings in
frame code.

Why: `<alchemy-view>` is the same element a generated page and a notebook widget
mount, so the frame gets every payload type, the menus, the depiction modes and
the atom mapping stages for free, and it keeps working as the package changes.
The cost is a few hundred kilobytes of bundle, which is the right trade for a
shareable link.

The working reference is <https://framejs.app/j/a6bc975b71d2485bb2ddaecf4365b110>
("alchemy-viz, whole"). `templates/alchemy-view-frame.js` next to this file is
that frame's source - start from it rather than writing a frame from scratch.

## Building one

1. Call `framejs_guide` once per session first; the frame is a browser ES module
   with exported handlers, and the guide is the authority on the runtime.
2. Copy `templates/alchemy-view-frame.js` as the `js`.
3. Pass the payload as an input DataRef named after its type in snake_case:

   ```json
   {
     "inputs": {
       "alchemical_network": {
         "type": "url",
         "value": "https://cdn.jsdelivr.net/gh/omsf/alchemy-viz@main/examples/alchemical_network_medium.json"
       }
     }
   }
   ```

   The repo's `examples/*.json` are served by jsDelivr straight off GitHub, so
   any of them is a one-line input. A payload the user has locally has to reach
   a public URL somehow before a frame can draw it - say so rather than inlining
   a megabyte of JSON into the `js`.

4. Editing an existing frame: `get_frame`, modify the returned content dict,
   pass the whole dict back to `update_frame`. Never rewrite from scratch, or
   the `inputs` and `modules` it depends on are silently dropped.

## Input names

The template picks which input to draw by name, so use these:

| input name | payload type |
|---|---|
| `small_molecule` | `SmallMoleculeComponentViz` |
| `protein` | `ProteinComponentViz` |
| `protein_membrane` | `ProteinMembraneComponentViz` |
| `solvated_pdb` | `SolvatedPDBComponentViz` |
| `solvent` | `SolventComponentViz` |
| `protocol` | `ProtocolViz` |
| `chemical_system` | `ChemicalSystemViz` |
| `ligand_atom_mapping` | `LigandAtomMappingViz` |
| `ligand_network` | `LigandNetworkViz` |
| `transformation` | `TransformationViz` |
| `alchemical_network` | `AlchemicalNetworkViz` |
| `unknown_component` | `UnknownComponentViz` |

That table mirrors `VIEW_TAGS` in `ts/src/alchemy-view.ts`. A payload under any
other name still draws, as long as it carries a `type` the package knows - the
name is only how the frame chooses between several inputs.

## The bundle URL

`BUNDLE` in the template is the one path the bundle lives at:

- `@main/python/alchemy_viz/_assets/alchemy-viz.js`

The rename from gufe-viz to alchemy-viz has landed on `main`, so the pre-rename
fallback and the old `gufe-view` element name are both gone - the bundle on
`main` defines `alchemy-view` and nothing else. The template still reads the
element out of `customElements` rather than assuming it, so a bundle that loads
without defining the element says that, rather than leaving an empty stage.

A frame pinned to a branch tracks that branch, so a frame made today can change
under the user when the branch moves. Pin a tag or a commit sha instead when the
user wants a link that keeps drawing exactly what they saw.

## When not to use the default

Hand-written frame code is the right answer when the user asks for it: a small
readable module that draws one thing, a sketch of a drawing idea before it goes
into `ts/src/views/`, or anything where the point is the code rather than the
picture. Reach for it on request, not by default.

## House style

Frames written here follow the repo's conventions: no Unicode punctuation in the
source, no references to planning documents in comments, and docstrings that say
why rather than what.
