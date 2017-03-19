namespace HelloWebSharper

open WebSharper
open System

module Server =
    
    let sayHello usr = 
        if usr = "" then "A stranger has no name?"
        else "Hello, " + usr + "!"

    [<Remote>]
    let SayHelloAsync username =
        async { return sayHello username }
        
    [<Remote>]
    let IsSurnamePolishAsync username =
        async {
            let helloMessage = sayHello username       
            let surnameOnly = PolishSurnames.TryExtractSurname username
            
            match surnameOnly with
            | None -> return (username, helloMessage, None)
            | Some surname -> return (username, helloMessage, Some (PolishSurnames.IsSurnamePolish surname))
         }