open System

#time "on"
#time "off"

let containsCharCI (c:char) word =
    word
    |> Seq.tryFind (fun current -> Char.ToLower current = Char.ToLower c)
    |> Option.isSome

containsCharCI 'c' "a123cf" // true
containsCharCI '2' "a123cf" // true
containsCharCI 'x' "a123cf" // false
containsCharCI 'X' "a123cf" // false
containsCharCI 'F' "a123cf" // true

let countCharsCI (c:char) word =
    word
    |> Seq.filter (fun current -> Char.ToLower current = Char.ToLower c) 
    |> Seq.length

countCharsCI 'c' "ccc" // 3
countCharsCI 'c' "cCc" // 3
countCharsCI 'c' "" // 0
countCharsCI '2' "145" // 0
countCharsCI '3' "3f3sdf" // 2

let applyPointsPerChar c word =
    countCharsCI c word
    |> (*)

applyPointsPerChar 'c' "cc" 5 // 10
applyPointsPerChar 'a' "ccc" 50 // 0

let applyPointsPerPolishChar word points =
    let polishChars = ['ą';'ć';'ę';'ł';'ń';'ó';'ś';'ż';'ź']
    polishChars
    |> List.map (fun pc -> (applyPointsPerChar pc word) points)
    |> List.reduce (+)

applyPointsPerPolishChar "Żaneta Jażdżyk" 1 // 3
applyPointsPerPolishChar "Bob Johnson" 1 // 0
applyPointsPerPolishChar "" 1 // 0