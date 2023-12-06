// Replace 'Your Button Text' with the text you want to search for
const buttonText = 'Your Button Text';
const styleElement = document.createElement('link');
styleElement.rel = 'stylesheet';
styleElement.href = chrome.runtime.getURL('hide-content.css');
document.head.appendChild(styleElement);

// Wait for the DOM content to be loaded before executing the function
document.addEventListener('DOMContentLoaded', () => {
  clickButtonByText(buttonText);
});

function clickButtonByText(text) {
  const buttons = document.querySelectorAll('button');
  let found = false;

  buttons.forEach((button) => {
    if (button.textContent.includes(text)) {
      button.click();
      found = true;
    }
  });

  if (!found) {
    console.warn(`couldn't select cookies for you, you can try manually to select cookies`);
  }
}