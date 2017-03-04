namespace HelloWebSharper

open WebSharper
open WebSharper.JavaScript
open WebSharper.Html.Client

[<JavaScript>]
module Client =

    let Main () =
        let input = Input [Attr.Value ""] -< []
        let output = H1 [Text "Hello, Stranger...?"]
        let inputValue = H4 []
        let someStaticText = P []
        let mutable clickCounter = 1

        Div [
            input

            Button [Text "Send to server"] // Sends a request to the server
            |>! OnClick (fun _ _ ->
                async {
                    inputValue.Text <- input.Value
                    let! data = Server.sayHelloAsync input.Value
                    output.Text <- data
                }
                |> Async.Start
            )

            Div [Attr.Class "hello"] -< [output]
            
            HR []
            
            Button [Text "Run some client-side action"] // Runs an action on the client side
                |>! OnClick (fun _ _ ->
                    someStaticText.Text <- sprintf "You clicked the button %d times." clickCounter
                    clickCounter <- clickCounter + 1
                )

            Div [] -< [someStaticText]
        ]