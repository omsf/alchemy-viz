#!/usr/bin/env python
"""Rewrite README.md's repository-relative URLs to absolute ones, for PyPI.

PyPI renders the long description at ``pypi.org/project/alchemy-viz/``, so a
relative path in it resolves against that page rather than against the
repository: the screenshot 404s and every link into ``docs/`` goes nowhere.
GitHub resolves the same paths correctly, which is why the committed README
keeps them and this script is not part of the ordinary build. The release
workflow runs it against its throwaway checkout, just before ``python -m
build``, so only the published metadata differs.

Two destinations, because the right absolute URL depends on what is being
pointed at. An image has to be the bytes, so it goes to ``raw.``; a link to a
file is for a person to read, so it goes to the ``blob/`` web view.

Writes the file in place. Prints what it changed, and fails if it finds a
relative URL it does not know how to rewrite, so a new one cannot quietly
reach PyPI as a broken link.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

RAW = "https://raw.githubusercontent.com/{repo}/{ref}/{path}"
BLOB = "https://github.com/{repo}/blob/{ref}/{path}"

# What has to be the bytes rather than a page about the bytes.
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif"}

# A URL we must not touch: another scheme, a page-internal anchor, or already
# absolute. Protocol-relative (`//host/x`) counts as absolute too.
ABSOLUTE = re.compile(r"^(?:[a-z][a-z0-9+.-]*:|//|#)", re.IGNORECASE)

# `[text](target)`, `![alt](target)`. The target stops at whitespace so a
# markdown title - `[x](y "t")` - is left on the end untouched.
MD_LINK = re.compile(r"(?P<bang>!?)\[(?P<text>[^\]]*)\]\((?P<target>[^)\s]+)(?P<rest>[^)]*)\)")

# `src="target"` and `href="target"` in the HTML the README embeds.
HTML_ATTR = re.compile(r"(?P<attr>\bsrc|\bhref)=\"(?P<target>[^\"]+)\"")


def is_image(path: str) -> bool:
    return Path(path).suffix.lower() in IMAGE_SUFFIXES


def absolute(target: str, repo: str, ref: str) -> str:
    """Return the absolute URL for one repository-relative target."""
    path = target.lstrip("./")
    template = RAW if is_image(target) else BLOB
    return template.format(repo=repo, ref=ref, path=path)


def rewrite(text: str, repo: str, ref: str) -> tuple[str, list[tuple[str, str]]]:
    changed: list[tuple[str, str]] = []

    def swap(target: str) -> str:
        new = absolute(target, repo, ref)
        changed.append((target, new))
        return new

    def on_md(m: re.Match[str]) -> str:
        target = m.group("target")
        if ABSOLUTE.match(target):
            return m.group(0)
        return f"{m.group('bang')}[{m.group('text')}]({swap(target)}{m.group('rest')})"

    def on_html(m: re.Match[str]) -> str:
        target = m.group("target")
        if ABSOLUTE.match(target):
            return m.group(0)
        return f'{m.group("attr")}="{swap(target)}"'

    text = MD_LINK.sub(on_md, text)
    text = HTML_ATTR.sub(on_html, text)
    return text, changed


def leftovers(text: str) -> list[str]:
    """Relative URLs still present after rewriting - a bug in this script."""
    found = [m.group("target") for m in MD_LINK.finditer(text)]
    found += [m.group("target") for m in HTML_ATTR.finditer(text)]
    return [t for t in found if not ABSOLUTE.match(t)]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("readme", nargs="?", default="README.md", type=Path)
    parser.add_argument("--repo", default="omsf/alchemy-viz")
    parser.add_argument(
        "--ref",
        default="main",
        help="branch, tag or commit the absolute URLs point at",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="report what would change and write nothing",
    )
    args = parser.parse_args()

    original = args.readme.read_text(encoding="utf-8")
    rewritten, changed = rewrite(original, args.repo, args.ref)

    if not changed:
        print(f"{args.readme}: no relative URLs found, nothing to do")
        return 0

    for old, new in changed:
        print(f"  {old}\n    -> {new}")

    stuck = leftovers(rewritten)
    if stuck:
        print(f"\nerror: {len(stuck)} relative URL(s) left unrewritten: {stuck}", file=sys.stderr)
        return 1

    if args.check:
        print(f"\n{args.readme}: {len(changed)} URL(s) would be rewritten (--check, not written)")
        return 0

    args.readme.write_text(rewritten, encoding="utf-8")
    print(f"\n{args.readme}: {len(changed)} URL(s) rewritten for {args.repo}@{args.ref}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
