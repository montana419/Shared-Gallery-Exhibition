// Wallet state object
export const walletState = {
  connectedAddress: null,
  miniAppProvider: null,
  isViewOnly: false,
};

let hubApi = null;

/**
 * Initialize Hub API safely after UMD script loads
 */
function getHubApi() {
  if (!hubApi && window.HubApi) {
    hubApi = new window.HubApi('https://hub.nimiq.com');
  }
  return hubApi;
}

/**
 * Initialize connection based on environment context
 */
export async function initWalletConnection(callbacks) {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedGalleryData = urlParams.get('gallery');
  walletState.isViewOnly = !!sharedGalleryData;

  if (!walletState.isViewOnly) {
    walletState.connectedAddress = localStorage.getItem('nimiq_connected_address') || null;
  }

  // Check if running inside Nimiq Pay Mini App container
  if (window.NimiqMiniApp) {
    try {
      const miniApp = await window.NimiqMiniApp.init({ timeout: 2000 });
      if (miniApp) {
        walletState.miniAppProvider = miniApp;
        const accounts = await miniApp.listAccounts();
        if (accounts && accounts.length > 0) {
          walletState.connectedAddress = accounts[0];
          if (!walletState.isViewOnly) {
            localStorage.setItem('nimiq_connected_address', walletState.connectedAddress);
          }
        }
      }
    } catch (e) {
      console.log('Running outside Nimiq Pay container; falling back to Web Hub.');
    }
  }

  callbacks.onStateUpdate(walletState);
}

/**
 * Trigger explicit connection request
 */
export async function connectWallet(btnElement, callbacks) {
  try {
    btnElement.textContent = 'Connecting...';

    // 1. Try Nimiq Pay Mini App SDK Provider
    if (walletState.miniAppProvider) {
      const accounts = await walletState.miniAppProvider.listAccounts();
      if (accounts && accounts.length > 0) {
        walletState.connectedAddress = accounts[0];
        if (!walletState.isViewOnly) {
          localStorage.setItem('nimiq_connected_address', walletState.connectedAddress);
        }
        callbacks.onStateUpdate(walletState);
        return;
      }
    }

    // 2. Fallback to Nimiq Web Hub API
    const api = getHubApi();
    if (api) {
      const result = await api.chooseAddress({ appName: 'PINAXX' });
      if (result && result.address) {
        walletState.connectedAddress = result.address;
        if (!walletState.isViewOnly) {
          localStorage.setItem('nimiq_connected_address', walletState.connectedAddress);
        }
        callbacks.onStateUpdate(walletState);
        if (!walletState.isViewOnly) {
          window.location.reload();
        }
      }
    }
  } catch (error) {
    console.error('Wallet connection failed:', error);
    btnElement.textContent = walletState.isViewOnly ? 'Connect Wallet' : 'Connect Nimiq Wallet';
  }
}

/**
 * Disconnect current wallet session
 */
export function disconnectWallet(callbacks) {
  walletState.connectedAddress = null;
  if (!walletState.isViewOnly) {
    localStorage.removeItem('nimiq_connected_address');
  }
  callbacks.onStateUpdate(walletState);
}