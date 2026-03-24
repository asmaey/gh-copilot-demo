############################################
## VARIABLES                              ##
############################################

variable "location" {
  description = "Azure region where all resources will be deployed."
  type        = string
  default     = "eastus"
}

variable "resource_group_name" {
  description = "Name of the Azure resource group."
  type        = string
  default     = "rg-container-apps"
}

variable "container_apps_env_name" {
  description = "Name of the Azure Container Apps managed environment."
  type        = string
  default     = "env-container-apps"
}

variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics workspace used by the Container Apps environment."
  type        = string
  default     = "log-container-apps"
}

# ---- Azure Container Registry ----

variable "registry_name" {
  description = "Name of the Azure Container Registry (must be globally unique, alphanumeric only)."
  type        = string
}

variable "registry_sku" {
  description = "SKU of the Azure Container Registry (Basic, Standard, or Premium)."
  type        = string
  default     = "Basic"
}

variable "registry_server" {
  description = "Login server of the registry used by the container apps (e.g. myacr.azurecr.io). Defaults to the ACR created in this template."
  type        = string
  default     = ""
}

variable "registry_username" {
  description = "Username for the container registry."
  type        = string
  default     = ""
}

variable "registry_password" {
  description = "Password for the container registry."
  type        = string
  sensitive   = true
  default     = ""
}

# ---- albums-api (ASP.NET) ----

variable "albums_api_name" {
  description = "Name of the albums-api Container App."
  type        = string
  default     = "albums-api"
}

variable "albums_api_image" {
  description = "Container image for the albums-api application (e.g. myacr.azurecr.io/albums-api:latest)."
  type        = string
}

variable "albums_api_collection_id" {
  description = "Value of the COLLECTION_ID environment variable consumed by albums-api."
  type        = string
  default     = "albums"
}

variable "albums_api_dapr_port" {
  description = "Port that Dapr uses to communicate with the albums-api sidecar (default matches Dapr default: 3500)."
  type        = number
  default     = 3500
}

# ---- album-viewer (Vue.js) ----

variable "album_viewer_name" {
  description = "Name of the album-viewer Container App."
  type        = string
  default     = "album-viewer"
}

variable "album_viewer_image" {
  description = "Container image for the album-viewer application (e.g. myacr.azurecr.io/album-viewer:latest)."
  type        = string
}
