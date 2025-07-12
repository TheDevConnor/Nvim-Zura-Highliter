# Nvim-Zura-Highlighter

Make sure you have Tree-sitter installed. Neovim comes with it built-in, but if you're missing system-level support, you’ll need to install it manually.

## Installation

### 1. Clone the Repository

Clone the highlighter repository somewhere on your system:

```
git clone https://github.com/TheDevConnor/Nvim-Zura-Highliter
```

### 2. Configure Tree-sitter in Neovim (Lua)

If you're using a plugin manager like Lazy.nvim, add the following Lua snippet to your Neovim config:

```lua
require('nvim-treesitter.parsers').get_parser_configs().zura = {
  install_info = {
    url = "path/to/the/cloned/repo", -- Replace with the actual path
    files = { "src/parser.c" },
    generate_requires_npm = true,
    requires_generate_from_grammar = true,
  },
  filetype = "zura",
}

vim.treesitter.language.register('zura', 'zura')
```

### 3. Filetype Detection

Create a `ftdetect` directory in your Neovim config (e.g. `~/.config/nvim/ftdetect/`), and inside it, create a `zura.vim` file with the following contents:

```vim
autocmd BufRead,BufNewFile *.zu set filetype=zura
```

### 4. Create Highlight Queries

In your Neovim config directory (e.g. `~/.config/nvim/queries/zura/`), create a file named `highlights.scm` and paste the following Tree-sitter highlight rules:

```s
(import_b_keyword) @keyword  
(const_keyword) @keyword
(case_keyword) @keyword
(enum_keyword) @keyword
(break_keyword) @keyword
(default_keyword) @keyword
(match_keyword) @keyword
(else_keyword) @keyword
(elseif_keyword) @keyword
(struct_keyword) @keyword
(have_keyword) @keyword
(auto_keyword) @keyword
(fn_keyword) @keyword
(if_keyword) @keyword
(return_keyword) @keyword
(loop_keyword) @keyword

(identifier_fn) @function
(call_b_keyword) @function.macro
(built_in_funcs) @function.macro

(escape_sequence) @string.escape
(double_quoted_string) @string
(single_quoted_string) @character

(popen) @punctuation.bracket
(pclose) @punctuation.bracket
(bopen) @punctuation.bracket
(bclose) @punctuation.bracket
(bropen) @punctuation.bracket
(brclose) @punctuation.bracket
(arrow_open) @punctuation.bracket
(arrow_close) @punctuation.bracket
(dot) @punctuation.bracket
(semi) @punctuation.delimiter
(colon) @punctuation.delimiter
(comma) @punctuation.delimiter

(unary_ops) @operator
(bin_operators) @operator
(bang_t) @operator
(ques_t) @operator
(mul_op) @operator
(eq_op) @operator
(walrus_op) @operator
(pree_ops) @operator
(arrow_point) @operator
(and) @operator

(number) @number
(comment) @comment

(identifier) @module
(identifier_c) @constant
(identifier_sp) @property
(identifier_t) @type
```

## Final Setup

Once everything is configured:

1. Open Neovim.
2. Run:

```
:TSInstall zura
```

3. After installation completes, restart Neovim.

Now, opening `.zu` files should activate syntax highlighting for the Zura language.
