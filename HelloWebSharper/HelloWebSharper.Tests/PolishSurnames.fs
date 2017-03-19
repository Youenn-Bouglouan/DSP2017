module PolishNames.Tests

open HelloWebSharper.PolishSurnames
open Swensen.Unquote
open Xunit
open FsUnit.Xunit

[<Fact>]
let ``containsCharCI should return true if the char is present in the string at least one`` () =
    test
        <@
        containsCharCI 'c' "abc" = true &&
        containsCharCI 'C' "1abcd" = true &&
        containsCharCI 'f' "a123cF" = true
        @>

[<Fact>]
let ``containsCharCI should return false if the char is absent from the string`` () =
    test
        <@
        containsCharCI 'x' "abc" = false &&
        containsCharCI 'X' "1abcd" = false
        @>

[<Fact>]
let ``containsCharCI should return false if the string is empty`` () =
    test <@ containsCharCI 'x' "" = false @>

[<Fact>]
let ``containsCharCI should throw if the string is null`` () =
    raises<System.ArgumentNullException> <@ containsCharCI 'x' null = false @>