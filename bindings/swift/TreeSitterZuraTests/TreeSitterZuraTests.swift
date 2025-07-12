import XCTest
import SwiftTreeSitter
import TreeSitterZura

final class TreeSitterZuraTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_zura())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Zura grammar")
    }
}
