---
name: Bug Report
about: Report a bug or incorrect date conversion
title: '[BUG] '
labels: bug
assignees: ''
---

## Description
A clear description of the bug.

## Date Conversion Details
- **Solar Date**: (e.g., 2025-01-01)
- **Expected Lunar Date**: (e.g., 2024-12-2)
- **Actual Lunar Date**: (what the library returned)

## Steps to Reproduce
```javascript
const { solarToLunar } = require('./soluna.js');
const result = solarToLunar(new Date('YYYY-MM-DD'));
console.log(result);
```

## Environment
- Node.js version:
- OS:

## Additional Context
Any other information that might help debug the issue.
