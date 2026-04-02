document.addEventListener("DOMContentLoaded", async () => {
  loadTree();
});

async function loadTree() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getDOMTree
  });

  const treeData = result[0].result;
  document.getElementById("tree").innerHTML = `<ul>${renderTree(treeData)}</ul>`;
}

// Extract DOM
function getDOMTree() {
  function traverse(node) {
    return {
      tag: node.tagName?.toLowerCase(),
      children: Array.from(node.children).map(traverse)
    };
  }
  return traverse(document.documentElement);
}

// Render tree
function renderTree(node) {
  if (!node) return "";

  let html = `<li>${node.tag}`;

  if (node.children.length > 0) {
    html += "<ul>";
    node.children.forEach(child => {
      html += renderTree(child);
    });
    html += "</ul>";
  }

  html += "</li>";
  return html;
}
