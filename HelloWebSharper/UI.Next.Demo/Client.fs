namespace UI.Next.Demo

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html

[<JavaScript>]
module Client =
 
    type NavbarSampleTemplate = Templating.Template<"navbar_sample.html">
    type BsNavbarTemplate = Templating.Template<"bootstrap_navbar.html">

    type Tab = { Name: string; Url: string; IsActive: Var<bool> }

    let sampleTabs = [
        {Name = "First tab"; Url = "/#"; IsActive = Var.Create true }
        {Name = "Second tab"; Url = "/#"; IsActive = Var.Create false }
    ]

    let Main =
        
        // Reactive variables
        let brand = Var.Create "Play With UI.Next!"
        let newTabName = Var.Create ""
        let newTabUrl = Var.Create ""
        let tabs = ListModel.Create (fun t -> t.Name) sampleTabs
        
        /// create a new tab (name and url) from the HTML template.
        let mapTab tab = 
            BsNavbarTemplate.Tab.Doc(
                Name = View.Const tab.Name,
                Url = View.Const tab.Url,
                ActiveClass = Attr.DynamicClass "active" tab.IsActive.View id,
                SetActive = fun _ _ ->
                    tabs.Iter (fun t -> if t.Name <> tab.Name then Var.Set t.IsActive false)
                    Var.Set tab.IsActive true
            )

        /// instantiate the navbar.
        let initNavbar = 
            BsNavbarTemplate.Doc(
                Brand = brand.View,
                Tabs = [
                    tabs.View |> Doc.BindSeqCached mapTab
                ]
            )

        /// add a new tab to the navbar and reset the input.
        let addNewTab () =
            tabs.Add { Name = newTabName.Value; Url = newTabUrl.Value; IsActive = Var.Create false }
            Var.Set newTabName ""
            Var.Set newTabUrl ""

        // Wire up the whole page and run it under the 'main' div.
        NavbarSampleTemplate.Doc(
            Brand = brand,
            NavBar = [initNavbar],
            NewTabName = newTabName,
            NewTabUrl = newTabUrl,
            CreateNewTab = fun _ _ -> addNewTab()
        )
        |> Doc.RunById "main"