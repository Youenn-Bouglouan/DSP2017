namespace UI.Next.Demo

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html

[<JavaScript>]
module Client =   
    
    open WebSharper.JQuery
 
    type NavbarSampleTemplate = Templating.Template<"navbar_sample.html">
    type BsNavbarTemplate = Templating.Template<"bootstrap_navbar.html">

    let Main =
        JQuery.Of("#main").Empty().Ignore
        
        let brand = Var.Create "Default brand"
        let newTabName = Var.Create ""
        let test = Var.Create "test"
       
        let navBar = 
            BsNavbarTemplate.Doc(
                Brand = brand.View
            )
        
        NavbarSampleTemplate.Doc(
            Brand = brand,
            NavBar = [navBar],
            NewTabName = newTabName,
            Test = test,
            CreateNewTab = fun elem event -> (Var.Set test "clicked!")
        )
        |> Doc.RunById "main"