module HelloWebSharper.Tests

open HelloWebSharper.Server
open Swensen.Unquote
open Xunit
open FsUnit.Xunit

// A simple test using XUnit + FsUnit
[<Fact>]
let ``1 + 1 should equal 2`` () =
    1 + 1 |> should equal 2

// A simple test using Unquote
[<Fact>]
let ``2 + 2 should equal 4`` () =
    test <@ 2 + 2 = 4 @>

// A test of the synchronous sayHello, using XUnit + FsUnit
[<Fact>]
let ``sayHello should say hello to the user passed as parameter`` () =
    sayHello "Samantha" |> should equal "Hello, Samantha!"

// A test of the asynchronous sayHelloAsync, using XUnit + FsUnit
[<Fact>]
let ``sayHelloAsync should say hello to the user passed as parameter`` () = Async.StartAsTask <| async {
    let! answer = sayHelloAsync "Richard"
    answer |> should equal "Hello, Richard!"
}

// A test of the asynchronous sayHelloAsync, using Unquote
[<Fact>]
let ``sayHelloAsync should NOT say hello to John when Richard was passed as parameter`` () =     
    let answer = async { return! sayHelloAsync "Richard" } |> Async.RunSynchronously
    test <@ answer <> "Hello, John!" @>