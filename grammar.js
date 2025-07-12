/**
 * @file Zura 
 * @author NoTimeDev
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "zura",

  conflicts: $ => [
    [$.expression, $.array_acsses],
    [$.bin_operators, $.unary_ops, $.and],
    [$.bin_operators, $.unary_ops],
    [$.identifier_t, $.identifier_fn],
    [$.struct_const, $.block],
    [$.and, $.bin_operators],
    [$.identifier, $.identifier_fn],
  ],

  extras: $ => [
    $.comment, 
    /\s|\\\r?\n/,
  ],
  
  rules: {
    source_file: $ => repeat($.statement),
    comment: _ => token(prec(-10, /#.*/)),
    statement: $ => choice(
      $.function_def,
      $.global_var_def,
      $.local_var_def,
      $.auto_var_def,
      $.assignment,
      $.return_,
      $.loop_iter_cond_prefix,
      $.loop_iter_cond, 
      $.loop_cond_prefix,
      seq($.expression, $.semi),
      $.semi,
      $.block,
      $.if_statement,
      $.else_statement,
      $.elseif_statement,
      $.structdef,
      $.enumdef,
      $.matchdef,
      $.import_, 
      $.loop_cond,
      seq($.break_keyword, $.semi),
    ),

    expression: $ => choice(
      $.rval,
      $.lval
    ),

    lval: $ => choice(
      $.identifier,
      $.bracket_e,
      $.array_acsses,
      $.deref,
      $.built_in_funcs_expr,
      $.call_built,
      $.func_call,
      $.dot_
    ),

    rval: $ => choice(
      $.number,
      $.binop,
      $.pree_expr, 
      $.post_expr,
      $.unary_expr,
      $.array_const,
      $.struct_const,
      $.double_quoted_string, 
      $.single_quoted_string
    ),
   
    if_keyword: $ => token("if"),
    else_keyword: $ => token("else"),
    elseif_keyword: $ => token("elseif"),
    
    import_b_keyword: $ => token("@import"),
    call_b_keyword: $ => token("@call"),
    case_keyword: $ => token("case"),
    enum_keyword: $ => token("enum"),
    break_keyword: $ => token("break"),
    default_keyword: $ => token("default"),
    match_keyword: $ => token("match"),
    struct_keyword: $ => token("struct"),
    have_keyword: $ => token("have"),
    auto_keyword: $ => token("auto"),
    const_keyword: $ => token("const"),
    loop_keyword: $ => token("loop"),
    return_keyword: $ => token("return"),
    fn_keyword: $ => token("fn"),
    walrus_op: $ => token(":="),
    
    arrow_point: $ => token("->"),
    mul_op: $ => token('*'),
    and: $ => token('&'),
    eq_op: $ => token('='),
    
    popen: $ => token("("),
    pclose: $ => token(")"),

    bopen: $ => token("{"),
    bclose: $ => token("}"),
 
    bropen: $ => token("["),
    brclose: $ => token("]"),
     
    arrow_open: $ => token("<"),
    arrow_close: $ => token(">"),
    
    comma: $ => token(","),
    colon: $ => token(":"),
    semi: $ => token(";"),
    
    ques_t: $ => token("?"),
    bang_t: $ => token("!"),
    dot: $ => token("."),


    bin_operators: $ => choice(
      $.mul_op, 
      "+",
      "-",
      "/",
      ">>",
      "<<",
      "!=",
      "&&",
      "<=",
      ">=",
      ">",
      "<",
      "==",
      "&",
      "|",
      "^",
      "%"
    ),
    

    unary_ops: $ => choice( 
      "+",
      "-",
      "!",
      "~",
      "&",
    ),
   
    built_in_funcs: $ => seq(
      '@',
      choice(
        "output",
        "input",
        "outputln",
        "alloc",
        "free",
        "memcpy",
        "cast",
        "sizeof",
        "open",
        "close",
        "socket",
        "bind",
        "listen",
        "accept",
        "recv",
        "send",
        "getArgv",
        "getArgc",
        "extern",
        "link",
        "streq"
      )
    ),

    dot_: $ => prec.left(seq(
      $.expression, 
      $.dot, 
      $.identifier,
    )),
    built_in_funcs_expr: $ => prec.left(seq(
      $.built_in_funcs, 
      optional(seq(
        $.arrow_open,
        optional(seq(
          sepBy($.comma, $.type),
          optional($.comma)
        )),
        $.arrow_close, 
      )),
      $.popen, 
      optional(seq(
        sepBy($.comma, $.expression),
        optional($.comma)
      )),
      $.pclose,
    )),

    import_: $ => prec.left(seq(
      $.import_b_keyword, 
      $.double_quoted_string,
    )),

    call_built: $ => prec.left(seq(
      $.call_b_keyword, 
      $.arrow_open,
      $.identifier_t,
      $.arrow_close, 
      $.popen, 
      optional(seq(
        sepBy($.comma, $.expression),
        optional($.comma)
      )),
      $.pclose,
    )),

    func_call: $ => prec.left(seq(
      $.identifier_fn, 
      $.popen,
      optional(seq(
        sepBy($.comma, $.expression),
        optional($.comma)
      )),
      
      $.pclose,
    )),
    matchdef: $ => prec.left(seq(
      $.match_keyword,
      $.expression, 
      $.bopen,
      optional(repeat(choice($.dcases, $.cases))),
      $.bclose,
    )),

    cases: $ => prec.left(seq(
      $.case_keyword,
      $.expression, 
      $.arrow_point,
      $.statement,
    )),

    dcases: $ => prec.left(seq(
      $.default_keyword,
      $.arrow_point, 
      $.statement
    )), 
    struct_const: $ => prec.left(seq(
      $.bopen,
      optional(seq(
        sepBy($.comma, seq($.identifier_sp, $.colon, $.expression)),
        optional($.comma)
      )),
      $.bclose,
    )),

    deref: $ => prec.left(seq(
      $.expression, 
      $.and 
    )),

    structdef: $ => prec.left(seq(
      $.const_keyword, 
      $.identifier_t, 
      $.walrus_op, 
      $.struct_keyword, 
      $.bopen, 
      repeat($.struct_arg),
      $.bclose,
      $.semi,
    )),

    enumdef: $ => prec.left(seq(
      $.const_keyword,
      $.identifier_t,
      $.walrus_op, 
      $.enum_keyword,
      $.bopen,
      optional(seq(
        sepBy($.comma, $.identifier_c),
        optional($.comma)
      )),
      $.bclose, 
      $.semi
    )),

    struct_arg: $ => prec.left(seq(
      $.identifier_sp,
      choice(
        seq(
          $.walrus_op,
          $.struct_fn,
        ),
        seq(
          $.colon,
          $.type,
          optional($.comma)
        )
      )
    )),

    struct_fn: $ => prec.left(seq(
      $.fn_keyword,
      $.popen,
      optional(seq(
        sepBy($.comma, $.function_arg),
        optional($.comma)
      )),
      $.pclose, 
      $.type, 
      $.bopen, 
      optional(repeat($.statement)),
      $.bclose,
      $.semi, 
    )),

    array_acsses: $ => prec.left(seq(
      $.lval,
      $.bropen,
      $.expression,
      $.brclose
    )),

    array_const: $ => prec.left(seq(
      $.bropen,
      optional(seq(
        sepBy($.comma, $.expression),
        optional($.comma)
      )),
      $.brclose
    )),

    unary_expr: $ => prec.left(seq(
      $.unary_ops, 
      $.expression,
    )),

    bracket_e: $ => prec.left(seq(
      $.popen,
      $.expression,
      $.pclose,
    )),

    pree_ops: $ => choice(
      "--",
      "++"
    ),

    pree_expr: $ => prec.left(seq(
      $.pree_ops, 
      $.expression
    )),

    post_expr: $ => prec.left(seq(
      $.expression, 
      $.pree_ops,
    )),

    binop: $ => prec.left(seq(
      $.expression,
      $.bin_operators, 
      $.expression,
    )), 
  
    block: $ => prec.left(seq(
      $.bopen,
      optional(repeat($.statement)),
      $.bclose,
    )),

    if_statement: $ => prec.left(seq(
      $.if_keyword, 
      $.expression, 
      $.statement,
    )),

    elseif_statement: $ => prec.left(seq(
      $.elseif_keyword,  
      $.expression, 
      $.statement,
    )),

    else_statement: $ => prec.left(seq(
      $.else_keyword, 
      $.statement
    )),

    loop_iter_cond_prefix: $ => prec.left(seq(
      $.loop_keyword,
      $.popen, 
      $.identifier, 
      $.eq_op, 
      $.expression,
      $.semi, 
      $.expression,
      $.pclose, 
      $.colon, 
      $.popen, 
      $.expression,
      $.pclose,
      $.statement,
    )),

    loop_iter_cond: $ => prec.left(seq(
      $.loop_keyword,
      $.popen, 
      $.identifier, 
      $.eq_op, 
      $.expression,
      $.semi, 
      $.expression,
      $.pclose, 
      $.statement,
    )),
    
    loop_cond_prefix: $ => prec.left(seq(
      $.loop_keyword,
      $.popen, 
      $.expression,
      $.pclose, 
      $.colon, 
      $.popen, 
      $.expression,
      $.pclose,
      $.statement,
    )),

    loop_cond: $ => prec.left(seq(
      $.loop_keyword,
      $.popen, 
      $.expression,
      $.pclose, 
      $.statement,
    )),

    return_: $ => prec.left(seq(
      $.return_keyword, 
      $.expression, 
      $.semi,
    )),

    assignment: $ => prec.left(seq(
      $.lval,
      $.eq_op,
      $.expression
    )),

    global_var_def: $ => prec.left(seq(
      $.const_keyword,
      $.identifier, 
      $.colon, 
      $.type, 
      optional(prec.left(seq(
        $.eq_op, 
        $.expression
      ))),
      $.semi 
    )),

    local_var_def: $ => prec.left(seq(
      $.have_keyword,
      $.identifier, 
      $.colon, 
      $.type, 
      optional(prec.left(seq(
        $.eq_op, 
        $.expression
      ))),
      $.semi 
    )),

    auto_var_def: $ => prec.left(seq(
      $.auto_keyword,
      $.identifier,  
      $.eq_op, 
      $.expression,
      $.semi 
    )),

    function_def: $ => prec.left(seq(
      $.const_keyword, 
      $.identifier_fn,
      $.walrus_op, 
      $.fn_keyword, 
      $.popen,
      optional(seq(
        sepBy($.comma, $.function_arg),
        optional($.comma)
      )),
      $.pclose, 
      $.type, 
      $.bopen, 
      optional(repeat($.statement)),
      $.bclose,
      $.semi, 
    )),

    function_arg: $ => prec.left(seq(
      $.identifier, 
      $.colon, 
      $.type
    )),

    type: $ => choice(
      $.identifier_t,
      $.q_type,
      $.b_type,
      $.pointer_type, 
      $.array_type
    ),

    pointer_type: $ => prec.left(seq(
      $.mul_op, 
      $.type, 
    )),

    array_type: $ => prec.left(seq(
      $.bropen,  
      optional($.number),
      $.brclose, 
      $.type, 
    )),

    q_type: $ => prec.left(seq(
      $.identifier_t, 
      $.ques_t,
    )),

    b_type: $ => prec.left(seq(
      $.identifier_t, 
      $.bang_t, 
    )),

    double_quoted_string: $ => seq(
      '"',
      repeat(choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^\\"\n]+/))
      )),
      '"'
    ),

    single_quoted_string: $ => seq(
      "'",
      repeat(choice(
        $.escape_sequence,
        token.immediate(prec(1, /[^\\"\n]+/))
      )),
      "'"
    ),

    escape_sequence: _ => token(prec(1, seq(
      '\\', 
      choice(
        /[^xuU]/,
        /\d{2,3}/,
        /x[0-9a-fA-F]{1,4}/,
        /u[0-9a-fA-F]{4}/,
        /U[0-9a-fA-F]{8}/,
      ),
    ))),

    identifier: $ => /[_a-zA-Z][_a-zA-Z0-9]*/,
    identifier_c: $ => /[_a-zA-Z][_a-zA-Z0-9]*/,
    identifier_sp: $ => /[_a-zA-Z][_a-zA-Z0-9]*/,
    identifier_t: $ => /[_a-zA-Z][_a-zA-Z0-9]*/,
    identifier_fn: $ => /[_a-zA-Z][_a-zA-Z0-9]*/,
    number: $ => choice(
      /[0-9]+/,
      /[0-9]*\.[0-9]+/    // allows `.5`, `0.5`, `123.45`, etc.
    ),
  }
});

function sepBy(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}

