# Nvim-Zura-Highliter
This is the highliter and Lsp for Zura when using nvim!

If you are using LazyVim or AstroVim then do the following.
Make a new file called zura.lua in the plugins folder in your neovim config.
Then put the code below into the file then restart!
```lua
return {
  "neovim/nvim-lspconfig",
  lazy = false,
  priority = 1000,
  config = function()
    -- Filetype setup
    vim.filetype.add({
      extension = { zu = "zura" },
      pattern = { [".*%.zu"] = "zura" },
    })

    -- LSP setup
    local lspconfig = require("lspconfig")
    local configs = require("lspconfig.configs")

    if not configs.zura_ls then
      configs.zura_ls = {
        default_config = {
          cmd = { "/home/thedevconnor/Zura-Transpiled/release/zura", "-lsp" },
          filetypes = { "zura" },
          root_dir = lspconfig.util.root_pattern(".git", ".zura-root"),
        },
      }
    end

    lspconfig.zura_ls.setup({})
  end,
}
```
Also if you want syntax highliting make sure to put the zura.vim file in a folder called ``syntax`` in the main directory for your neovim configuration.
