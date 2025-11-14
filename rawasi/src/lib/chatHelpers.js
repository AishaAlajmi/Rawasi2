// C:\Users\aisha\Downloads\Rawasi\rawasi\src\lib\chatHelpers.js
/**
 * Helper function to prepare provider data for chat
 * This ensures all necessary fields are present
 */
export function prepareProviderForChat(provider) {
  return {
    // Primary identification
    name: provider.name || provider.company_name || "Provider",
    email: provider.email || "",
    phone: provider.phone || provider.phone_number || "",
    
    // Additional data
    company_name: provider.company_name || provider.name,
    location: provider.locationEn || provider.location || "",
    rating: provider.rating || 0,
    
    // Tech info
    technologies: provider.technologies || [],
    portfolio_description: provider.portfolio_description || "",
    
    // IDs (if available)
    auth_user_id: provider.auth_user_id || provider.provider_auth_id || null,
    provider_id: provider.provider_id || provider.id || null,
    
    // Pass everything else just in case
    ...provider
  };
}

/**
 * Navigate to chat with a provider
 * Usage: navigateToChat(navigate, provider)
 */
export function navigateToChat(navigate, provider) {
  const preparedProvider = prepareProviderForChat(provider);
  
  console.log("💬 Opening chat with:", preparedProvider.name);
  
  navigate("/messages", {
    state: {
      provider: preparedProvider
    }
  });
}