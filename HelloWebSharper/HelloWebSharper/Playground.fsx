module Test =

    let mutable myVar = 0

    let increment x = 
        myVar <- myVar + x
        myVar

    let decrement x = 
        myVar <- myVar - x
        myVar

Test.increment 2 // 2
Test.decrement 3 // -1
Test.increment 10 // 9
Test.myVar <- 0
Test.myVar