{{/*
Expand the name of the chart.
*/}}
{{- define "repaircafe.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "repaircafe.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "repaircafe.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "repaircafe.labels" -}}
helm.sh/chart: {{ include "repaircafe.chart" . }}
{{ include "repaircafe.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "repaircafe.selectorLabels" -}}
app.kubernetes.io/name: {{ include "repaircafe.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "repaircafe.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "repaircafe.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "repaircafe.postgresHost" -}}
{{ include "repaircafe.fullname" . }}-postgres
{{- end }}

{{- define "repaircafe.postgresSecretName" -}}
{{ include "repaircafe.fullname" . }}-postgres
{{- end }}

{{- define "repaircafe.appSecretName" -}}
{{ include "repaircafe.fullname" . }}-app
{{- end }}

{{- define "repaircafe.uploadsPvcName" -}}
{{ include "repaircafe.fullname" . }}-uploads
{{- end }}
