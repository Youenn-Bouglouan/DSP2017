namespace HelloWebSharper

open WebSharper
open WebSharper.JavaScript
open WebSharper.Html.Client
open HelloWebSharper.PolishSurnames

[<JavaScript>]
module Client =

    let DisplaySurnameOrigin origin =
        match origin with
        | SurnameOrigin.NotPolish -> "not Polish"
        | SurnameOrigin.ProbablyPolish -> "probably Polish"
        | SurnameOrigin.DefinitelyPolish -> "definitely Polish"

    let DisplaySurnameStats stats =
        stats.Origin
        |> DisplaySurnameOrigin
        |> sprintf "Based on your surname, we deduced that you are %s! Did we get it right?"
        
    let Main () =
        let input = Input [Attr.Value ""] -< []
        let helloOutput = H1 [Text "Hello, Stranger...?"]
        let statsOutput = H4 [Text ""]
        let inputValue = H4 []
        let someStaticText = P []
        let mutable clickCounter = 1

        Div [
            input

            Button [Text "Send to server"] // Sends a request to the server
            |>! OnClick (fun _ _ ->
                async {
                    inputValue.Text <- input.Value
                    let! (username, helloMessage, stats) = Server.IsSurnamePolishAsync input.Value
                    helloOutput.Text <- helloMessage
                    
                    if username = "" then statsOutput.Text <- "No data, no stats! What were you thinking?"
                    else               
                        match stats with
                        | None -> statsOutput.Text <- "That's a nice name. We could tell you interesting stuff if you provided us with a surname too!"
                        | Some s -> statsOutput.Text <- DisplaySurnameStats s
                }
                |> Async.Start
            )

            Div [Attr.Class "hello"] -< [helloOutput]
            Div [Attr.Class "surnameStats"] -< [statsOutput]
            
            HR []
            
            Button [Text "How many times did I click this button?"] // Runs an action on the client side
                |>! OnClick (fun _ _ ->
                    someStaticText.Text <- sprintf "You clicked the button %d times." clickCounter
                    clickCounter <- clickCounter + 1
                )

            Div [] -< [someStaticText]
        ]