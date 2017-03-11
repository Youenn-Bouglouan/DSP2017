namespace HelloWebSharper

open System

module PolishNames =

    let containsCharCI (c:char) word =
        word
        |> Seq.tryFind (fun current -> Char.ToLower current = Char.ToLower c)
        |> Option.isSome

    let countCharsCI (c:char) word =
        word
        |> Seq.filter (fun current -> Char.ToLower current = Char.ToLower c) 
        |> Seq.length