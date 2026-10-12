#!/usr/bin/env bash
# Cut a release tag, or say which one is current.
#
# With no argument this reports the most recent version tag and what the next
# patch, minor and major would be. It changes nothing, so it is the safe way to
# ask "where are we".
#
# With a version it creates the annotated tag and pushes it, which is the whole
# release: .github/workflows/publish-pypi.yml builds from the tag and uploads to
# PyPI through trusted publishing. A PyPI version cannot be replaced or re-used
# once it exists, so the push is the point of no return and everything before it
# here is a check trying to stop a mistake reaching that point.
#
# Run from the repository root: `pixi run release` or `pixi run release 0.1.2`.
set -euo pipefail

readonly REPO="omsf/alchemy-viz"
readonly MAIN="main"
readonly PACKAGE="alchemy-viz"

die() {
  echo "error: $*" >&2
  exit 1
}

# `v:refname` is git's version sort, so this is the highest version tag rather
# than the most recently created one.
latest_tag() {
  git tag --list 'v*' --sort=-v:refname | head -1
}

# The tags may only exist on the remote, and a stale view of them would let this
# script offer a version that is already taken. Failure is not fatal: being
# offline should not stop someone reading the local answer.
sync_tags() {
  if ! git fetch --tags --quiet origin 2>/dev/null; then
    echo "note:        could not reach origin, working from the local tags only"
    echo
  fi
}

# --------------------------------------------------------------------------- #
# No argument: report                                                           #
# --------------------------------------------------------------------------- #

if [[ $# -eq 0 ]]; then
  sync_tags
  tag=$(latest_tag)

  if [[ -z $tag ]]; then
    echo "no version tags yet"
    echo
    echo "The first release would be:   pixi run release 0.1.0"
    exit 0
  fi

  version=${tag#v}
  echo "most recent tag:    $tag"

  # Only a plain X.Y.Z can be bumped without guessing what a suffix means, so a
  # prerelease reports the tag and stops short of arithmetic.
  if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    major=${BASH_REMATCH[1]}
    minor=${BASH_REMATCH[2]}
    patch=${BASH_REMATCH[3]}
    echo "commits since:      $(git rev-list --count "$tag..HEAD" 2>/dev/null || echo "?")"
    echo
    echo "next patch:         pixi run release $major.$minor.$((patch + 1))"
    echo "next minor:         pixi run release $major.$((minor + 1)).0"
    echo "next major:         pixi run release $((major + 1)).0.0"
  else
    echo
    echo "That is not a plain X.Y.Z, so there is no next version to suggest."
  fi
  exit 0
fi

# --------------------------------------------------------------------------- #
# With a version: release                                                       #
# --------------------------------------------------------------------------- #

[[ $# -eq 1 ]] || die "one version at a time: pixi run release 0.1.2"

version=${1#v}
tag="v$version"

# A core X.Y.Z, optionally with a prerelease suffix. setuptools-scm reads the
# version off this tag, so a shape it cannot parse would produce a package
# version nobody asked for.
[[ $version =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-]?[0-9A-Za-z][0-9A-Za-z.-]*)?$ ]] ||
  die "'$1' is not a version: expected X.Y.Z, optionally with a suffix such as 0.2.0rc1"

echo "==> checking the tree"
[[ -z $(git status --porcelain) ]] ||
  die "the working tree is dirty. The tag would name a commit that is not what you have."

branch=$(git rev-parse --abbrev-ref HEAD)
[[ $branch == "$MAIN" ]] ||
  die "on branch '$branch', not '$MAIN'. Releases are cut from $MAIN."

echo "ok:          clean, on $MAIN"

echo "==> checking against origin"
git fetch --tags --quiet origin ||
  die "could not reach origin. A release needs to push, so this cannot continue offline."

local_head=$(git rev-parse HEAD)
remote_head=$(git rev-parse "origin/$MAIN")
[[ $local_head == "$remote_head" ]] ||
  die "$MAIN and origin/$MAIN differ. Push or pull first, so the tag names a commit origin has."

echo "ok:          up to date with origin/$MAIN"

echo "==> checking the version is free"
if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
  die "tag $tag already exists locally."
fi
if git ls-remote --exit-code --tags origin "refs/tags/$tag" >/dev/null 2>&1; then
  die "tag $tag already exists on origin."
fi

# The authority on whether a version is taken is the index, not the tags: 0.1.0
# was uploaded by hand before any tag was pushed. PyPI never lets a version be
# re-used, so finding it here is the last chance to notice.
code=$(curl -fsS -o /dev/null -w '%{http_code}' "https://pypi.org/pypi/$PACKAGE/$version/json" 2>/dev/null || echo "000")
case $code in
404) echo "ok:          $tag is free, and $version is not on PyPI" ;;
200) die "$version is already on PyPI. A version cannot be replaced; pick another." ;;
*) echo "note:        could not ask PyPI about $version (HTTP $code), continuing" ;;
esac

previous=$(latest_tag)
if [[ -n $previous ]]; then
  # Sorting the two and looking at the winner is how we tell whether this is
  # forwards, without reimplementing version comparison in bash.
  highest=$(printf '%s\n%s\n' "$previous" "$tag" | sort -V | tail -1)
  if [[ $highest != "$tag" ]]; then
    echo "note:        $tag sorts below the current $previous"
  fi
fi

# --------------------------------------------------------------------------- #
# Confirm                                                                       #
# --------------------------------------------------------------------------- #

cat <<SUMMARY

Releasing $tag
  commit     $(git rev-parse --short HEAD) $(git log -1 --pretty=%s)
  previous   ${previous:-none}
  publishes  https://pypi.org/project/$PACKAGE/$version/

Pushing this tag uploads to PyPI, which cannot be undone or re-uploaded.
The npm release fires on the same tag and fails until NPM_TOKEN is set.
SUMMARY

if [[ ${RELEASE_YES:-} == "1" ]]; then
  echo
  echo "RELEASE_YES=1, not asking"
elif [[ -e /dev/tty ]]; then
  echo
  read -r -p "Type the version to confirm: " answer </dev/tty
  [[ $answer == "$version" || $answer == "$tag" ]] || die "'$answer' does not match $version, stopping"
else
  die "nothing to prompt on. Re-run with RELEASE_YES=1 if this is deliberate."
fi

# --------------------------------------------------------------------------- #
# Tag and push                                                                  #
# --------------------------------------------------------------------------- #

echo
echo "==> tagging"
git tag -a "$tag" -m "$tag"
echo "ok:          created $tag"

echo "==> pushing"
if ! git push origin "$tag"; then
  # The local tag would otherwise sit there and make a retry look like a
  # duplicate, when nothing was published.
  git tag -d "$tag" >/dev/null
  die "the push failed, so nothing was released. Removed the local $tag."
fi

cat <<DONE
ok:          pushed $tag

Watch it:    gh run watch --repo $REPO
Lands at:    https://pypi.org/project/$PACKAGE/$version/
DONE
