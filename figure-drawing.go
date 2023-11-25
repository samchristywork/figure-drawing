package main

import (
	"fmt"
	"net/http"
)

func serve() {
	http.Handle("/", http.FileServer(http.Dir("./static")))

	fmt.Println("Listening on port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		panic(err)
	}
}

func main() {
	serve()
}
