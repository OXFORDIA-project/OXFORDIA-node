# Config Notes

This deployment intentionally uses a custom CSS config at [`css-idp.json`](./css-idp.json).

It is based on the same building blocks as the latest built-in `file.json` server, not the OIDC-only preset. The reason is architectural: the latest OIDC-only preset is suitable for linking existing WebIDs, but this project wants one server that can mint and host its own WebIDs on the same origin.

Adjust `css-idp.json` if you need configuration-level overrides such as:

- restricting self-registration with custom authorization rules
- swapping storage backends
- changing identity templates or interaction handlers
