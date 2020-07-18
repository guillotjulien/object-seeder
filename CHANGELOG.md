## Version 1.1.0 (2020-5-17)

### Major Changes

- Fixing import path resolution broke old path
- Types definitions moved to the project root

### Bug fixes

- Fixed import path resolution

## Version 1.2.0 (2020-7-18)

### Major Changes

- Improved seeding when dealing with arrays and circular references
- Added options to `@Property()` decorator
    - name
    - ignoreCast
    - expose
- Added method `getMetadata` to access exposed properties metadata

### Miscellaneous

- Removed `reflect-metadata` as a direct dependency
- Improved error handling

## Version 1.2.1 (2020-7-18)

Fixing invalid build published
