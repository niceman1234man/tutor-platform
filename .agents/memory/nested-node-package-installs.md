---
name: Nested Node package installs
description: Package installation behavior for apps deployed from nested client or server directories.
---

In this workspace, the Replit package-install callback installed Node packages at the workspace root, even though the backend deploys from `server/`.

**Why:** A dependency present only in the root manifest will not be installed when the deployment builds the server subproject independently.

**How to apply:** Before installing a dependency in a multi-package project, identify the actual deployment directory and verify that its own package manifest and lockfile include the dependency.