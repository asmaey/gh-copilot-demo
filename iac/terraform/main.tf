############################################
## PROVIDER                               ##
############################################

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "azurerm" {
  features {}
}

############################################
## LOCALS                                  ##
############################################

locals {
  # The ACR resource is always created by this template.
  # The registry_server / registry_username / registry_password variables let you
  # override credentials (e.g. to pull images from a separate registry), but the
  # ACR resource itself is still provisioned. All three attributes below are
  # therefore always resolvable at plan/apply time.
  effective_registry_server   = var.registry_server != "" ? var.registry_server : azurerm_container_registry.acr.login_server
  effective_registry_username = var.registry_username != "" ? var.registry_username : azurerm_container_registry.acr.admin_username
  effective_registry_password = var.registry_password != "" ? var.registry_password : azurerm_container_registry.acr.admin_password
}

############################################
## RESOURCE GROUP                         ##
############################################

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

############################################
## LOG ANALYTICS (required by env)        ##
############################################

resource "azurerm_log_analytics_workspace" "law" {
  name                = var.log_analytics_workspace_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

############################################
## AZURE CONTAINER REGISTRY               ##
############################################

resource "azurerm_container_registry" "acr" {
  name                   = var.registry_name
  resource_group_name    = azurerm_resource_group.rg.name
  location               = azurerm_resource_group.rg.location
  sku                    = var.registry_sku
  # admin_enabled allows Container Apps to authenticate with username/password.
  # For production workloads, consider disabling admin and using a managed identity
  # with an AcrPull role assignment instead.
  admin_enabled          = true
}

############################################
## CONTAINER APPS ENVIRONMENT             ##
############################################

resource "azurerm_container_app_environment" "env" {
  name                       = var.container_apps_env_name
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id
}

############################################
## albums-api CONTAINER APP               ##
############################################

resource "azurerm_container_app" "albums_api" {
  name                         = var.albums_api_name
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  # Registry credentials stored as a secret reference
  secret {
    name  = "registry-password"
    value = local.effective_registry_password
  }

  registry {
    server               = local.effective_registry_server
    username             = local.effective_registry_username
    password_secret_name = "registry-password"
  }

  # External ingress on port 80
  ingress {
    external_enabled = true
    target_port      = 80
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  # Dapr sidecar – app ID matches the container app name, port matches the Dapr default (3500)
  dapr {
    app_id   = var.albums_api_name
    app_port = var.albums_api_dapr_port
  }

  template {
    container {
      name   = var.albums_api_name
      image  = var.albums_api_image
      cpu    = 0.25
      memory = "0.5Gi"

      env {
        name  = "COLLECTION_ID"
        value = var.albums_api_collection_id
      }
    }
  }
}

############################################
## album-viewer CONTAINER APP             ##
############################################

resource "azurerm_container_app" "album_viewer" {
  name                         = var.album_viewer_name
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  # Registry credentials stored as a secret reference
  secret {
    name  = "registry-password"
    value = local.effective_registry_password
  }

  registry {
    server               = local.effective_registry_server
    username             = local.effective_registry_username
    password_secret_name = "registry-password"
  }

  # External ingress on port 80
  ingress {
    external_enabled = true
    target_port      = 80
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    container {
      name   = var.album_viewer_name
      image  = var.album_viewer_image
      cpu    = 0.25
      memory = "0.5Gi"

      # Point the frontend at the albums-api Container App FQDN
      env {
        name  = "VITE_ALBUM_API_HOST"
        value = "https://${azurerm_container_app.albums_api.ingress[0].fqdn}"
      }
    }
  }

  depends_on = [azurerm_container_app.albums_api]
}
