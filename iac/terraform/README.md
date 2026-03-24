# Terraform – Azure Container Apps

This template provisions the following Azure resources:

| Resource | Description |
|---|---|
| Resource Group | Logical container for all resources |
| Log Analytics Workspace | Telemetry sink for the Container Apps environment |
| Azure Container Registry (ACR) | Private registry for container images |
| Container Apps Environment | Managed environment shared by both apps |
| `albums-api` Container App | ASP.NET API with Dapr sidecar enabled |
| `album-viewer` Container App | Vue.js frontend wired to the API |

## Prerequisites

- [Terraform ≥ 1.3](https://developer.hashicorp.com/terraform/downloads)
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) – authenticated (`az login`)
- Container images pushed to a registry (see *Build & push images* below)

## Quick start

```bash
cd iac/terraform

# 1. Initialise providers
terraform init

# 2. Review the execution plan
terraform plan \
  -var="registry_name=<acr_name>" \
  -var="albums_api_image=<acr_name>.azurecr.io/albums-api:latest" \
  -var="album_viewer_image=<acr_name>.azurecr.io/album-viewer:latest"

# 3. Apply
terraform apply \
  -var="registry_name=<acr_name>" \
  -var="albums_api_image=<acr_name>.azurecr.io/albums-api:latest" \
  -var="album_viewer_image=<acr_name>.azurecr.io/album-viewer:latest"
```

Alternatively, create a `terraform.tfvars` file:

```hcl
registry_name       = "myuniqueacr"
albums_api_image    = "myuniqueacr.azurecr.io/albums-api:latest"
album_viewer_image  = "myuniqueacr.azurecr.io/album-viewer:latest"
```

Then simply run `terraform apply`.

## Build & push images

```bash
ACR=<acr_name>

# albums-api (.NET)
az acr build \
  --registry $ACR \
  --image albums-api:latest \
  --file ../../albums-api/Dockerfile \
  ../../albums-api

# album-viewer (Vue.js)
az acr build \
  --registry $ACR \
  --image album-viewer:latest \
  --file ../../album-viewer/Dockerfile \
  ../../album-viewer
```

## Variables

| Name | Description | Default |
|---|---|---|
| `location` | Azure region | `eastus` |
| `resource_group_name` | Resource group name | `rg-container-apps` |
| `container_apps_env_name` | Container Apps environment name | `env-container-apps` |
| `log_analytics_workspace_name` | Log Analytics workspace name | `log-container-apps` |
| `registry_name` | **Required.** ACR name (globally unique) | – |
| `registry_sku` | ACR SKU | `Basic` |
| `registry_server` | Override registry server (defaults to ACR created here) | `""` |
| `registry_username` | Override registry username | `""` |
| `registry_password` | Override registry password | `""` |
| `albums_api_name` | Container App name for albums-api | `albums-api` |
| `albums_api_image` | **Required.** Container image for albums-api | – |
| `albums_api_collection_id` | `COLLECTION_ID` env var for albums-api | `albums` |
| `albums_api_dapr_port` | Dapr sidecar port for albums-api | `3500` |
| `album_viewer_name` | Container App name for album-viewer | `album-viewer` |
| `album_viewer_image` | **Required.** Container image for album-viewer | – |

## Outputs

| Name | Description |
|---|---|
| `albums_api_fqdn` | Public FQDN of the albums-api Container App |
| `album_viewer_fqdn` | Public FQDN of the album-viewer Container App |
| `container_registry_login_server` | Login server URL of the ACR |

## Tear down

```bash
terraform destroy
```
