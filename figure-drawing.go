package main

import (
	"net/http"
)

func serve() {
	http.Handle("/", http.FileServer(http.Dir("./static")))

	http.ListenAndServe(":8000", nil)
}

func main() {
	serve()
}
