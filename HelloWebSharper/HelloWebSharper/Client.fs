namespace HelloWebSharper

open WebSharper
open WebSharper.JavaScript
open WebSharper.Html.Client
open HelloWebSharper.PolishSurnames

module Resources =
    open WebSharper.Core.Resources

    // Declare resource files. Those must be added to the VS project as Embedded Resources!
    [<assembly:System.Web.UI.WebResource("custom_styles.css", "text/css")>]
    do ()

    // Declare types for automatic dependency resolution
    type Styles() =
        inherit BaseResource("custom_styles.css")

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

    [<Require(typeof<Resources.Styles>)>]
    let ReplaceDataExample () =
        Div [
            H1 [Attr.Class "styleFromSeparateCssFile"] -< [Text "This is inserted via a data-replace attribute (client-side)"]
            P [Attr.Class "styleFromSeparateCssFile"] -< [Text "This content is generated on client-side by JavaScript code!"]
        ]