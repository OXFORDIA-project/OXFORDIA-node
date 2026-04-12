# pod-server Helm chart

This chart deploys the Oxfordia Pod Server on Kubernetes without introducing any custom control plane or wrapper configuration.

## Install

```bash
helm repo add oxfordia https://your-org.github.io/pod-server
helm install my-pod oxfordia/pod-server \
  --set app.baseUrl=https://pod.example.org \
  --set triplestore.mode=external \
  --set triplestore.external.url=https://sparql.example.org/query \
  --set ingress.enabled=true \
  --set ingress.hostname=pod.example.org
```

Or with a values file:

```bash
helm install my-pod oxfordia/pod-server -f my-values.yaml
```

## Values

- `app.baseUrl` sets `CSS_BASE_URL`.
- `app.trustProxy` sets the pod server's `TRUST_PROXY` environment variable.
- `css.extraEnv` and `css.secretEnv` pass additional environment variables straight into the container.
- `css.extraArgs` appends native CSS CLI flags directly to the container command line.
- `triplestore.mode=managed` deploys Blazegraph in-cluster and points `CSS_SPARQL_ENDPOINT` at it.
- `triplestore.mode=external` requires `triplestore.external.url`.
- `persistence.enabled` mounts storage at `app.dataPath`, which also becomes `CSS_ROOT_FILE_PATH`.
