############################################
## OUTPUTS                                ##
############################################

output "albums_api_fqdn" {
  description = "Fully-qualified domain name of the albums-api Container App."
  value       = azurerm_container_app.albums_api.ingress[0].fqdn
}

output "album_viewer_fqdn" {
  description = "Fully-qualified domain name of the album-viewer Container App."
  value       = azurerm_container_app.album_viewer.ingress[0].fqdn
}

output "container_registry_login_server" {
  description = "Login server URL of the Azure Container Registry."
  value       = azurerm_container_registry.acr.login_server
}
