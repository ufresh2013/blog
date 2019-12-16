---
title: VScode
date: 2019-09-21 12:37:53
tags:
---

```json
{
  "files.eol": "\n",
  "prettier.semi": true, //去掉代码结尾的分号
  "prettier.singleQuote": true, //使用单引号替代双引号
  // "files.autoSave": "afterDelay",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "eslint.autoFixOnSave": true,
  "explorer.confirmDragAndDrop": false,
  "editor.insertSpaces": true, //转为空格
  "editor.tabSize": 2,
  "window.zoomLevel": 0,
  "editor.formatOnSave": true,
  // "editor.formatOnType":false,
  "editor.wordWrap": "on",
  "editor.detectIndentation": false,
  "eslint.options": {
    "plugins": [
      "html"
    ]
  },
  "emmet.syntaxProfiles": {
    "JavaScript React": "jsx",
    "vue-html": "html",
    "vue": "html",
    // "typescript": "html"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "emmet.triggerExpansionOnTab": true,
  "explorer.confirmDelete": false,
  "[javascript]": {},
}
```