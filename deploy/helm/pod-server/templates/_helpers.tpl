{{- define "pod-server.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "pod-server.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name (include "pod-server.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "pod-server.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" -}}
{{- end -}}

{{- define "pod-server.labels" -}}
helm.sh/chart: {{ include "pod-server.chart" . }}
app.kubernetes.io/name: {{ include "pod-server.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "pod-server.selectorLabels" -}}
app.kubernetes.io/name: {{ include "pod-server.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "pod-server.serviceAccountName" -}}
{{- if .Values.serviceAccount.create -}}
{{- default (include "pod-server.fullname" .) .Values.serviceAccount.name -}}
{{- else -}}
{{- default "default" .Values.serviceAccount.name -}}
{{- end -}}
{{- end -}}

{{- define "pod-server.configMapName" -}}
{{- printf "%s-env" (include "pod-server.fullname" .) -}}
{{- end -}}

{{- define "pod-server.secretName" -}}
{{- printf "%s-secret-env" (include "pod-server.fullname" .) -}}
{{- end -}}

{{- define "pod-server.blazegraphFullname" -}}
{{- printf "%s-blazegraph" (include "pod-server.fullname" .) -}}
{{- end -}}
