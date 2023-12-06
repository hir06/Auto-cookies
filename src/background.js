import { commonJSHandlers } from "./js/utils.js";
let tabs = {};

function getPreparedTab(tab) {
    tab.hostname = false;
    tab.whitelisted = false;
    tab.host_levels = [];
  
    if (tab.url) {
      tab.hostname = getHostname(tab.url, true);
  
      if (tab.hostname) {
        const parts = tab.hostname.split(".");
  
        for (let i = parts.length; i >= 2; i--) {
          tab.host_levels.push(parts.slice(-1 * i).join("."));
        }
  
        tab.whitelisted = isWhitelisted(tab);
      }
    }
  
    return tab;
  }

function onCreatedListener(tab) {
    tabs[tab.id] = getPreparedTab(tab);
    console.log('tabs', tabs)
  }
function executeScript(injection, callback) {
    const { tabId, func, file, frameId } = injection;
    if (isManifestV3) {
      // manifest v3
      chrome.scripting.executeScript(
        {
          target: { tabId, frameIds: [frameId || 0] },
          files: file ? [file] : undefined,
          func,
        },
        callback
      );
    } else {
      // manifest v2
      chrome.tabs.executeScript(
        tabId,
        {
          file,
          frameId: frameId || 0,
          code: func == undefined ? undefined : "(" + func.toString() + ")();",
          runAt: xmlTabs[tabId] ? "document_idle" : "document_end",
        },
        callback
      );
    }
}
commonJSHandlers.forEach((handler) => {
    // console.log('handler', tab);
    executeScript({ tabId: tab.id, file: "js/" +handler +'.js'}, () => {})
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['js/hotReload.js', "js/localStorage.js"],
        });
      }
    });
  });

chrome.tabs.onCreated.addListener(onCreatedListener);
// chrome.browserAction.onClicked.addListener((tab) => {
//     chrome.tabs.executeScript(tab.id, { file: 'content.js' });
//   });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'clickButtonByText') {
      const buttonText = request.text;
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'clickButtonByText', text: buttonText });
      });
    }
  });