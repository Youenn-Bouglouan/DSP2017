namespace HelloWebSharper

open WebSharper

module Server =
    
    let sayHello usr = "Hello, " + usr + "!"

    [<Remote>]
    let sayHelloAsync username =
        async { return sayHello username }