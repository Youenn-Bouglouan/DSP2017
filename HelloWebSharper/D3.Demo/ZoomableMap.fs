namespace D3.Demo

open WebSharper
open WebSharper.JavaScript
open WebSharper.JQuery
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.D3
open WebSharper.Html.Client

[<AutoOpen>]
[<JavaScript>]
module D3Helpers =

    let Defer (job: (obj * 'T -> unit) -> unit) : Async<'T> =
        Async.FromContinuations(fun (ok, error, _) -> job (fun (err, data) -> if As err then error (exn ("Defer: failed")) else ok data))

    type D3 with
        static member Json(url: string) = Defer(fun callback -> D3.Json(url, callback))
        static member Tsv(url: string) = Defer(fun callback -> D3.Tsv(url, callback))

[<JavaScript>]
module ZoomableMap =

    type ITopoJson =
        abstract feature : topology: obj * geoObject: obj -> obj
        abstract mesh : topology: obj * geoObject: obj * filter: (obj * obj -> bool) -> obj

    let topojson : ITopoJson =
        JS.Global?topojson

    [<AbstractClass>]
    type State =
        inherit D3.Feature
    
    type CanvasDimensions = { Width: float; Height: float }

    let private Render (canvas: Dom.Element) =
        let dimensions = { Width = 960.; Height = 500. }
        
        /// Store the index of the currently selected state. '-1' means that no state is currently selected.
        let noStateSelectedIndex = -1
        let mutable currentStateIndex = noStateSelectedIndex
        
        let resetCurrentState () =
            currentStateIndex <- noStateSelectedIndex

        let projection =
            D3.Geo.AlbersUsa()
                .Scale(1070.)
                .Translate(dimensions.Width / 2., dimensions.Height / 2.)

        let path = 
            projection |> D3.Geo.Path().Projection

        let svg = 
            D3.Select(canvas)
                .Append("svg")
                .Attr("width", dimensions.Width)
                .Attr("height", dimensions.Height)

        /// Function called when the user clicks on the map
        let onClicked (eventData:obj * int) =

            let mutable x : float = 0.
            let mutable y : float = 0.
            let mutable k : float = 0.
                        
            let stateClicked, stateClickedIndex = eventData
            printfn "stateClickedIndex: %i" stateClickedIndex
            printfn "currentStateIndex: %i" stateClickedIndex

            // If the user clicks on a state different than the currently selected state
            if sprintf "%A" stateClicked <> "undefined" && stateClickedIndex <> noStateSelectedIndex && currentStateIndex <> stateClickedIndex then
                let cX, cY = path.Centroid(stateClicked :?> Feature)
                x <- float cX
                y <- float cY
                k <- 4.
                currentStateIndex <- stateClickedIndex
            // If the user clicks outside of the map or on the currently selected state
            else
                x <- dimensions.Width / 2.
                y <- dimensions.Height / 2.
                k <- 1.
                resetCurrentState()

            let svgG = D3.Select("#svg-group")

            svgG.SelectAll("path")
                .Classed("active", fun (_, i) -> currentStateIndex <> noStateSelectedIndex && currentStateIndex = i)
                |> ignore

            svgG.Transition()
                .Duration(750)
                .Attr("transform", SvgTransform.Translate(dimensions.Width / 2., dimensions.Height / 2.) + SvgTransform.Scale(k) + SvgTransform.Translate(-x, -y))
                |> ignore

        svg.Append("rect")
            .Attr("class", "background")
            .Attr("width", dimensions.Width)
            .Attr("height", dimensions.Height)
            .On("click", onClicked)
            |> ignore

        let svgGroup =
            svg.Append("g").Attr("id", "svg-group")

        // Download the JSON representing the map and draw it on the screen
        async {    
            let! map = D3.Json("Content/us.json")
            let states : obj[] = topojson.feature(map, map?objects?``states``)?features
            let borders = topojson.mesh(map, map?objects?``states``, fun (a, b) -> a !==. b)

            // Print debug info to web console
            //printfn "dumping borders:\n%A" borders
            //printfn "dumping borders:\n%A" map?objects?``states``

            // Draw states
            svgGroup
                .Append("g")
                .Attr("id", "states")
                .SelectAll("path")
                .Data(states)
                .Enter().Append("path")
                .Attr("d", path)
                .On("click", onClicked)
                |> ignore

            // Draw borders between states
            svgGroup
                .Append("path")
                .Datum(borders) // For some reason, borders doesn't contain any data here.
                .Attr("id", "state-borders")    
                .Attr("d", path)
                |> ignore
        }
        |> Async.Start

    // Render everything under the 'main' div
    let Main =
        let canvas = JS.Document.GetElementById("main")
        Render canvas