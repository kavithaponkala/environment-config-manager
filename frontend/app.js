const API_BASE_URL = 'http://localhost:5000';
let currentEnvironment = null;

// Load configurations for selected environment
async function loadConfigs() {
  const environment = document.getElementById('environment').value;
  
  if (!environment) {
    showMessage('Please select an environment', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/configs/${environment}`);
    
    if (!response.ok) {
      throw new Error(`Environment not found: ${environment}`);
    }
    
    const data = await response.json();
    currentEnvironment = environment;
    
    // Display configs
    displayConfigs(data.configs, environment);
    showMessage(`✅ Loaded ${environment} configurations`, 'success');
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
  }
}

// Display configurations
function displayConfigs(configs, environment) {
  const configDisplay = document.getElementById('configDisplay');
  const configsList = document.getElementById('configsList');
  const envName = document.getElementById('envName');
  
  envName.textContent = environment.toUpperCase();
  configsList.innerHTML = '';
  
  Object.entries(configs).forEach(([key, value]) => {
    const configItem = document.createElement('div');
    configItem.className = 'config-item';
    configItem.innerHTML = `
      <div class="config-key">${key}</div>
      <div class="config-value">${value}</div>
      <button class="delete-btn" onclick="deleteConfig('${key}')">Delete</button>
    `;
    configsList.appendChild(configItem);
  });
  
  configDisplay.style.display = 'block';
}

// Add new configuration
async function addConfig() {
  if (!currentEnvironment) {
    showMessage('Please select an environment first', 'error');
    return;
  }
  
  const key = document.getElementById('configKey').value.trim();
  const value = document.getElementById('configValue').value.trim();
  
  if (!key || !value) {
    showMessage('Please enter both key and value', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/configs/${currentEnvironment}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      displayConfigs(data.configs, currentEnvironment);
      document.getElementById('configKey').value = '';
      document.getElementById('configValue').value = '';
      showMessage(`✅ Configuration added successfully`, 'success');
    } else {
      showMessage(`Error: ${data.error}`, 'error');
    }
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
  }
}

// Delete configuration
async function deleteConfig(key) {
  if (!currentEnvironment) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/configs/${currentEnvironment}/${key}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      displayConfigs(data.configs, currentEnvironment);
      showMessage(`✅ Configuration deleted`, 'success');
    } else {
      showMessage(`Error: ${data.error}`, 'error');
    }
  } catch (error) {
    showMessage(`Error: ${error.message}`, 'error');
  }
}

// Show message notification
function showMessage(text, type) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  
  setTimeout(() => {
    messageEl.className = 'message';
  }, 3000);
}

// Initialize
window.addEventListener('load', () => {
  console.log('🚀 Frontend loaded. API Base URL:', API_BASE_URL);
});