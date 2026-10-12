/**
 * alchemy-viz, whole - every payload type, drawn by the package itself.
 *
 * This frame loads the built alchemy-viz bundle from a CDN and hands the
 * payload to `<alchemy-view>`, the same element a generated page and a notebook
 * widget mount. So it draws every type, with the menus, the depiction modes and
 * the atom mapping stages the package ships - at the cost of being a few
 * hundred kilobytes of someone else's JavaScript rather than something you can
 * read here.
 *
 * Inputs: one payload, under the name of its type in snake_case -
 * `small_molecule`, `protein`, `solvent`, `chemical_system`, `protocol`,
 * `ligand_atom_mapping`, `ligand_network`, `transformation`,
 * `alchemical_network`, `unknown_component`. That name is what picks which
 * input to draw when several arrive; any other name works too, as long as the
 * object carries a `type` the package knows.
 */

/**
 * Where the built bundle comes from.
 *
 * jsDelivr serves any file in the public GitHub repo, so this tracks a branch
 * rather than a release: the frame redraws with whatever `main` carries later.
 */
const BUNDLE =
  "https://cdn.jsdelivr.net/gh/omsf/alchemy-viz@main/python/alchemy_viz/_assets/alchemy-viz.js";

/** The dispatcher element, the same one a generated page and a notebook widget mount. */
const TAG = "alchemy-view";

/** Input name -> the payload type it carries. */
const NAME_TO_TYPE = {
  small_molecule: "SmallMoleculeComponentViz",
  protein: "ProteinComponentViz",
  protein_membrane: "ProteinMembraneComponentViz",
  solvated_pdb: "SolvatedPDBComponentViz",
  solvent: "SolventComponentViz",
  unknown_component: "UnknownComponentViz",
  protocol: "ProtocolViz",
  chemical_system: "ChemicalSystemViz",
  ligand_atom_mapping: "LigandAtomMappingViz",
  ligand_network: "LigandNetworkViz",
  transformation: "TransformationViz",
  alchemical_network: "AlchemicalNetworkViz",
};

// --- the page --------------------------------------------------------------

root.innerHTML = `<div style="position:relative;width:100%;height:100%;overflow:hidden">
  <div id="stage" style="width:100%;height:100%"></div>
  <div id="status" style="position:absolute;left:12px;bottom:10px;font-size:.8rem;
       font-family:ui-monospace,monospace;opacity:.6"></div>
</div>`;

const stage = document.getElementById("stage");
const status = document.getElementById("status");
const say = (text) => {
  status.textContent = text;
};

/** An input arrives parsed when the server calls it JSON, and as text when it does not. */
function asObject(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value && typeof value === "object" ? value : null;
}

/**
 * Which input to draw.
 *
 * The name decides: an input called `ligand_network` is the ligand network,
 * even in a page that also passes the molecules it was built from. Failing a
 * known name, anything carrying a `type` will do, which is what lets an input
 * called `payload` or `data` work without ceremony.
 */
function pickPayload(inputs) {
  const entries = Object.entries(inputs || {}).map(([name, value]) => [name, asObject(value)]);

  for (const [name, value] of entries) {
    if (!value || !(name in NAME_TO_TYPE)) continue;
    if (value.type && value.type !== NAME_TO_TYPE[name]) {
      // Not an error: the payload's own `type` is what the package dispatches
      // on, so the picture will be right either way. Worth saying once, because
      // an input named for the wrong type is usually a wiring mistake.
      console.warn(`[alchemy-viz] input "${name}" carries a ${value.type}`);
    }
    return value;
  }

  const typed = entries.find(([, value]) => value && typeof value.type === "string");
  return typed ? typed[1] : null;
}

// --- the package -----------------------------------------------------------

/**
 * Load the bundle and answer with the tag it defined.
 *
 * The element is looked up in the registry rather than assumed, so a bundle
 * that loads but defines nothing fails here, with something to read, instead
 * of further along as an empty stage.
 */
async function loadPackage() {
  try {
    await import(BUNDLE);
  } catch (error) {
    throw new Error(`Could not load alchemy-viz from ${BUNDLE}\n${error.message}`);
  }
  if (!customElements.get(TAG)) throw new Error(`${BUNDLE} loaded but defined no <${TAG}>`);
  return TAG;
}

say("Loading alchemy-viz...");
const tagPromise = loadPackage();

/** The mounted view, kept so a second payload reuses it instead of stacking. */
let view = null;

async function render(payload) {
  const tag = await tagPromise;
  if (!view) {
    view = document.createElement(tag);
    view.style.cssText = "display:block;width:100%;height:100%";
    stage.replaceChildren(view);
  }
  view.payload = payload;
  say("");
}

// --- the frame -------------------------------------------------------------

export function onInputs(inputs) {
  const payload = pickPayload(inputs);
  if (!payload) {
    say(`Waiting for a payload. Name the input after its type, e.g. "${Object.keys(NAME_TO_TYPE)[0]}".`);
    return;
  }
  render(payload).catch((error) => say(error.message));
}

export function onResize() {
  if (view && typeof view.resize === "function") view.resize();
}
