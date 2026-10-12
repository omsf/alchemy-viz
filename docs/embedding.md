# Embedding the bundle

The compiled JavaScript is one ES module. Importing it registers every element;
then setting `.payload` is the only step.

```html
<script type="module" src="alchemy-viz.js"></script>
<alchemy-view id="v" style="width:100%;height:600px"></alchemy-view>
<script type="module">
  document.getElementById("v").payload = await (await fetch("payload.json")).json();
</script>
```

`<alchemy-view>` reads the payload's `type`, picks the element for it and mounts
that element inside itself. The nine concrete elements - `<gufe-ligand-network>`,
`<gufe-protein>` can be used directly if you already know what you are
drawing, and take a `.payload` the same way. [`views.md`](./views.md) is the table
of which type reaches which element.

Assigning `.payload` again redraws. There is no render call and no teardown to do.

## The bundle

```python
from alchemy_viz import bundle_source
bundle_source()     # the module's text, as a string
```

The wheel ships the bundle at `alchemy_viz/_assets/alchemy-viz.js`, so an installed
package is a copy you can serve from a website.

```
https://cdn.jsdelivr.net/gh/omsf/alchemy-viz@main/python/alchemy_viz/_assets/alchemy-viz.js
```

`to_html(obj)`: inlines the bundle and the payload into
one self-contained page, which is what the CLI writes.

## Self contained HTML

The module is has no imports to resolve. The elements build light DOM, so your
page's CSS *can* reach inside a view - which is usually what you want in a page you
control, and is the reason the notebook layer puts views in an iframe instead.

RDKit and 3Dmol are loaded on demand by the views that need them, from a CDN, by
appending a `<script>` to `document.head` and reading `window.RDKit` and
`window.$3Dmol`. If your page already loads either at a different version, that is
a collision to plan around - an iframe is the cheap answer.

## Naming the file it came from

A view draws the payload's own name in its header. Where the payload was read
from a file, the file name goes there too - the payload cannot say it, so the
host does:

```html
<alchemy-view source="tyk2.json"></alchemy-view>
```

```python
to_html(obj, source="tyk2.json")     # and shell_html(source=...) for the shell
```

`window.ALCHEMY_VIZ_SOURCE = "tyk2.json"` before the module runs does the same
for a host that mounts the element itself. The attribute wins where both are
set, and the views without a header strip - a single molecule, a system, a
transformation - do not draw it.

## Debugging

`window.ALCHEMY_VIZ_DEBUG = true` before the module runs makes the element print
its payload to the console, before validation and before dispatch. On a generated
page the query string `?debug` does the same, and `to_html(obj, debug=True)` bakes
it in.

A payload that does not match the schema draws a panel naming the type and listing
the fields rather than throwing, so a broken view is legible without opening the
console. [`troubleshooting.md`](./troubleshooting.md) has the four cases.
