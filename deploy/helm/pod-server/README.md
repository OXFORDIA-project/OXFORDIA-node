# pod-server Helm chart

This chart deploys the Oxfordia Pod Server on Kubernetes without introducing any custom control plane or wrapper configuration.

## Install

```bash
helm repo add oxfordia https://oxfordia-project.github.io/OXFORDIA-node
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

## Operational notes

- `app.baseUrl` is required and has no default. Use the public `https://` URL; TLS terminates at the ingress.
- `replicaCount` must be `1`. Pod state lives on a ReadWriteOnce volume with file-based locks, and the chart refuses other values. Both Deployments use the `Recreate` strategy, so upgrades have a few seconds of downtime.
- ingress-nginx rejects request bodies over 1 MB by default, which blocks data uploads. Raise the limit with an annotation such as `nginx.ingress.kubernetes.io/proxy-body-size: "100m"` in `ingress.annotations`.
- Managed Blazegraph (`triplestore.mode=managed`):
  - stores its journal on its own PVC (`triplestore.managed.storageSize`), using the chart's `files/RWStore.properties`. The journal survives pod restarts and upgrades.
  - needs about 1.5 Gi of memory (the JVM runs with `-Xmx1g`).
  - is amd64-only, so it gets a `kubernetes.io/arch: amd64` node selector by default. Set `triplestore.managed.nodeSelector=null` where amd64 emulation is available, e.g. Docker Desktop on Apple Silicon.
  - accepts unauthenticated SPARQL updates from anything inside the cluster. Restrict it with a NetworkPolicy on shared clusters.
  - is not backed up by the chart. Snapshot its PVC, or use an external, managed triplestore for production data.
