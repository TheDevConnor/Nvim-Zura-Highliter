package tree_sitter_zura_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_zura "github.com/tree-sitter/tree-sitter-zura/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_zura.Language())
	if language == nil {
		t.Errorf("Error loading Zura grammar")
	}
}
