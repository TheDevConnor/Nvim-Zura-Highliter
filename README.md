# Nvim-Zura-Highliter
This is the highliter for Zura when using nvim!

If you are using nvim then you need to put 
```
-- Ensure .zu files are recognized as zura and not zimbu
vim.api.nvim_create_autocmd({ "BufNewFile", "BufRead" }, {
  pattern = "*.zu",
  callback = function() vim.bo.filetype = "zura" end,
})
```
in your init.lua
