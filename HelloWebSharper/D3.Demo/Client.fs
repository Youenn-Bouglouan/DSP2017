namespace D3.Demo

open WebSharper
open WebSharper.JavaScript
open WebSharper.JQuery
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.D3
open WebSharper.Html.Client

[<JavaScript>]
module Client =

    [<Inline "+$x">]
    let inline double (x: 'T) = double x

    let Data = [| 10.0 .. 10.0 .. 100.0 |]

    /// D3 operates in terms of "joins".
    /// Roughly, a join syncs a data collection to a DOM element collection, 1:1.
    /// Existing elements are updated with their matching data points.
    /// For data points without a matching element, new elements are created ("enter").
    /// Elements without a matching data points, typically are removed ("exit").
    let Join (data: double[]) (context: Dom.Element) =

        /// First, setup a context.
        let ctx =
            D3.Select(context) // select the element
                .Append("svg") // append a new <svg/> and focus on it
                .Attr("height", 500) // give a height to the <svg/>; width = auto

        /// Let us define the join.
        /// Select some elements (SVG circles) and the data set.
        /// Note that WebSharper types the result as `Selection<double>`
        /// since you gave a `double[]` - to help you with types later on.
        let joined = ctx.SelectAll("circle").Data(data)

        /// Now, "enter" selection describes what happens to elements that
        /// enter the theater stage so to speak, that is, how do we create
        /// elements for data points that do not have an element yet.
        /// Here we create circles and set some attributes, dependent on data.
        joined.Enter()
            .Append("circle")
            .AttrFn("cx", fun x -> x * 5.) // center x coord
            .AttrFn("cy", fun x -> 50. + x * x / 40.) // center y coord
            .AttrIx("r", fun (x, i) -> // radius as a function of data point and index
                let p = double i / double data.Length
                7. + 5. * sin (3. * p * Math.PI))
        |> ignore

    let Main =
        let main = JS.Document.GetElementById("main")
        Join Data main